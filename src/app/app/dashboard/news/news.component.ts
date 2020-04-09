import {Component, OnInit, } from '@angular/core';
import {NewsService} from '../../_services/news.service';
import {Router} from "@angular/router";
import {News} from '../../_models/news.model';
import {AuthService} from "../../_services/authorization.service";
import {InterfaceService} from "../../_services/interface.service";
import {Interface} from '../../_models/interface.model';
import {PaginationHelper} from '../../_helpers/pagination.helper';

@Component({
    selector: 'news',
    templateUrl: './news.component.pug',
    styles: [String(require('./news.component.styl'))]
})
export class NewsComponent implements OnInit {

    news: News[] = [];
    defaultInterface: Interface;
    pagination: PaginationHelper;

    constructor(
        private newsService: NewsService,
        private router: Router,
        private authService: AuthService,
        private interfaceService: InterfaceService) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Новости";
        this.interfaceService.changeInterface(this.defaultInterface);

        this.pagination = new PaginationHelper();

        this.interfaceService.loading(true);
        this.pagination.loading = true;
        this.newsService.getNewsList()

        .subscribe(news => {
            this.pagination.nextPage();
            this.interfaceService.loading(false);
            this.news = news;
            this.pagination.loading = false;
        },
        err => {
            this.interfaceService.loading(false);
            this.pagination.loading = false;
            this.authService.checkError(err);
        });
    }

    onScrollDown() {
        if (this.pagination.loading) return;

        this.pagination.loading = true;
        this.newsService.getNewsList(this.pagination)
            .subscribe(news => {
                    this.news = this.news.concat(news);
                    if (news.length) this.pagination.nextPage();
                    this.pagination.loading = false;
                },
                err => {
                    this.pagination.loading = false;
                    this.authService.checkError(err);
                });
    }

    getNews(id:number): void  {
        this.router.navigate(['dashboard/news', id]);
    }

}
