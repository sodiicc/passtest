import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Feed} from '../_models/feed.model';
import {fromJSONArray} from '../_models/base.model';
import {getBackendApiUrl} from '../_helpers/route.helper';
import {PaginationHelper} from '../_helpers/pagination.helper';
import 'rxjs/add/operator/map'
import {config} from '../_helpers/config.helper'

import {AuthService} from '../_services/authorization.service';

@Injectable()
export class FeedService {
    constructor(private http: Http,
                private authService: AuthService) {}
    getFeed(type:number, pagination:PaginationHelper = new PaginationHelper()): Observable<Feed[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = pagination.getRequestArgs(getBackendApiUrl() +  config.routes.feed + '?type=' + type);
        return this.http.get(path, options)
            .map((response: Response) => fromJSONArray(Feed, response.json()))
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }
}