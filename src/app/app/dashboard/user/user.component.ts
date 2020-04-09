import {Component, OnInit} from '@angular/core';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from '@angular/forms';
import {Router, ActivatedRoute} from "@angular/router";
import {UserService} from '../../_services/user.service';
import {AgreementService} from '../../_services/agreement.service';
import {User} from '../../_models/user.model';
import {Agreement} from '../../_models/agreement.model';
import {AuthService} from "../../_services/authorization.service";
import {DictionaryService} from "../../_services/dictionary.service";
import {InterfaceService} from "../../_services/interface.service";
import {FcmService} from "../../_services/fcm.service";
import {PushNotificationsService} from 'angular2-notifications';
import {Interface, NavigationControl} from '../../_models/interface.model';

import {LanguageHelper} from '../../_helpers/language.helper'

declare let Notification: any;

@Component({
    selector: 'user',
    templateUrl: './user.component.pug',
    styles: [String(require('./user.component.styl'))]
})
export class UserComponent implements OnInit {

    current_form: FormGroup;

    user: User;
    message = '';
    defaultInterface: Interface;
    loading: boolean;
    is_editing: boolean;
    first_time: boolean;
    qroute: Array<string>;

    language_helper: LanguageHelper = new LanguageHelper();

    subscribed: boolean = false;
    subscribed_loading: boolean = false;
    agreement:Agreement;
    validateStr="Пожалуйста, заполните обязательное поле";

    constructor(private userService: UserService,
                private agreementService: AgreementService,
                private router: Router,
                private route: ActivatedRoute,
                private authService: AuthService,
                private interfaceService: InterfaceService,
                private formBuilder: FormBuilder,
                public sanitizer: DomSanitizer,
                private dictionary: DictionaryService,
                private msgService: FcmService,
                private pushNotifications: PushNotificationsService) {
    }

    autocompleteListFormatter = (data: any):SafeHtml => {
        let html = `<span>${data.name}</span>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    };

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.first_time = (params["first"] != undefined);
            this.qroute = params["route"];
            this.is_editing = !JSON.parse(localStorage.getItem('userReqFields'));
            this.loading = false;

            this.defaultInterface = new Interface();
            this.defaultInterface.title = "Мой профиль";
            this.defaultInterface.navClasses = ["navbar-white"];

            if (this.first_time) {
                this.defaultInterface.navControlsRightActive = true;
                this.defaultInterface.navControlsRight = new NavigationControl();
                this.defaultInterface.navControlsRight.classes = ["btn-control-arrow-right"];
                this.defaultInterface.navControlsRight.callback =
                    () => this.router.navigate(['/dashboard/feed']);
            }

            // Set loading
            this.interfaceService.loading(true);

            this.interfaceService.changeInterface(this.defaultInterface);
            this.userService.getUser()
                .subscribe(user => {
                        // Set loaded
                        this.interfaceService.loading(false);

                        this.user = user;
                        //console.log(this.user);

                        this.initForm();
                    },
                    err => {
                        // Set loaded
                        this.interfaceService.loading(false);

                        this.authService.checkError(err);
                    });
            this.agreementService.getAgreement()
                .subscribe(agr => this.agreement = agr);

            // Notifications
            this.subscribed = false;
            this.subscribed_loading = false;

            if (Notification.permission == "granted") {
                this.pushStateCheck();
            }
        });
    }
    validateDicFields(c: FormControl) {
        let val = c.value;
        let properString = typeof val === 'string' && val.length > 0;
        let properObject = val instanceof Object && val.name && val.name.length > 0;
        if (properString || properObject) {
            return null;
        } else {
            return {
                validateDicFields: {
                  valid: false
                }
            };
        }
    }
    
    initForm(): void {
        this.current_form = this.formBuilder.group({
            'country': [this.user.country, Validators.compose([])],
            'region': [this.user.region, Validators.compose([])],
            'parent_region': [this.user.parent_region, Validators.compose([])],
            'city': [this.user.city, Validators.compose([Validators.required, this.validateDicFields])],
            'street': [this.user.street, Validators.compose([Validators.required, this.validateDicFields])],
            'street_number': [this.user.street_number, Validators.compose([])],
            'organization': [this.user.organization, Validators.compose([Validators.required, this.validateDicFields])],
            'position': [this.user.position, Validators.compose([Validators.required, this.validateDicFields])],
            'specialty': [this.user.specialty, Validators.compose([Validators.required, this.validateDicFields])],
            'promo_code': [this.user.promo_code, Validators.compose([])],
            'email': [this.user.email, Validators.compose([Validators.pattern("(^$|^.*@.*\..*$)")])],
            'first_name': [this.user.first_name, Validators.compose([Validators.required, this.validateDicFields])],
            'middle_name': [this.user.middle_name, Validators.compose([Validators.required, this.validateDicFields])],
            'last_name': [this.user.last_name, Validators.compose([Validators.required])],
            'lang': [this.user.lang, Validators.compose([Validators.required])]
        });
    }

    initLanguageForm(): void {
        this.current_form = this.formBuilder.group({
            'lang': [this.user.lang, Validators.compose([Validators.required])]
        });
    }

    submitForm(): void {
        if (!this.current_form.valid || this.loading) {
            return;
        }
        this.loading = true;

        this.userService.updateUserData(this.current_form.value).subscribe(result => {
                this.is_editing = false;
                this.user = result;
                this.loading = false;
                localStorage.setItem('userReqFields', JSON.stringify(true));
                // If query route - redirect to course/lesson
                if(this.qroute) {
                    this.router.navigate(this.qroute);
                }
                // If first time save - redirect to news
                else if (this.first_time) {
                    this.router.navigate(['dashboard/news']);
                }
            },
            err => {
                this.authService.checkError(err);
                this.loading = false;
            }
        );
    }

    private previousChangedData = {};

    modelChangeHotfix(name: string, $event: any): void {
        this.previousChangedData = $event;
        if (this.user[name] instanceof Object && !($event instanceof Object)) {
            let data = this.user[name];

            if ($event != data.name) {
                data = {
                    id: 0,
                    name: $event
                }
            }

            this.current_form.controls[name].setValue(Object.assign(
                {toString: () => data.name},
                data
            ));
        }
    }

    formEdit(): void {
        this.is_editing = true;
        this.initForm();
    }

    logout(): void {
        this.authService.logoutUser()
            .subscribe(result => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('isAgreement');
                    localStorage.removeItem('userReqFields');
                    this.router.navigate(['']);
                },
                err => {
                    localStorage.removeItem('currentUser');
                    localStorage.removeItem('isAgreement');
                    localStorage.removeItem('userReqFields');
                    this.router.navigate(['/']);
                });
    }

    /* Push notifications */
    pushSubscribitionHandler(): void {
        if (this.subscribed_loading) return;

        this.pushStateCheck((state: boolean) => {
            if (state) {
                this.pushUnsubscribe();
            } else {
                this.pushSubscribe();
            }
        });
    }

    pushStateCheck(callback: (state: boolean) => void = (state: boolean) => null): void {
        this.subscribed_loading = true;

        // Requesting Notification permission
        this.pushNotifications.requestPermission();

        this.msgService.checkFCM().then(
            (response) => {
                response.subscribe(
                    (res: any) => {
                            this.subscribed = res.subscribed;
                            this.subscribed_loading = false;
                            callback(res.subscribed)
                        },
                    (err: any) => {
                        this.subscribed = false;
                        this.subscribed_loading = false;
                        callback(false)
                    }
                );
            }
        );
    }

    //Manually subscribe to FCM on link click
    pushSubscribe(): void {
        this.msgService.initFCM();
        this.subscribed = true;
    }

    //Manually unsubscribe to FCM on link click
    pushUnsubscribe(): void {
        this.subscribed_loading = true;
        this.msgService.unsetSubscription().subscribe(result => {
            this.subscribed = false;
            this.subscribed_loading = false;
        });
    }

    /* Dictionaries */
    formatCustomAnswer = (event: any): void => {
        let target = event.target,
            id = "";

        // If our custom value is not really custom but selected from the list
        if (this.previousChangedData['name'] == target.value && this.previousChangedData['id']) {
            id = this.previousChangedData['id']
        }

        this.current_form.controls[target.attributes.formcontrolname.value]
            .setValue({"id": id, "name": target.value, toString: () => target.value});
    };

    private formatParentId(field: any): number {
        if (field && field['id']) return field['id'];

        return null;
    }

    firstNameDictionary = (search: any): any => {
        return this.dictionary.getDictionary(3, search, null, this.user.lang);
    };

    middleNameDictionary = (search: any): any => {
        return this.dictionary.getDictionary(4, search, this.formatParentId(this.current_form.value.first_name), this.user.lang);
    };

    cityDictionary = (search: any): any => {
        return this.dictionary.getDictionary(12, search, this.formatParentId(this.current_form.value.country), this.user.lang);
    };

    streetDictionary = (search: any): any => {
        return this.dictionary.getDictionary(9, search, this.formatParentId(this.current_form.value.city), this.user.lang);
    };

    companyDictionary = (search: any): any => {
        return this.dictionary.getDictionary(10, search, this.formatParentId(this.current_form.value.street), this.user.lang);
    };

    positionDictionary = (search: any): any => {
        return this.dictionary.getDictionary(1, search, null, this.user.lang);
    };

    specialtyDictionary = (search: any): any => {
        return this.dictionary.getDictionary(2, search, null, this.user.lang);
    };

    // AGREEMENT
    onClickLink = () => {
        let url = this.agreement.linkAddress;
        window.open(url, "_blank");
    }
}
