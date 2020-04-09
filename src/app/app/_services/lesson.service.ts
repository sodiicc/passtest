import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {Lesson} from '../_models/lesson.model';
import {getBackendApiUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class LessonService {

    constructor(private http: Http,
                private authService: AuthService) {

    }

    getLessons(): Observable<Lesson[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.lessons);
        return this.http.get(path, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getLesson(id:number): Observable<Lesson> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl(config.routes.lessons + '/' + id);
        return this.http.get(path, options)
            .map((response: Response) => new Lesson().fromJSON(response.json()))
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

}