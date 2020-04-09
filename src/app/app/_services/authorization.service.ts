import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {Router} from "@angular/router";
import {Modal} from '../_models/interface.model';
import {InterfaceService} from "../_services/interface.service";
import {getBackendApiUrl} from '../_helpers/route.helper';
import {config} from '../_helpers/config.helper'

@Injectable()
export class AuthService {

    public token: string;
    private authUrl = getBackendApiUrl(config.routes.authentication);
    private countryUrl = getBackendApiUrl(config.routes.country);
    private registerUrl = getBackendApiUrl(config.routes.registration);
    private restoreUrl = getBackendApiUrl(config.routes.restore);
    private logoutUrl = getBackendApiUrl(config.routes.logout);
    private deleteUrl = getBackendApiUrl(config.routes.delete);
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private interfaceService: InterfaceService, private http: Http, private router: Router) {
        this.getToken()
    }

    authorizeUser(username: string, password: string, metadata: object): Observable<boolean> {
        return this.http.post(this.authUrl, JSON.stringify({
            username: username.replace(/[\(\)\s\-]/g, ""),
            password: password,
            metadata: metadata
        }), {headers: this.headers})
            .map((response: Response) => {
                const token = response.json() && response.json().token;
                if (token) {
                    localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
                    this.getToken();
                    return true;
                } else {
                    return false;
                }})
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    autorizeUserCode(code: string): Observable<boolean> {
        return this.http.get(this.authUrl + "/" + code, {headers: this.headers})
            .map((response: Response) => {
                const token = response.json() && response.json().token;
                if (token) {
                    localStorage.setItem('currentUser', JSON.stringify({token: token}));
                    this.getToken();
                    return response.json();
                } else {
                    return false;
                }})
            .catch((error: any) => {
                error = error.json();

                if (error && error.error_description && error.error_description.startsWith('451')) {
                    return this.autorizeUserCode(code);
                }

                return Observable.throw( error.json().error_description || 'Server error')
            });
    }

    createUser(number: string, language: number, invite_code: string = null): Observable<string> {
        let data = {
            number: number.replace(/[\(\)\s\-]/g, ""),
            lang: language,
        };

        if (invite_code) {
            data['Invite'] = invite_code
        }

        return this.http.post(this.registerUrl, JSON.stringify(data), {headers: this.headers})
            .map((response: Response) => { return response.json(); })
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    };

    restorePassword(number: string): Observable<string> {
        return this.http.post(this.restoreUrl, JSON.stringify({
            number: number.replace(/[\(\)\s\-]/g, "")
        }), {headers: this.headers})
            .map((response: Response) => { return response.json().message; })
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    };

    getToken(): void {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    logoutUser(): Observable<string> {
        const headers = new Headers({'Authorization': config.authorization.type + this.token});
        const options = new RequestOptions({headers: headers});
        return this.http.get(this.logoutUrl, options)
            .map((response: Response) => { return response.json().message; })
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }

    checkAuth(): Observable<Boolean> {
        this.getToken();

        const headers = new Headers({'Authorization': config.authorization.type + this.token});
        const options = new RequestOptions({headers: headers});
        return this.http.get(this.authUrl, options)
            .map((response: Response) => {
                return !(response.status < 200 || response.status >= 300);
            })
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getCountry(): Observable<Object> {
        const headers = new Headers({'Authorization': config.authorization.type + this.token});
        const options = new RequestOptions({headers: headers});
        return this.http.get(this.countryUrl, options)
            .map((response: Response) => { return response.json(); })
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    checkError(error:any):void {
        const headers = new Headers({'Authorization': config.authorization.type + this.token});
        const options = new RequestOptions({headers: headers});
        if (error && typeof error === 'string') error = error.replace(/^\d+\:\s*/, '');
        if(error == config.errors.expired || error == "Wrong token") {
            this.logoutUser()
                .subscribe(result => {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('isAgreement');
                        localStorage.removeItem('userReqFields');
                        this.router.navigate(['']);
                    },
                    err => {
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('isAgreement');
                        localStorage.removeItem('userReqFields');
                        this.router.navigate(['/']);
                    });
        } else {
            let modal = new Modal();
            modal.message = error;
            this.interfaceService.modal(modal);
        }
    }
}
