import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {Ng2DeviceService} from 'ng2-device-detector';
import {getBackendUrl} from '../_helpers/route.helper';

import {config} from '../_helpers/config.helper'

// Functions declaration
declare function unescape(s:string): string;
declare function escape(s:string): string;

@Injectable()
export class AnalyticsSocketService {
    private host: string = getBackendUrl();
    private io = require('socket.io-client');
    private socket: any;
    constructor(private token: string) {
        this.socket = this.io(this.host, {
            path: config.socket_comet,
            query: 'token=' + token
        });
        this.socket.on("connect", () => this.connected());
        this.socket.on("disconnect", () => this.disconnected());
        this.socket.on("error", (error: string) => {
            console.log(`ERROR: "${error}" (${this.host})`);
        });
    }
    connect () {
        this.socket.connect();
    }
    disconnect () {
        this.socket.disconnect();
    }
    on(event_name:any) {
        console.log(`listen to ${event_name}:`);
        return new Observable<any>(observer => {
            this.socket.off(event_name);
            this.socket.on(event_name, (data:any) => {
                observer.next(data);
            });
        });
    }
    private connected() {
        console.log('Connected');
    }
    private disconnected() {
        console.log('Disconnected');
    }
}

@Injectable()
export class AnalyticsService {
    deviceInfo: any = null;

    geolocation: object = {};
    device: string = null;
    browser: string = null;
    os: string = null;
    url_from: string = null;

    utm_source: string = null;
    utm_medium: string = null;
    utm_campaign: string = null;
    utm_term: string = null;
    utm_content: string = null;

    constructor(private deviceService: Ng2DeviceService) {
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(this.formatGeolocation);
        }

        this.deviceInfo = this.deviceService.getDeviceInfo();

        this.url_from = document.referrer;
        this.os = this.deviceInfo.os;
        this.device = this.deviceInfo.device;
        this.browser = this.deviceInfo.browser;
        this.utm_source = this.getQueryStringValue('utm_source');
        this.utm_medium = this.getQueryStringValue('utm_medium');
        this.utm_campaign = this.getQueryStringValue('utm_campaign');
        this.utm_term = this.getQueryStringValue('utm_term');
        this.utm_content = this.getQueryStringValue('utm_content');
    }

    getMetadata(): object {
        return {
            device: this.device,
            os: this.os,
            url_from: this.url_from,
            gpsLatitude: this.geolocation['lat'],
            gpsLongitude: this.geolocation['lng'],
            utm_source: this.utm_source,
            utm_medium: this.utm_medium,
            utm_campaign: this.utm_campaign,
            utm_term: this.utm_term,
            utm_content: this.utm_content,
        }
    }

    getQueryStringValue (key: string): string {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    formatGeolocation = (data: any): void => {
        this.geolocation = {
            'lat': data['coords']['latitude'],
            'lng': data['coords']['longitude']
        }
    }
}
