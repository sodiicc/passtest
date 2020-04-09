import {Component, OnInit, } from '@angular/core';
import {Location} from '@angular/common';
import {NewsService} from '../../../_services/news.service';
import {Router, ActivatedRoute} from "@angular/router";
import {News} from '../../../_models/news.model';
import {AuthService} from "../../../_services/authorization.service";
import {InterfaceService} from "../../../_services/interface.service";
import {Interface} from '../../../_models/interface.model';

@Component({
    selector: 'news_view',
    templateUrl: './news_view.component.pug',
    styles: [String(require('./news_view.component.styl'))]
})
export class NewsViewComponent implements OnInit {

    news: News;
    id: number;
    private sub: any;
    defaultInterface: Interface;

    constructor(
        private newsService: NewsService,
        private router: Router,
        private authService: AuthService,
        private route: ActivatedRoute,
        private interfaceService: InterfaceService,
        private location: Location) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Новость";
        this.defaultInterface.navControls = true;
        this.defaultInterface.navClasses = ["navbar-controls", "bg-purple", "navbar-border", "text-light"];
        this.defaultInterface.navControlsRightActive = true;
        this.defaultInterface.navPreviousRoute = (previous: string) => {
            if (["/dashboard/news", "/dashboard/feed"].indexOf(previous) > -1) {
                return this.router.navigate([previous]);
            }
            return this.router.navigate(['/dashboard/news']);
        };
        this.interfaceService.changeInterface(this.defaultInterface);

        this.sub = this.route.params.subscribe(params => {
                this.id = +params['id'];
                this.interfaceService.loading(true);

                this.newsService.getNews(this.id)
                    .subscribe(news => {
                            this.interfaceService.loading(false);
                            this.news = news;
                        },
                        err => {
                            this.interfaceService.loading(false);
                            this.authService.checkError(err);
                            this.router.navigate(['dashboard/news']);
                        });
            },
            err => {
                this.authService.checkError(err);
                this.router.navigate(['dashboard/news']);
            });
    }
}
