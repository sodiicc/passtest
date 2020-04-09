import { Component, Input, ElementRef} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PhoneModel} from "./_models/phone.model";
import {AuthService} from "../../_services/authorization.service";

@Component({
    selector: 'phone-input',
    templateUrl: './phone.component.pug',
    styles: [String(require('./phone.component.styl'))]
})
export class PhoneComponent {
    @Input() onSuccess: any = (phone: PhoneModel, form: any): void => null;
    @Input() codeSelect: boolean;
    @Input() onInput: any = (value: PhoneModel, form: any): void => null;
    @Input() value: string;
    @Input() placeholder: string = '0000000000';
    container: any;
    code: AbstractControl;
    codeForm: FormGroup;
    list_codes: Object[];

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService,
                private elRef: ElementRef){}

    ngOnInit() {
        this.list_codes = [
            {'country': 'UA', 'code': '+38', 'display': '+38'},
            {'country': 'RU', 'code': '+7', 'display': '+7'},
        ];
        this.codeSelect = this.codeSelect || true;

        this.initCodeForm();

        this.container = this.elRef.nativeElement.querySelector('.phone-input').firstChild.nextSibling;
        if (this.value) {
            this.setValue(this.value);
        } else {
            this.setLocationCode();
        }

        this.focusAll();
    }

    extractStringCode(phone: string) {
        for (let i=0; i<this.list_codes.length; i++) {
            if (phone.startsWith(this.list_codes[i]['code'])) {
                return this.list_codes[i]
            }
        }

        return null;
    }

    getCode(country: string) {
        for (let i=0; i<this.list_codes.length; i++) {
            if (this.list_codes[i]['country'] == country) {
                return this.list_codes[i]
            }
        }
    }

    initCodeForm(): void {
        this.codeForm = this.formBuilder.group({
            'code': [45, Validators.compose([Validators.required])]
        });
        this.code = this.codeForm.controls['code'];
        this.codeForm.patchValue({code: this.list_codes[0]['code']});

        if (!this.codeSelect) this.code.disable();
    }

    setLocationCode(): void {
        this.authService.getCountry()
            .subscribe(data => {
                    let country = data['country'];

                    this.codeForm.patchValue({code: this.getCode(country)['code']});
                },
                err => {
                    this.authService.checkError(err);
                });
    }

    focusAll() {
        for (let i=0; i<this.container.children.length; i++) {
            let input =  this.container.children[i];
            if (input.value.length != input.max.length || i == this.container.children.length-1) {
                this.setCaretPosition(input, input.value.length);
                return;
            }
        }
    }

    setValue(phone: string) {
        // Setting the code
        let code = '';
        if (this.extractStringCode(phone)) {
            code = this.extractStringCode(phone)['code'];
            this.codeForm.patchValue({code: code});
        } else {
            this.setLocationCode();
        }
        phone = phone.substr(code.length);

        let position = 0;
        for (let input of this.container.children) {
            input.value = phone.substr(position, input.max.length);
            position += input.max.length;
        }
    }

    showMask(): boolean {
        return this.compileValue().length <= this.code.value.length
    }

    compileValue(): PhoneModel {
        let value = '';

        for (let input of this.container.children) {
            value += input.value;
        }

        return new PhoneModel(this.code.value, value);
    }

    processBackspace($event: any): void {
        if ($event.keyCode === 8 && !$event.srcElement.value.length) {
            this.processField($event);
        }
    }

    processField($event: any): void {
        // Rising an input callback
        this.onInput(this.compileValue(), this);

        let elem = $event.srcElement;

        // If value is greater than max allowed
        if (elem.value.length > elem.max.length) {
            elem.value = Number(String(elem.value).substring(0, elem.max.length));
        }

        if (elem.value.length >= elem.max.length || !elem.value.length) {
            //find next input
            let next = this.getNextField(elem, Boolean(elem.value.length));

            if (next) {
                next.focus();

                if (next.value.length) {
                    this.setCaretPosition(next, next.value.length);
                }
            }
        }
    }

    setCaretPosition(el: any, caretPos: number): boolean {
        el.value = el.value;

        if (el !== null) {
            if (el.createTextRange) {
                let range = el.createTextRange();
                range.move('character', caretPos);
                range.select();
                return true;
            }
            else {
                if (el.selectionStart || el.selectionStart === 0) {
                    el.focus();
                    el.setSelectionRange(caretPos, caretPos);
                    return true;
                }
                else {
                    el.focus();
                    return false;
                }
            }
        }
    }

    getNextField(elem: any, forward: boolean = true): any {
        let container = elem.parentNode;

        for (let i=0; i<container.children.length; i++) {
            if (container.children[i] == elem) {
                // If is last child
                if (i == container.children.length-1 && forward) {
                    this.onSuccess(this.compileValue(), this);
                    return false;
                } else if (i == 0 && !forward) {
                    return false;
                } else {
                    let next_elem;
                    if (forward) next_elem = container.children[i+1];
                    else next_elem = container.children[i-1];

                    // If next element has an empty space
                    if (next_elem.value.length >= next_elem.max.length && forward) {
                        this.getNextField(next_elem);
                    } else {
                        return next_elem;
                    }
                }
            }
        }
    }
}
