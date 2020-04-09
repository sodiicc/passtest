import {Component, OnInit, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {CourseService} from '../../_services/course.service';
import {Router, ActivatedRoute, NavigationEnd} from "@angular/router";
import {Course} from '../../_models/course.model';
import {AuthService} from "../../_services/authorization.service";
import {InterfaceService} from "../../_services/interface.service";
import {Interface} from '../../_models/interface.model';
import { slideInOutAnimation } from '../../_animations/index';

@Component({
    selector: 'course',
    templateUrl: './course.component.pug',
    animations: [slideInOutAnimation],
    //host: { '[@slideInOutAnimation]': '' },
    styles: [String(require('./course.component.styl'))]
})
export class CourseComponent implements OnInit, OnDestroy {

    course: Course;
    id: number;
    private sub: any;
    defaultInterface: Interface;

    constructor(
        private courseService: CourseService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private interfaceService: InterfaceService,
        private sanitize: DomSanitizer) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Курс";
        this.defaultInterface.navControls = true;
        this.defaultInterface.navClasses = [
            "navbar-transparent",
            "navbar-controls",
            "bg-gradient"
        ];
        this.defaultInterface.navControlsRightActive = true;
        this.defaultInterface.navPreviousRoute = (previous: string) => {
            if (["/dashboard/courses", "/dashboard/feed"].indexOf(previous) > -1) {
                return this.router.navigate([previous]);
            }
            return this.router.navigate(['/dashboard/courses']);
        };
        this.interfaceService.changeInterface(this.defaultInterface);

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];

            this.interfaceService.loading(true);
            this.courseService.getCourse(this.id)
            .subscribe(course => {
                this.interfaceService.loading(false);
                this.course = course;

                this.defaultInterface.navStyle = this.course.color.generateGradient();
                this.interfaceService.changeInterface(this.defaultInterface);
            },
            err => {
                this.interfaceService.loading(false);
                this.authService.checkError(err);
                this.router.navigate(['dashboard/courses']);
            });
        },
        err => {
            this.authService.checkError(err);
            this.router.navigate(['dashboard/courses']);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getLessonTypeMeta(type_id: number): object {
        let meta = {
            html: {
                lang: "Текст",
                icon: "lesson-icon-text"
            },
            youtube: {
                lang: "Видео",
                icon: "lesson-icon-video"
            },
            audio: {
                lang: "Аудио",
                icon: "lesson-icon-audio"
            },
            presentation: {
                lang: "Презентация",
                icon: "lesson-icon-text"
            }
        };

        return meta[type_id];
    }

    getLesson(id:number): void  {
        this.router.navigate(['dashboard/course/lesson', this.id, id]);
    }

    getFinalTest(): void  {
        this.router.navigate(['dashboard/course/test', this.id, this.id]);
    }

    finalTestAvailable(): boolean {
        return !this.course.completed && this.course.lessons.every((elem: object) => elem["completed"])
    }

}
