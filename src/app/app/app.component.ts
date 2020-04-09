import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FcmService} from "./_services/fcm.service";
import {Modal} from './_models/interface.model';
import {InterfaceService} from './_services/interface.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
    selector: 'ir-app',
    styles: [String(require('./app.component.styl'))],
    templateUrl: 'app.component.pug',
})
export class MdmAppComponent implements OnInit {

    message: any;

    @ViewChild('modalWindowElem') modalWindowRef:TemplateRef<any>;
    modalWindow: Modal;
    modalWindowInstance: BsModalRef;

    constructor(private msgService: FcmService,
                private interfaceService: InterfaceService,
                private modalService: BsModalService) {}

    ngOnInit() {
        // Modal state changes
        this.interfaceService._modalStorage.subscribe(modal => {
            if (modal == undefined) return;

            console.log('Modal window', modal);

            setTimeout(() => {
                this.modalWindow = modal;

                this.modalWindowInstance = this.modalService.show(
                    this.modalWindowRef,
                    Object.assign({}, {}, { class: 'modal-default' }));

            }, 0);
        });
    }
}