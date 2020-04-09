import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
//import {AuthService} from "../_services/authorization.service";
import {AgreementService} from "../_services/agreement.service";
import {Interface} from '../_models/interface.model';
import {Agreement} from '../_models/agreement.model';
import {InterfaceService} from "../_services/interface.service";


@Component({
    selector: 'agreement',
    templateUrl: './agreement.component.pug',
    styles: [String(require('./agreement.component.styl'))]
})
export class AgreementComponent implements OnInit {
    options: Interface = new Interface();
    loading: boolean = false;
    //fullscreen: boolean = false;

    //AGREEMENT
    isChecked: boolean = false;
    agreement:Agreement;
    qroute:Array<string>;

    constructor(
                //private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private agreementService: AgreementService,
                private interfaceService: InterfaceService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.qroute = params["route"];
            /* Authorization */
            //this.authService.getToken();

            // Interface changes
        
            // Loading state changes
            this.interfaceService._loadingStorage.subscribe(loading => {
                if (loading == undefined) return;
                setTimeout(() => {this.loading = loading}, 0);
            });

            // Fullscreen state changes
            // this.interfaceService._fullscreenStorage.subscribe(fullscreen => {
            //     if (fullscreen == undefined) return;
            //     console.log('FULLSCREEN', fullscreen);
            //     setTimeout(() => {this.fullscreen = fullscreen}, 0);
            // });
            //this.router.events.subscribe(this.onScreenChange);

            // Set loading
            this.interfaceService.loading(true);

            this.agreementService.getAgreement()
                    .subscribe(agr => {
                        // Set loaded
                        this.interfaceService.loading(false);
                        this.agreement = agr;
                    },
                    err => {
                        // Set loaded
                        this.interfaceService.loading(false);
                        //this.authService.checkError(err);
                    });
        });

    }

    // onScreenChange(): void {
    //     this.options = new Interface();
    // }

    // AGREEMENT
      
    onClickLink = () => {
        let url=this.agreement.linkAddress;
        window.open(url, "_blank");
    }
    toggleChecked = () => this.isChecked = !this.isChecked;
    onAgree = () => {
        if(this.isChecked) {
            this.agreementService.saveAgreement(this.agreement.id)
                    .subscribe(res => {
                        if(res) {
                            localStorage.setItem('isAgreement', JSON.stringify(true));
                            if(this.qroute) {
                                let userReqFields = JSON.parse(localStorage.getItem('userReqFields'));
                                if(userReqFields) {
                                    this.router.navigate(this.qroute);
                                } else {
                                    this.router.navigate(['/dashboard/user'], {queryParams: {route: this.qroute} });
                                }
                            } else {
                                this.router.navigate(['/dashboard/feed']);
                            }
                        }
                    },
                    err => {
                        // Set loaded
                        this.interfaceService.loading(false);
                        //this.authService.checkError(err);
                    });
        }

    }
}
