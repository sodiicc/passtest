import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {Router, ActivatedRoute } from "@angular/router";
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {InterfaceService} from "../../../_services/interface.service";
import {Interface} from '../../../_models/interface.model';
import {slideInOutAnimation} from '../../../_animations/index';
import {AuthService} from "../../../_services/authorization.service";
import {OperatorHelper} from "../../../_helpers/operators.helper";
import {BonuseService} from "../../../_services/bonuse.service";
import {BonusesAmounts, Transaction} from "../../../_models/bonuse.model";
import {UserService} from '../../../_services/user.service';
import {User} from '../../../_models/user.model';
import {PhoneModel} from '../../../_components/phone/_models/phone.model';
import {PaginationHelper} from '../../../_helpers/pagination.helper';

import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'course',
    templateUrl: './withdraw.component.pug',
    animations: [slideInOutAnimation],
    styles: [String(require('./withdraw.component.styl'))]
})
export class WithdrawComponent implements OnInit {
    @ViewChild('withdrawModal') withdrawModalRef:TemplateRef<any>;
    withdrawModalInstance: BsModalRef;

    user: User;

    defaultInterface: Interface;
    payment_method: string;
    allowed_methods: Array<string> = ["gift", "phone"];
    private sub: any;
    operatorHelper = new OperatorHelper();

    state: string;
    list_amounts: BonusesAmounts[];

    course: number = 50;
    current_rate: number = 0;

    phone: string = '';
    amountForm: FormGroup;
    amount: AbstractControl;
    provider_class: string;

    loading: boolean;

    withdraw_success: boolean;
    withdraw_error: string;

    button_callback: Function = () => {};
    button_text: string = null;

    codeForm: FormGroup;
    code: AbstractControl;

    pagination: PaginationHelper;
    transactions: Transaction[];

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private interfaceService: InterfaceService,
        private bonuseService: BonuseService,
        private modalService: BsModalService) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Баллы";
        this.defaultInterface.navClasses = ["bg-green", "text-white"];
        this.interfaceService.changeInterface(this.defaultInterface);



        this.list_amounts = [];
        this.loading = false;
        this.pagination = new PaginationHelper();

        this.sub = this.route.params.subscribe(params => {
                let payment_method = params['method'];
                if (this.allowed_methods.indexOf(payment_method) == -1) {
                    this.router.navigate(['dashboard/bonuses']);
                    return;
                }

                // Set loading
                this.interfaceService.loading(true);

                this.userService.getUser()
                    .subscribe(user => {
                            // Set loaded
                            this.interfaceService.loading(false);
                            this.user = user;

                            if (payment_method == "gift") {
                                this.selectGift();
                            } else if (payment_method == "phone") {
                                this.selectPhone();
                            }
                        },
                        err => {
                            // Set loaded
                            this.interfaceService.loading(false);

                            this.authService.checkError(err);
                        });
            },
            err => {
                this.authService.checkError(err);
                this.router.navigate(['dashboard/news']);
            });
    }

    onScrollDown() {
        if (this.pagination.loading) return;

        this.pagination.loading = true;
        this.bonuseService.getHistory(this.pagination)
            .subscribe(transactions => {
                    this.transactions = this.transactions.concat(transactions);
                    if (transactions.length) this.pagination.nextPage();
                    this.pagination.loading = false;
                },
                err => {
                    this.pagination.loading = false;
                    this.authService.checkError(err);
                });
    }

    selectGift(): void {
        this.payment_method = 'gift';

        this.defaultInterface.title = "Вывод на скидку";
        this.defaultInterface.navClasses = ["navbar-controls", "bg-blue"];
        this.defaultInterface.content.classes = ["bg-blue"];
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    /* Phone */

    selectPhone(): void {
        this.payment_method = 'phone';
        this.showPhone();

        this.defaultInterface.navClasses = ["bg-green", "text-white"];
        this.defaultInterface.content.classes = ["bg-green"];
        this.interfaceService.changeInterface(this.defaultInterface);


        // Getting transactions
        this.pagination.loading = true;
        this.bonuseService.getHistory()
            .subscribe(transactions => {
                    this.pagination.nextPage();
                    this.interfaceService.loading(false);
                    this.transactions = transactions;
                    this.pagination.loading = false;

                    console.log('TRANS', this.transactions);
                },
                err => {
                    this.interfaceService.loading(false);
                    this.pagination.loading = false;
                    this.authService.checkError(err);
                });
    }

    showAmount(): void {
        if (!this.phone) return;

        this.button_callback = () => this.processWithdraw();


        this.button_text = 'Пополнить →';
        this.state = 'amount';
        this.initAmountForm();

        // Back button
        this.defaultInterface.navControls = true;
        this.defaultInterface.navPreviousRoute = () => this.showPhone();
        this.interfaceService.changeInterface(this.defaultInterface);

        this.bonuseService.getAmounts('MobileReplenish')
            .subscribe(data => {
                    this.list_amounts = data;

                    this.amountForm.patchValue({amount: this.list_amounts[0].id});
                    this.convertBonusesForm();
                },
                err => {
                    this.authService.checkError(err);
                });
    }

    processWithdraw(): void {
        if (this.loading) return;

        this.loading = true;
        let config = {
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: false
        };
        let code = (this.code && this.code.value) ? this.code.value : null;

        this.bonuseService.withdrawPhone(this.amount.value, this.phone, code)
            .subscribe(data => {
                    this.loading = false;
                    if (data['IsNeedToConfirm']) return this.showConfirm();

                    this.withdraw_success = true;

                    this.withdrawModalInstance = this.modalService.show(
                        this.withdrawModalRef,
                        Object.assign({}, {}, { class: 'modal-transparent' }));

                    setTimeout(() => {
                        this.withdrawModalInstance.hide();
                        if (this.state == 'confirm') this.showPhone();
                    }, 1000);
                },
                err => {
                    this.loading = false;
                    this.withdraw_success = false;
                    this.withdraw_error = err;

                    this.withdrawModalInstance = this.modalService.show(
                        this.withdrawModalRef,
                        Object.assign({}, config, { class: 'modal-transparent' }));

                    setTimeout(() => {
                        this.withdrawModalInstance.hide();
                    }, 3000);
                });
    }

    convertBonusesForm() {
        let id = this.amount.value;

        for (let i=0; i<this.list_amounts.length; i++) {
            if (this.list_amounts[i].id == id) this.current_rate = this.list_amounts[i].amount;
        }
    }

    showPhone(): void {
        this.defaultInterface.navControls = false;

        this.state = 'phone';
        this.button_callback = () => this.showAmount();
        this.button_text = 'Далее →';
    }

    phoneInput = (phone: PhoneModel): void => {
        this.phone = phone.phone;

        this.detectProvider(phone.number);
    };

    detectProvider(phone: string): void {
        this.provider_class = this.operatorHelper.getClass(phone)
    }

    initAmountForm(): void {
        this.amountForm = this.formBuilder.group({
            'amount': [45, Validators.compose([Validators.required])]
        });
        this.amount = this.amountForm.controls['amount'];
    }

    /* Confirmation */
    showConfirm(): void {
        this.state = 'confirm';
        this.button_callback = () => this.processWithdraw();
        this.button_text = 'Пополнить →';

        this.codeForm = this.formBuilder.group({
            'code': ['', Validators.compose([Validators.required])]
        });
        this.code = this.codeForm.controls['code'];
    }
}
