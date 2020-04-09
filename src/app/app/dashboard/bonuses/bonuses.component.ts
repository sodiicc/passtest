import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute } from "@angular/router";
import {InterfaceService} from "../../_services/interface.service";
import {Interface} from '../../_models/interface.model';
import { slideInOutAnimation } from '../../_animations/index';

@Component({
    selector: 'course',
    templateUrl: './bonuses.component.pug',
    animations: [slideInOutAnimation],
    //host: { '[@slideInOutAnimation]': '' },
    styles: [String(require('./bonuses.component.styl'))]
})
export class BonusesComponent implements OnInit {
    defaultInterface: Interface;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private interfaceService: InterfaceService) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.interfaceService.changeInterface(this.defaultInterface);

        this.defaultInterface.title = "Вывод баллов";
        this.defaultInterface.navControls = true;
        this.defaultInterface.navPreviousRoute = () => this.router.navigate(['dashboard/profile']);
        this.defaultInterface.navClasses = ["navbar-controls"];
        this.defaultInterface.content.classes = ["h-100"];
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    getWithdraw(method:string): void  {
        this.router.navigate(['dashboard/bonuses', method]);
    }
}
