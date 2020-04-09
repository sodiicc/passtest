import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray, AbstractControl} from '@angular/forms';
import {TestService} from '../../../_services/test.service';
import {CourseService} from '../../../_services/course.service';
import {Router, ActivatedRoute } from "@angular/router";
import {Test} from '../../../_models/test.model';
import {Course} from '../../../_models/course.model';
import {Question} from '../../../_models/question.model';
import {AuthService} from "../../../_services/authorization.service";
import {InterfaceService} from "../../../_services/interface.service";
import {Interface, NavigationControl, Modal} from '../../../_models/interface.model';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
    selector: 'test',
    templateUrl: './test.component.pug',
    animations: [
        trigger('fadeInOut', [
            state('open', style({
                opacity: 1
            })),
            state('closed', style({
                opacity: 0
            })),
            transition('open => closed', [animate(200)]),
            transition('closed => open', [animate(200)]),
            transition(':enter', [   // :enter is alias to 'void => *'
                style({opacity:0}),
                animate(200, style({opacity:1}))
            ]),
        ])
    ],
    styles: [String(require('./test.component.styl'))]
})
export class TestComponent implements OnInit, OnDestroy {

    test: Test;
    course: Course;
    question: Question;
    questions: object;
    answer: AbstractControl;
    results: object;
    result: object;
    id: number;
    cid: number;
    questionForm: FormGroup;
    timer_active: boolean;
    private sub: any;
    defaultInterface: Interface;
    show_results: boolean;
    return_question_id: number;

    loading: boolean;
    timer_enable: boolean;

    test_body_show: boolean;

    constructor(private formBuilder: FormBuilder,
                private authService: AuthService,
                private testService: TestService,
                private router: Router,
                private route: ActivatedRoute,
                private interfaceService: InterfaceService,
                private courseService: CourseService) {
    }

    openSnackBar(message: string, action: string) {
        let modal = new Modal();
        modal.message = message;
        this.interfaceService.modal(modal);
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.questions = {};
            this.results = {};
            this.loading = false;
            this.test = null;
            this.course = null;
            this.question = null;
            this.answer = null;
            this.result = {};
            this.questionForm = null;
            this.timer_active = false;
            this.defaultInterface = null;
            this.show_results = false;
            this.return_question_id = null;
            this.timer_enable = true;
            this.test_body_show = true;
            console.log('Test initialization');

            /* Interface */
            this.defaultInterface = new Interface();
            this.defaultInterface.title = "Тест";
            this.defaultInterface.navControls = true;
            this.defaultInterface.navPreviousRoute = () => this.router.navigate(['dashboard/course', this.cid]);
            this.defaultInterface.navClasses = ["navbar-default", "navbar-controls"];
            this.defaultInterface.content.classes = ["h-100"];
            this.interfaceService.changeInterface(this.defaultInterface);

            this.id = +params['id'];
            this.cid = +params['cid'];

            this.route.queryParams.subscribe(params => {
                this.return_question_id = +params['question'];
                this.interfaceService.loading(true);

                this.getQuestions(true);
            });
        },
        err => {
            this.authService.checkError(err);
            this.router.navigate(['dashboard/courses']);
        });
    }

    initForm(): void {
        let validator: any = [];

        if (this.question.type == 'checkbox') {
            validator = new FormArray(
                this.question.items.map(item =>
                    new FormControl((this.question.answer.indexOf(item['id']) != -1)))
            );
        } else if (this.question.type == 'radio') {
            validator = [(this.question.answer) ? this.question.answer[0] : '', Validators.compose([Validators.required])];
        }

        this.questionForm = this.formBuilder.group({
            'testQuestion': validator
        });

        this.answer = this.questionForm.controls['testQuestion'];

        // Interfaces initialization
        this.initNavButton();
    }

    ngOnDestroy() {
        this.timer_enable = false;

        this.sub.unsubscribe();
    }

    setLoading(): void {
        this.loading = true;

        //this.questionForm.disable();
        this.answer.disable();
    }

    setLoaded(): void {
        this.loading = false;
        //this.questionForm.enable();
        this.answer.enable();
    }

    isLoading(): boolean {
        return this.loading;
    }

    getQuestions(first: boolean = false):void {
        this.testService.getTest(this.id)
            .subscribe(test => {
                this.test = test;

                if (first) {
                    this.interfaceService.loading(false);
                }

                if (first && this.return_question_id) {
                    this.returnQuestion(this.return_question_id);
                    return;
                }
                if (first && this.test.completed) {
                    this.showTestResult();
                    return;
                }
                if (first) {
                    this.defaultInterface.title = this.test.name;
                    this.interfaceService.changeInterface(this.defaultInterface);
                }
                this.processQuestions(this.test.items);
            },
            err => {
                this.interfaceService.loading(false);
                this.authService.checkError(err);
                this.router.navigate(['dashboard/courses']);
            });
    }

    processQuestions(questions:Array<Question>):void {
        let next_position = -1;

        if (this.test.completed) {
            next_position = this.getTypePosition(2, this.getPosition(), () => {
                console.log('Completed | Wrong questions steps restart from 0');
                return this.getTypePosition(2, -1);
            });
        } else {
            next_position = this.getTypePosition(0, this.getPosition())
        }

        if (next_position == -1) {
            this.submitTest();
        } else {
            this.getQuestion(questions[next_position].id)
        }
    }

    getTypePosition(type: number, previous: number = -1, finished: () => any = () => -1): number {
        let position = -1;

        for (let i=0; i<this.test.items.length; i++) {
            if (i > previous && this.test.items[i].state == type) {
                position = i;
                break;
            }

            // If finished loop and no result callback
            if (i == this.test.items.length - 1) return finished.call(this);
        }

        return position;
    };

    getPosition(): number {
        let position = -1;

        if (!this.question) {
            return position;
        }

        for (let i=0; i<this.test.items.length; i++) {
            if (this.question.id == this.test.items[i].id) {
                position = i;
            }
        }

        return position
    }

    getQuestion(id:number) {
        this.testService.getQuestion(this.id, id)
            .subscribe(question => {
                console.log('getQuestion');
                this.test_body_show = false;
                setTimeout(() => {
                    this.test_body_show = true;

                    // Timer if available
                    if (!this.timer_active && this.test.time_limit && !this.test.completed) {
                        this.testTimer();
                    }

                    if (question.id in this.results) {
                        question.state = (this.results[question.id]) ? 1 : 2;
                    } else {
                        question.state = this.test.items
                            .find(item => item.id === question.id).state
                    }

                    this.questions[question.id] = question;
                    this.question = question;

                    // SetUp form
                    this.initForm();
                }, 200);
            },
            err => {
                this.authService.checkError(err);
            });
    }

    private extractAnswer(): Array<string> {
        if (this.question.type == 'radio') {
            return [this.answer.value];
        }

        if (this.question.type == 'checkbox') {
            let result = [];

            for (let i=0; i<this.answer.value.length; i++) {
                if (this.answer.value[i]) {
                    result.push(this.question.items[i]['id'])
                }
            }
            return result
        }
    }

    private testTimer(): void {
        if (!this.timer_enable) return;

        this.timer_active = true;
        let interval = 200;

        this.test.time_last -= interval/1000;

        // Update title
        this.defaultInterface.title = this.formatTime(this.test.time_last);
        this.interfaceService.changeInterface(this.defaultInterface);

        if (this.test.time_last <= 0) {
            this.submitTest();
            return;
        }

        setTimeout(() => this.testTimer(), interval)
    }

    private formatTime(seconds: number): string {
        return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0].substring(3);
    }

    formatAnswer(): string {
        return String(this.extractAnswer().join(','))
    }

    setQuestion() {
        // If not loading
        if (this.isLoading()) return;
        // If can't edit
        if (this.getCurrentQuestion().answer && !this.getCurrentQuestion().can_edit) {
            return this.openSnackBar('На ответ предоставляется только одна попытка', 'OK');
        }

        this.setLoading();

        let data = {
            answer_id: this.formatAnswer()
        };
        this.testService.setQuestion(this.id, this.question.id, data)
            .subscribe(response => {
                this.setLoaded();

                let result = response['success'];
                this.results[this.question.id] = result;
                this.questions[this.question.id].state = (result) ? 1 : 2;
                this.questions[this.question.id].anchor = response['anchor'];
                this.test.items[this.getQuestionOrder()].state = (result) ? 1 : 2;
                this.test.items[this.getQuestionOrder()].anchor = response['anchor'];

                this.questions[this.question.id].answer = this.extractAnswer();
                this.test.items[this.getQuestionOrder()].answer = this.extractAnswer();

                //this.showQuestionResult()
                this.processQuestionResult();
            },
            err => {
                this.setLoaded();

                this.authService.checkError(err);
            });
    }

    processQuestionResult(): void {
        if (!this.getQuestionResult() && this.getCurrentQuestion().can_edit) {
            //setTimeout(() => this.getQuestions(), 1000)
        } else {
            // GoTo next question
            setTimeout(() => this.getQuestions(), 1000)
        }
    }

    initNavButton(): void {
        this.defaultInterface.navControlsRightActive = false;
        let button = new NavigationControl();
        button.classes = ["btn-control-arrow-right"];

        if (this.question.type == 'checkbox') {
            this.defaultInterface.navControlsRightActive = true;

            if (this.question.state == 0) {
                button.classes.push("disabled");
            } else {
                button.classes.push("btn-active");
            }
        } else if (this.question.type == 'radio') {}

        this.defaultInterface.navControlsRight = button;
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    updateNavButton(): void {
        this.defaultInterface.navControlsRightActive = true;
        let button = new NavigationControl();
        button.classes = ["btn-control-arrow-right"];

        if (this.question.type == 'checkbox') {
            if (this.extractAnswer().length > 1) {
                button.classes.push("btn-active");
                button.callback = () => this.setQuestion();
            } else {
                button.classes.push("disabled")
            }
        } else if (this.question.type == 'radio') {
            this.defaultInterface.navControlsRightActive = false;
        }

        this.defaultInterface.navControlsRight = button;
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    getQuestionOrder(id: number = this.question.id): number {
        for (let i=0; i<this.test.items.length; i++) {
            if (this.test.items[i].id == id) {
                return i
            }
        }
    }

    submitTest(): void  {
        let data = {
            lessonId: this.id
        };
        this.testService.submitTest(data).subscribe(result => {
                this.result = result;
                this.test.correct_percentage = result['CorrectAnswersPercentage'];
                this.test.completed = true;

                let redirect = result['RedirectUrl'];

                if (redirect) {
                    this.followRedirect(redirect);
                }

                this.showTestResult();
            },
            err => {
                this.authService.checkError(err);
            });
    }

    followRedirect(redirect_url:string = null): void {
        if (!redirect_url) redirect_url = this.test.redirectUrl;

        window.location.href = redirect_url;
    }

    getCourse(): void  {
        this.router.navigate(['dashboard/course', this.cid]);
    }

    switchQuestion(id: number): void {
        let question_meta = this.test.items
            .find(item => item.id === id);

        if (question_meta.state !== 0 || id in this.questions || this.test.completed) {
            if (id in this.questions) {
                this.test_body_show = false;
                setTimeout(() => {
                    this.test_body_show = true;
                    this.question = this.questions[id];

                    // SetUp form
                    this.initForm();
                }, 200);
            } else {
                this.getQuestion(id);
            }
        }
    }

    private getCourseData(): void {
        this.courseService.getCourse(this.cid)
            .subscribe(course => {
                    this.course = course;
                },
                err => {
                    this.authService.checkError(err);
                });
    }

    getQuestionResult(): boolean {
        return (this.questions[this.question.id].state === 1)
    }

    getCurrentQuestion(): Question {
        return this.questions[this.question.id];
    }

    reloadQuestion(): void {}

    showTestResult(): void {
        this.show_results = true;
        this.getCourseData();
    }

    getFinalTest(): void  {
        this.show_results = false;
        this.router.navigate(['dashboard/course/test', this.cid, this.cid]);
    }

    hideTestResult(): void {
        this.show_results = false;
    }

    testResultSwitchQuestion(id: number) {
        if (this.isFinalTest()) return;

        this.switchQuestion(id);
        this.hideTestResult();
    }

    isFinalTest(): boolean {
        return (this.test.time_limit > 0)
    }

    finalTestAvailable(): boolean {
        return !this.course.completed && this.course.lessons.every((elem: object) => elem["completed"])
    }

    getHint(): void {
        if (this.isFinalTest()) return;
        this.router.navigate(['dashboard/course/lesson', this.cid, this.questions[this.question.id].lesson_id],
            {
                queryParams: { anchor: this.questions[this.question.id].anchor, question: this.question.id },
                //skipLocationChange: true
            });
    }

    returnQuestion(id: number): void {
        this.switchQuestion(id);
        this.hideTestResult();
    }

    reformatTestSteps(): any[] {
        let group: any[] = [],
            stack: number = 5;

        for (let i=0; i<this.test.items.length; i++) {
            if (!group[Math.floor(i/stack)]) group[Math.floor(i/stack)] = [];

            group[Math.floor(i/stack)].push(this.test.items[i])
        }

        return group
    }
}
