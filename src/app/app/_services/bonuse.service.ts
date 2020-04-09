import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {BonusesAmounts, Transaction} from '../_models/bonuse.model';
import {getBackendApiUrl} from '../_helpers/route.helper';
import {PaginationHelper} from '../_helpers/pagination.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class BonuseService {

    constructor(private http: Http,
                private authService: AuthService) {
    }

    getAmounts(type: string): Observable<BonusesAmounts[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.withdraw + "/" + type;
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getHistory(pagination:PaginationHelper = new PaginationHelper()): Observable<Transaction[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = pagination.getRequestArgs(getBackendApiUrl() +  config.routes.withdraw);
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    withdrawPhone(id: number, phone: string, code: string): Observable<object> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token, 'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.withdraw;
        return this.http.post(path, JSON.stringify({
            id: id,
            phone: phone,
            code: code
        }), options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));

    }

}