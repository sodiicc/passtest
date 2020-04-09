import {Component, OnInit} from '@angular/core';
import {Interface} from '../../_models/interface.model';
import {InterfaceService} from "../../_services/interface.service";

@Component({
    selector: 'info-page',
    templateUrl: './info.component.pug'
})
export class InfoComponent implements OnInit {
    defaultInterface: Interface;

    constructor(private interfaceService: InterfaceService) {}

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Информация";
        this.interfaceService.changeInterface(this.defaultInterface);
    }
}
