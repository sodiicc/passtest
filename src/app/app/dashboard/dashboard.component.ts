import {Component, OnInit} from '@angular/core';
import {User} from '../_models/user.model';
import {Router} from "@angular/router";
import {AuthService} from "../_services/authorization.service";
import {Interface} from '../_models/interface.model';
import {InterfaceService} from "../_services/interface.service";


@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.pug',
    styles: [String(require('./dashboard.component.styl'))]
})
export class DashboardComponent implements OnInit {
    users: User[] = [];
    message = '';
    options: Interface = new Interface();
    menu_active: boolean = false;
    menu_items: Array<object>;
    previous_url: string = null;
    current_url: string = null;
    loading: boolean = false;
    fullscreen: boolean = false;

    constructor(private authService: AuthService,
                private router: Router,
                private interfaceService: InterfaceService) {
    }

    openMenu(): void {this.menu_active = true}
    closeMenu(): void {this.menu_active = false}

    ngOnInit() {
        /* Authorization */
        this.authService.getToken();

        /* History */
        this.addHistory();

        /* Menu initialization */
        this.menu_items = [
            {"title": "Лента", "route": "/dashboard/feed", "icon": "icon-menu icon-menu-feed"},
            {"title": "Новости", "route": "/dashboard/news", "icon": "icon-menu icon-menu-news"},
            {"title": "Обучение", "route": "/dashboard/courses", "icon": "icon-menu icon-menu-courses"},
            {"title": "Профиль", "route": "/dashboard/user", "icon": "icon-menu icon-menu-profile"},
            {"title": "Баллы", "route": "/dashboard/bonuses/phone", "icon": "icon-menu icon-menu-bonuses"},
            {"title": "О проекте", "route": "/dashboard/info", "icon": "icon-menu icon-menu-help"}
        ];

        /* History changes */
        this.router.events.subscribe((event: any) => {
            if(event.url) {
                this.addHistory();
            }
        });

        // Interface changes
        this.interfaceService._interfaceStorage.subscribe(result => {
            if (result == undefined) return;
            /*
             * Navbar configuration
             */

            // Navigation styles
            let nav_classes = ["navbar", "fixed-top"];
            if (!result.navClasses.length) result.navClasses = ["navbar-default"];
            result.navClasses = result.navClasses.concat(nav_classes);

            setTimeout(() => {this.options = result}, 0);
        });

        // Loading state changes
        this.interfaceService._loadingStorage.subscribe(loading => {
            if (loading == undefined) return;

            setTimeout(() => {this.loading = loading}, 0);
        });

        // Fullscreen state changes
        this.interfaceService._fullscreenStorage.subscribe(fullscreen => {
            if (fullscreen == undefined) return;

            console.log('FULLSCREEN', fullscreen);

            setTimeout(() => {this.fullscreen = fullscreen}, 0);
        });

        this.router.events.subscribe(this.onScreenChange);
    }

    getCurrentMenu(): object {
        let menu = {};
        for (let i=0; i<this.menu_items.length; i++) {
            if (this.router.url.startsWith(this.menu_items[i]["route"])) {
                menu = this.menu_items[i]
            }
        }
        return menu
    }

    onScreenChange(): void {
        this.options = new Interface();
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

    addHistory(): void {
        this.previous_url = this.current_url;
        this.current_url = this.router.url
    }
}
