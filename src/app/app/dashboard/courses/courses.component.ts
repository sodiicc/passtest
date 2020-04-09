import {Component, OnInit, } from '@angular/core';
import {CourseService} from '../../_services/course.service';
import {Router} from "@angular/router";
import {Course} from '../../_models/course.model';
import {AuthService} from "../../_services/authorization.service";
import {InterfaceService} from "../../_services/interface.service";
import {Interface} from '../../_models/interface.model';
import {PaginationHelper} from '../../_helpers/pagination.helper';

@Component({
    selector: 'courses',
    templateUrl: './courses.component.pug',
    styles: [String(require('./courses.component.styl'))]
})
export class CoursesComponent implements OnInit {

    courses: Course[] = [];
    course: Course;
    defaultInterface: Interface;
    pagination: PaginationHelper;

    constructor(
        private courseService: CourseService,
        private router: Router,
        private authService: AuthService,
        private interfaceService: InterfaceService) {
    }

    ngOnInit() {
        this.defaultInterface = new Interface();
        this.defaultInterface.title = "Обучение";
        this.interfaceService.changeInterface(this.defaultInterface);

        this.pagination = new PaginationHelper();

        this.interfaceService.loading(true);
        this.pagination.loading = true;
        this.courseService.getCourses()
        .subscribe(courses => {
            this.pagination.nextPage();
            this.interfaceService.loading(false);
            this.courses = courses;
            this.pagination.loading = false;
        },
        err => {
            this.interfaceService.loading(false);
            this.pagination.loading = false;
            this.authService.checkError(err);
        });
    }

    onScrollDown() {
        if (this.pagination.loading) return;

        this.pagination.loading = true;
        this.courseService.getCourses(this.pagination)
            .subscribe(courses => {
                    this.courses = this.courses.concat(courses);
                    if (courses.length) this.pagination.nextPage();
                    this.pagination.loading = false;
                },
                err => {
                    this.pagination.loading = false;
                    this.authService.checkError(err);
                });
    }

    getCourse(id:number): void  {
        this.router.navigate(['dashboard/course', id]);
    }

}
