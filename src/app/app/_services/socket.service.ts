import {Injectable} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {getBackendUrl} from '../_helpers/route.helper';
import {config} from '../_helpers/config.helper'

@Injectable()
export class SocketService {
    private host: string = getBackendUrl();
    private io = require('socket.io-client');
    private socket: any;
    constructor(private token: string) {
        this.socket = this.io(this.host, {
            path: config.socket,
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