import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {getBackendApiUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class PushService {

    constructor(private http: Http,
                private authService: AuthService) {

    }

    generate(content:string, link:string, quantity:number): Observable<object> {
        const headers = new Headers({
            'Authorization': config.authorization.type + this.authService.token,
            'Content-Type': 'application/json'
        });
        const options = new RequestOptions({headers: headers});
        const data = {
            content: content,
            link: link,
            quantity: quantity
        };
        const path = getBackendApiUrl(config.routes.push);
        return this.http.post(path, JSON.stringify(data), options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

}