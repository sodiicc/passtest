import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Interface, Modal} from '../_models/interface.model';
import 'rxjs/add/operator/map'


@Injectable()
export class InterfaceService {
    private defaultInterface: Interface;
    private defaultLoading: boolean;
    private defaultFullscreen: boolean;
    private defaultModal: Modal;

    constructor() {
        this.defaultInterface = new Interface();
        this.defaultLoading = false;
        this.defaultFullscreen = false;
    }

    private interfaceSource = new BehaviorSubject<Interface>(this.defaultInterface);
    public _interfaceStorage: Observable<Interface> = this.interfaceSource.asObservable();

    set interfaceObject(data: Interface) {
        this.interfaceSource.next(data);
    }

    changeInterface(interfaceChanges:Interface):void {
        this.interfaceObject = interfaceChanges;
    }

    // Loading bar
    private loadingSource = new BehaviorSubject<boolean>(this.defaultLoading);
    public _loadingStorage: Observable<boolean> = this.loadingSource.asObservable();

    set loadingObject(data: boolean) {
        this.loadingSource.next(data);
    }

    loading(data: boolean = false): void {
        this.loadingObject = data;
    }

    // Fullscreen
    private fullscreenSource = new BehaviorSubject<boolean>(this.defaultFullscreen);
    public _fullscreenStorage: Observable<boolean> = this.fullscreenSource.asObservable();

    set fullscreenObject(data: boolean) {
        this.fullscreenSource.next(data);
    }

    fullscreen(data: boolean = false): void {
        this.fullscreenObject = data;
    }

    // Modal
    private modalSource = new BehaviorSubject<Modal>(this.defaultModal);
    public _modalStorage: Observable<Modal> = this.modalSource.asObservable();

    set modalObject(data: Modal) {
        this.modalSource.next(data);
    }

    modal(modal: Modal): void {
        this.modalObject = modal;
    }
}
