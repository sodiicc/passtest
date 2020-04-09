import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {getBackendApiUrl} from '../_helpers/route.helper';
import {config} from '../_helpers/config.helper'

import {AuthService} from '../_services/authorization.service';
import {User} from '../_models/user.model';

@Injectable()
export class UserService {
    constructor(private http: Http,
                private authService: AuthService) {

    }
    getUser(): Observable<User> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.user;
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    updateUserData(user: User): Observable<User> {
        let data = JSON.stringify(user);
        const headers = new Headers({
            'Authorization': config.authorization.type + this.authService.token,
            'Content-Type': 'application/json'
        });
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.user;

        return this.http.post(path, data, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));

    }

    hideGuide(): Observable<Response> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token, 'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.user + '/guide';
        return this.http.delete(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }
}