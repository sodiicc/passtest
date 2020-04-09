import {Injectable} from '@angular/core';
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {AuthService} from '../_services/authorization.service';
import {Course} from '../_models/course.model';
import {fromJSONArray} from '../_models/base.model';
import {getBackendApiUrl} from '../_helpers/route.helper';
import {PaginationHelper} from '../_helpers/pagination.helper';

import {config} from '../_helpers/config.helper'

@Injectable()
export class CourseService {

    constructor(private http: Http,
                private authService: AuthService) {
    }

    getCourses(pagination:PaginationHelper = new PaginationHelper()): Observable<Course[]> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = pagination.getRequestArgs(getBackendApiUrl() +  config.routes.courses);
        return this.http.get(path, options)
            .map((response: Response) => fromJSONArray(Course, response.json()))
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

    getCourse(id:number): Observable<Course> {
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        const path = getBackendApiUrl() +  config.routes.courses + '/' + id;
        return this.http.get(path, options)
            .map((response: Response) => new Course().fromJSON(response.json()))
            .catch((error: any) => Observable.throw( error.json().error_description || 'Server error'));
    }

}