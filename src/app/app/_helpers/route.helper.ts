import {config} from './config.helper'


export class RouterHelper {
    private rulles: object = {
        "lesson": {
            "route": "dashboard/course/lesson",
            "params": ["courseId", "lessonId"]
        },
        "course": {
            "route": "dashboard/course",
            "params": ["id"]
        },
        "news": {
            "route": "dashboard/news",
            "params": ["id"]
        }
    };
    private route: string;
    private params: object;

    constructor(route: object) {
        this.route = route["Name"];
        this._extractParams(route["Params"]);
    }

    private _extractParams(params: object) {
        this.params = {};
        for (let key in params) {
            this.params[params[key]["Key"]] = params[key]["Value"]
        }
    }

    getRoute(): Array<any> {
        console.log(this);

        if (!(this.route in this.rulles)) return ['dashboard/feed'];

        let route = this.rulles[this.route];
        let params = [route["route"]];
        for (let key in route["params"]) {
            if (!(route["params"][key] in this.params)) {
                this.params[route["params"][key]] = "0";
            }

            params.push(this.params[route["params"][key]])
        }

        return params
    }
}

export function getBackendUrl(): string {
    return config.apiHost;
}

export function getBackendApiUrl(route: string = null): string {
    return [getBackendUrl(), config.routes.base, route].join('');
}
