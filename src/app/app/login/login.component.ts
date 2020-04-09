import 'rxjs/Rx';
import {Component, OnInit} from '@angular/core';
import {ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl} from '@angular/forms';
import {User} from '../_models/user.model';
import {PhoneModel} from '../_components/phone/_models/phone.model';
import {AuthService} from '../_services/authorization.service';
import {AnalyticsService} from "../_services/analytics.service"
import {UserService} from '../_services/user.service';
import {Router, ActivatedRoute} from "@angular/router";
import {RouterHelper} from "../_helpers/route.helper";
import {Modal} from '../_models/interface.model';
import {InterfaceService} from '../_services/interface.service';
import {config} from '../_helpers/config.helper'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.pug',
    styles: [String(require('./login.component.styl'))]
})
export class LoginComponent implements OnInit {

    passwordForm: FormGroup;

    phone: string = '';
    password: AbstractControl;
    passwordVisible: boolean;
    invite_code: string = null;

    step: string;
    isRestore = false;
    user: User;
    loading = false;
    message = '';
    new_user: boolean = false;

    phone_timer: any;

    loading_code: boolean = false;

    loading_login: boolean = false;

    languages = [
        {value: '1', viewValue: 'Русский'},
        {value: '3', viewValue: 'Украинский'}
    ];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private authService: AuthService,
                private elRef:ElementRef,
                private route: ActivatedRoute,
                private analytics: AnalyticsService,
                private interfaceService: InterfaceService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.loading_code = false;
        this.passwordVisible = false;
        this.loading_login = false;
        this.invite_code = null;

        this.route.queryParams.subscribe(params => {
            this.invite_code = params["invite"];
            let token = params["code"];

            if (token) {
                this.loading = true;
                this.loading_code = true;

                this.authService.autorizeUserCode(token).subscribe(result => {
                    this.loading_code = false;
                    this.userService.getUser()
                    .subscribe(user => {
                        this.loading = false;
                        this.setUserFields(user);

                        let route = new RouterHelper(result["user"]["route"]).getRoute();
                        console.log("Got route for code authorization", route);
                        if(this.getValue('isAgreement')) {
                            setTimeout(() => {
                                if (!this.getValue('userReqFields')) {
                                    this.router.navigate(['/dashboard/user'], {queryParams: {route} });
                                } else {
                                    this.router.navigate(route);
                                }
                            }, 1000);
                        } else {
                            this.router.navigate(['/agreement'], {queryParams: {route} });
                        }
                    });
                }, error => {
                    this.loading_code = false;
                    this.loading = false;
                    this.displayMessage('Неправильный код авторизации');
                    this.checkAuthorization();
                })
            } else {
                /* If has active authorization session */
                this.checkAuthorization();
            }
        })
    }

    checkAuthorization(): void {
        this.authService.checkAuth()
            .subscribe(result => {
                    if (result) {
                        let isAgreementExists = this.getValue('isAgreement');
                        isAgreementExists ?
                        this.router.navigate(['/dashboard/feed']) :
                        this.router.navigate(['/agreement'])
                    }
                }
            );

        this.initFormPassword();
        this.step = "phone";
        this.phone_timer = null;
    }

    displayMessage(message: string): void {
        let modal = new Modal();
        modal.message = message;
        this.interfaceService.modal(modal);
    }

    initFormPassword(): void {
        this.passwordForm = this.formBuilder.group({
            'password': ['', Validators.compose([Validators.required])]
        });
        this.password = this.passwordForm.controls['password'];
    }

    loginPhone = (phone: PhoneModel) => {
        clearTimeout(this.phone_timer);

        this.phone = phone.phone;
        this.phone_timer = setTimeout(() => this._loginPhone(this.phone), 1000)
    };

    _loginPhone(phone: string) {
        if (this.isRestore) {
            this.restore()
        } else {
            this.register();
            this.step = "password"
        }
    }

    loginPassword() {
        if (this.passwordForm.valid) {
            this.login()
        }
    }

    login() {
        this.authService.authorizeUser(this.phone, this.password.value, this.analytics.getMetadata())
            .subscribe(result => {
                if(result) {
                    this.loading_login = true;
                    this.userService.getUser()
                        .subscribe(user => {
                                // Set loaded
                                this.interfaceService.loading(false);
                                this.setUserFields(user);
                                if(this.getValue('isAgreement')) {
                                    setTimeout(() => {
                                        if (this.new_user) {
                                            this.router.navigate(['dashboard/user'], {queryParams: {first: true} });
                                        } else if (!this.getValue('userReqFields')) {
                                            this.router.navigate(['/dashboard/user']);
                                        } else {
                                            this.router.navigate(['/dashboard/feed']);
                                        }
                                    }, 1000);
                                } else {
                                    this.router.navigate(['/agreement']);
                                }
                            },
                            err => {
                                // Set loaded
                                this.interfaceService.loading(false);
                                this.authService.checkError(err);
                            });
                } else {
                    this.displayMessage('Ошибка авторизации');
                }
            },
            err => {
                this.displayMessage(err);
            }
        );
    }

    register() {
        this.loading = true;
        this.message = '';
        this.authService.createUser(this.phone, config.default.lang, this.invite_code).subscribe(result => {
                this.loading = false;
                this.displayMessage('Пароль отправлен');
                this.new_user = true;
                this.step = "password"
            },
            err => {
                this.loading = false;
                if(err) {
                    this.new_user = false;
                    this.step = "password"
                } else {
                    this.displayMessage(err);
                }
            }
        );
    }

    restore() {
        this.loading = true;
        this.message = '';
        this.authService.restorePassword(this.phone).subscribe(result => {
                this.loading = false;
                this.displayMessage(result);
                this.step = "password"
            },
            err => {
                this.loading = false;
                this.isRestore = false;
                this.step = "password";
                this.displayMessage(err);
            }
        );
    }

    toPhone() {
        this.step = 'phone';
    }
    setUserFields = (user:any) => {
        let isAgreement = user.isAgreementExists;
        localStorage.setItem('isAgreement', JSON.stringify(isAgreement));
        let userReqFields = user["first_name"] && 
                            user["last_name"] && 
                            user["middle_name"] &&
                            user["city"] &&
                            user["street"] &&
                            user["organization"] &&
                            user["position"] &&
                            user["specialty"] ? true: false;
        localStorage.setItem('userReqFields', JSON.stringify(userReqFields));
    }
    getValue = (str:string) => {
        return JSON.parse(localStorage.getItem(str));
    }
}
