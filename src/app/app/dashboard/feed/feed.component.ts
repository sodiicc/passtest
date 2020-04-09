import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FeedService} from '../../_services/feed.service';
import {Router} from "@angular/router";
import {AuthService} from "../../_services/authorization.service";
import {InterfaceService} from "../../_services/interface.service";
import {Interface, Modal} from '../../_models/interface.model';
import {UserService} from '../../_services/user.service';
import {PaginationHelper} from '../../_helpers/pagination.helper';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {config} from '../../_helpers/config.helper'

@Component({
    selector: 'feed',
    templateUrl: './feed.component.pug',
    styles: [String(require('./feed.component.styl'))]
})
export class FeedComponent implements OnInit {
    @ViewChild('guideModal') guideModalRef:TemplateRef<any>;
    guideModalInstance: BsModalRef;
    guideSlide: number = 0;

    feed: object[];
    type: object;
    SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };
    types = [
        {
            id: 0,
            title: 'Лента',
            route: ''
        },
        {
            id: 9,
            title: 'Курсы',
            route: 'dashboard/course'
        },
        {
            id: 1,
            title: 'Уведомления',
            route: ''
        },
        {
            id: 13,
            title: 'Новости',
            route: 'dashboard/news'
        }
    ];
    defaultInterface: Interface;
    pagination: PaginationHelper;
    constructor(private feedService: FeedService,
                private authService: AuthService,
                private router: Router,
                private interfaceService: InterfaceService,
                private userService: UserService,
                private modalService: BsModalService) {}

    ngOnInit() {
        /* UI initialization */
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Лента";
        this.interfaceService.changeInterface(this.defaultInterface);
        this.pagination = new PaginationHelper();

        this.type = this.getTypeId(parseInt(config.default.type));
        this.getFeed(this.type["id"], () => {
            this.userService.getUser()
                .subscribe(user => {
                    if (user.info_points >= 150) {
                        this.defaultInterface.navControlsBonuses = true;
                        this.interfaceService.changeInterface(this.defaultInterface);
                    }

                    /* Guide initialization */
                    /*
                    if (user.show_guide) {
                        this.guideModalInstance = this.modalService.show(
                            this.guideModalRef,
                            Object.assign({}, {}, { class: 'modal-transparent' }));
                    }
                    */
                });
        });
    }

    /* Guide */
    nextGuideSlide(): void {
        this.guideSlide += 1;
    }

    hideGuide(): void {
        this.guideModalInstance.hide();
        this.userService.hideGuide().subscribe();
    }

    getFeed(type:number, callback: () => void = () => null): void {
        this.interfaceService.loading(true);
        this.pagination.loading = true;

        this.feedService.getFeed(type)
            .subscribe(feed => {
                this.pagination.nextPage();
                this.interfaceService.loading(false);
                this.pagination.loading = false;
                this.feed = feed;
                callback();
            },
            err => {
                this.interfaceService.loading(false);
                this.pagination.loading = false;
                this.authService.checkError(err);
                callback();
            });
    }

    getTypeId(id: number): object {
        return this.types.find(item => item.id === id)
    }

    changeFeedType(action: string = this.SWIPE_ACTION.RIGHT): void {
        let index = 0;
        for (let i=0; i<this.types.length; i++) {
            if (this.types[i]['id'] == this.type["id"]) {
                index = i;
            }
        }

        if (action === this.SWIPE_ACTION.RIGHT) {
            this.type = this.types[index+1];
            if(this.type == undefined) {
                this.type = this.types[0];
            }
        }
        if (action === this.SWIPE_ACTION.LEFT) {
            if(index == 0) {
                this.type = this.types[this.types.length-1];
            } else {
                this.type = this.types[index-1];
            }
        }
        this.getFeed(this.type["id"]);
    }

    goTo(type_id: number, id: number) {
        let type = this.getTypeId(type_id);
        if (!type['route']) {
            return;
        }

        this.router.navigate([type['route'], id]);
    }

    onScrollDown() {
        if (this.pagination.loading) return;

        this.pagination.loading = true;
        this.feedService.getFeed(this.type["id"], this.pagination)
            .subscribe(feed => {
                    this.feed = this.feed.concat(feed);
                    if (feed.length) this.pagination.nextPage();
                    this.pagination.loading = false;
                },
                err => {
                    this.pagination.loading = false;
                    this.authService.checkError(err);
                });
    }
}
