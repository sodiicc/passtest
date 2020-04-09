import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import {getBackendApiUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

import {Dictionary} from '../_models/dictionary.model';
import {AuthService} from '../_services/authorization.service';

@Injectable()
export class DictionaryService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private id: number = null;
    private dictionary: Dictionary[] = [];

    constructor(private http: Http,
                private authService: AuthService) {}

    getDictionary(id: number, search: string = null, parent_id: number = null, language: number = null): Observable<Dictionary[]> {
        // console.log("GD", this.dictionary);
        // console.log("SEARCH", search);

        if (!search) {
            search = ""
        }

        if (this.dictionary.length > 0 && id == this.id) {
            return this.filter(search);
        } else {
            this.clear()
        }
        const headers = new Headers({'Authorization': config.authorization.type + this.authService.token});
        const options = new RequestOptions({headers: headers});
        let path = getBackendApiUrl(config.routes.user + "/dictionary?dictionary=" + id);

        if (language) {
            path += "&lang=" + language;
        }
        if (parent_id) {
            path += "&parentId=" + parent_id;
        }

        return this.http.get(path, options).map((response: Response) => {
            this.dictionary = response.json();
            this.id = id;
            return this._filter(search);
        });
    }

    _filter(keyword: string): Dictionary[] {
        return this.dictionary.filter((el: Dictionary) => el.name.toLowerCase().startsWith(keyword.toLowerCase()));
    }

    filter(keyword: string): Observable<Dictionary[]> {
        return Observable.of(this._filter(keyword));
    }

    clear(): void {
        this.id = null;
        this.dictionary = [];
    }
}
