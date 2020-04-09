import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {Test} from '../_models/test.model';
import {Question} from '../_models/question.model';
import {getBackendApiUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class TestService {

    constructor(private http: Http,
                private authService: AuthService) {

    }

    getTest(id:number): Observable<Test> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.test + '/'+id);
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getQuestion(pid:number,id:number): Observable<Question> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.test + '/'+pid+'/question/'+id);
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    setQuestion(pid:number,id:number, data: object): Observable<object> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token, 'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.test + '/'+pid+'/question/'+id);
        return this.http.post(path, JSON.stringify(data), options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    submitTest(data:object): Observable<Response> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token, 'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.test + '/submit');
        return this.http.post(path, JSON.stringify(data), options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

}
