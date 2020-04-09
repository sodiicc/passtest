import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'rxjs/add/operator/take';
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {PushNotificationsService, NotificationsService} from 'angular2-notifications';
import {AuthService} from '../_services/authorization.service';
import {PushModel} from '../_models/push.model';
import {getBackendApiUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class FcmService {
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);

    constructor(private http: Http,
                private authService: AuthService,
                private db: AngularFireDatabase,
                private afAuth: AngularFireAuth,
                private notificationsService: NotificationsService,
                private pushNotifications: PushNotificationsService) {

    }

    updateToken(token: string) {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.fcm);
        let data = {
            token: token
        };
        return this.http.post(path, data, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }

    initFCM() {
        this.messaging.requestPermission()
        .then(() => {
            console.log('Notification permission granted.');
            return this.messaging.getToken()
        })
        .then(token => {
            //Return token from FCM
            console.log('Token:', token);
            return this.updateToken(token);
        })
        .then(response => {
            response.subscribe((res: any) => {
                //Save token to MongoDB
                console.log('Save token:',res);
                // Subscribe to pushes in foreground
                this.messaging.onMessage((payload:PushModel) => {
                    let notification = payload.notification;
                    this.pushNotifications.create(notification.title, {
                        body: notification.body
                    }).subscribe(
                        (res: any) => console.log(res),
                        (err: any) => console.log(err)
                    );
                });
            });

        })
        .catch((err) => {
            console.log('Unable to get permission to notify.', err);
        });
    }

    checkFCM() {
        return this.messaging.requestPermission()
        .then(() => {
            console.log('Notification permission granted.');
            return this.messaging.getToken()
        })
        .then(token => {
            return this.checkToken(token)
        }).then(response => {
            return response;
        });
    }

    getToken() {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.fcm);
        return this.http.get(path, options)
            .map((response: Response) => response.json() )
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }

    checkToken(token:string) {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.fcm + '/check/'+token);
        return this.http.get(path, options)
            .map((response: Response) => response.json() )
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }

    sendTestMessage() {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.fcm + '/send');
        return this.http.get(path, options)
            .map((response: Response) => response.json() )
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }

    unsetSubscription() {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.fcm);
        return this.http.delete(path, options)
            .map((response: Response) => response.json() )
            .catch((error: any) => Observable.throw(error.json().error_description || 'Server error'));
    }
}