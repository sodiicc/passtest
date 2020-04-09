import {Input, Component, OnInit, Inject, ElementRef, OnDestroy} from '@angular/core';
import {Lesson} from '../../../../../_models/lesson.model';
import {InterfaceService} from "../../../../../_services/interface.service";
import {TestService} from "../../../../../_services/test.service";

@Component({
    selector: 'lesson-presentation',
    templateUrl: './presentation.component.pug',
    styles: [String(require('./presentation.component.styl'))]
})
export class PresentationComponent implements OnDestroy, OnInit {
    @Input() lesson: Lesson;
    @Input() page: number = 1;
    @Input() finalCallback: () => null = () => null;
    public numPages: number = 0;
    public current_page: number = 0;
    public loading: boolean = false;

    public fullscreen: boolean = false;
    public isTest: boolean = false;
    public interface_enable: boolean = true;

    constructor(
        private interfaceService: InterfaceService,
        private testService: TestService,
        ){}

    ngOnInit() {
        this.setLoading(true);
        this.testService.getTest(this.lesson.id).subscribe(data => this.isTest = !!data.id)
    }
   
    onLoaded(pdf: any): void {
        this.setLoading(false);
        this.current_page = this.page;
        this.numPages = pdf['numPages'] + 1;
    }

    setPage(page: number = null) {
        if (page === null) {
            page = this.numPages
        }

        this.current_page = page;
    }

    nextPage(): void {
        if (this.current_page + 1 > this.numPages) return;

        this.current_page += 1;
    }

    prevPage(): void {
        if (this.current_page - 1 <= 0) return;

        this.current_page -= 1;
    }

    onError(error: any) {
        this.setLoading(false);
        console.log('ERROR!', error);
    }

    setLoading(active: boolean): void {
        this.loading = active;
        this.interfaceService.loading(active);
    }


    ngOnDestroy() {
        this.interfaceService.fullscreen(false);
        this.setLoading(false);
    }

    /* Interface methods */
    switchInterface(): void {
        this.interface_enable = !this.interface_enable;
    }

    forceResize(): void {
        setTimeout(() => {
            this.nextPage();
            setTimeout(() => this.prevPage(), 100);
        }, 1)
    }

    fullscreenEnable(): void {
        this.interfaceService.fullscreen(true);
        this.fullscreen = true;
        this.forceResize();
    }

    fullscreenDisable(): void {
        this.interfaceService.fullscreen(false);
        this.fullscreen = false;
        this.forceResize();
    }
}
