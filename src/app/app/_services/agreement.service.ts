import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {getBackendApiUrl} from '../_helpers/route.helper';
import {config} from '../_helpers/config.helper'

import {AuthService} from '../_services/authorization.service';
import {Agreement} from '../_models/agreement.model';

@Injectable()
export class AgreementService {
    constructor(private http: Http,
                private authService: AuthService) {

    }
    getAgreement(): Observable<Agreement> {
        const headers = new Headers({
            'Authorization': config.authorization.type + this.authService.token
        });
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.agreement;
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    saveAgreement(id:number): Observable<boolean> {
        let data = JSON.stringify({id});
        const headers = new Headers({
            'Authorization': config.authorization.type + this.authService.token,
            'Content-Type': 'application/json'
        });
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.agreement;
        return this.http.post(path, data, options)
            .map((response: Response) => !(response.status < 200 || response.status >= 300) )
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));

    }
}
