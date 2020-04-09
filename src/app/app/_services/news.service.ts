import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {News} from '../_models/news.model';
import {getBackendApiUrl} from '../_helpers/route.helper';
import {PaginationHelper} from '../_helpers/pagination.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class NewsService {

    constructor(private http: Http,
                private authService: AuthService) {
    }

    getNewsList(pagination:PaginationHelper = new PaginationHelper()): Observable<News[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = pagination.getRequestArgs(getBackendApiUrl() +  config.routes.news);
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getNews(id:number): Observable<News> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.news + '/' + id;
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

}
