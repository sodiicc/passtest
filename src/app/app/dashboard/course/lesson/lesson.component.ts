import {Component, OnInit, Inject, ElementRef, OnDestroy} from '@angular/core';
import {LessonService} from '../../../_services/lesson.service';
import {AuthService} from "../../../_services/authorization.service";
import {Lesson} from '../../../_models/lesson.model';
import {Router, ActivatedRoute} from "@angular/router";
import {InterfaceService} from "../../../_services/interface.service";
import {Interface, NavigationControl} from '../../../_models/interface.model';
import {AudioService} from '../../../_services/audio.service';

@Component({
    selector: 'lesson',
    providers: [
        { provide: Window, useValue: window }
    ],
    templateUrl: './lesson.component.pug',
    styles: [String(require('./lesson.component.styl'))]
})

export class LessonComponent implements OnInit, OnDestroy {

    lesson: Lesson;
    activePage: number;
    id: number;
    cid: number;
    private sub: any;

    ready: boolean = false;
    anchor_processed: boolean = false;
    anchor: string;
    return_question_id: number = null;
    show_back_question: boolean = false;

    private player: any;
    private ytEvent: any;
    page: number = 1;
    pdf: any;
    isLoaded: boolean = false;
    defaultInterface: Interface;
    default_nav_classes: Array<string>;

    audioPlayer: AudioService = null;
    show_player: boolean = false;

    show_presentation: boolean = false;

    current_media_state: number = 0;

    constructor(
        @Inject(Window) private window: Window,
        private LessonService: LessonService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private interfaceService: InterfaceService,
        private elRef: ElementRef) { }

    ngOnInit() {
        this.activePage = 0;

        this.sub = this.route.params.subscribe(params => {
                this.id = +params['id'];
                this.cid = +params['cid'];

                this.defaultInterface = new Interface();
                this.defaultInterface.title = "Урок";
                this.defaultInterface.navControls = true;
                this.defaultInterface.navPreviousRoute =
                    () => this.router.navigate(['dashboard/course', this.cid]);
                this.default_nav_classes = [
                    "navbar-transparent",
                    "navbar-controls",
                    "bg-gradient"
                ];
                this.defaultInterface.navClasses = this.default_nav_classes;
                this.interfaceService.changeInterface(this.defaultInterface);

                // GET params
                this.route.queryParams.subscribe(params => {
                    this.anchor = params["anchor"];
                    this.return_question_id = params["question"];

                    if (this.anchor) this.show_back_question = true;

                    this.interfaceService.loading(true);
                    this.LessonService.getLesson(this.id)
                        .subscribe(lesson => {
                                this.interfaceService.loading(false);

                                this.lesson = lesson;
                                this.ready = true;

                                this.defaultInterface.navStyle = this.lesson.color.generateGradient();
                                this.interfaceService.changeInterface(this.defaultInterface);

                                if (this.lesson.type == 'audio') {
                                    this.defaultInterface.navControlsRightActive = true;
                                    this.defaultInterface.navControlsRight = new NavigationControl();

                                    let start_time = 0;
                                    if (this.anchor) start_time = parseInt(this.anchor);
                                    this.openAudioPlayer(start_time);
                                } else if (this.lesson.type == 'presentation') {
                                    this.defaultInterface.navControlsRightActive = true;
                                    this.defaultInterface.navControlsRight = new NavigationControl();

                                    let presentation_page = 1;
                                    if (this.anchor) presentation_page = parseInt(this.anchor);
                                    this.openPresentation(presentation_page);
                                }

                                this.interfaceService.changeInterface(this.defaultInterface);
                            },
                            err => {
                                this.interfaceService.loading(false);
                                this.authService.checkError(err);
                                this.router.navigate(['dashboard/courses']);
                            });
                });
            },
            err => {
                this.authService.checkError(err);
                this.router.navigate(['dashboard/courses']);
            });
    }

    processAnchor(): void {
        if (this.anchor_processed) {
            return;
        } else {
            this.anchor_processed = true;
        }

        if (this.lesson.type === 'html') {
            this.anchor = String(this.anchor).replace('#','');

            const element = document.querySelector( "#" + this.anchor );
            if (element) {
                element.scrollIntoView();
                element.classList.add('anchor');
            }
        }
    }

    pageChange(i: number){
        this.activePage = i;
        this.window.document.getElementById('lessonTop').scrollIntoView();
    }

    backToQuestion(): void {
        this.router.navigate(['dashboard/course/test', this.cid, this.id],
            { queryParams: { question: this.return_question_id } });
    }

    /********* YOUTUBE PLAYER *********/

    onStateChange(event: any) {
        this.ytEvent = event.data;
    }
    savePlayer(player: any) {
        this.player = player;

        if (this.anchor) {
            this.tryAutoplay();
        }
    }

    tryAutoplay(): void {
        console.log('Event: ', this.ytEvent);

        if (parseInt(this.ytEvent) != 1) {
            this.playVideo();

            setTimeout(() => this.tryAutoplay(), 1000)
        }
    }

    playVideo() {
        this.player.playVideo();
    }

    pauseVideo() {
        this.player.pauseVideo();
    }

    seekTo(seconds: number) {
        this.player.seekTo(seconds, false)
    }

    ngOnDestroy() {
        if (this.lesson && this.lesson.type == 'audio') {
            this.audioPlayer.pause();
            this.audioPlayer = null;
        }
        this.sub.unsubscribe();
    }

    getTest = (): void => {
        this.router.navigate(['dashboard/course/test', this.cid, this.id]);
    }

    getCourse(): void  {
        this.router.navigate(['dashboard/course', this.cid]);
    }

    /********* PDF READER *********/
    openPresentation(page: number = null): void {
        if (page !== null) this.current_media_state = page
        this.show_presentation = true;

        // Interface
        this.defaultInterface.navStyle = null;
        this.defaultInterface.navClasses = ["navbar-default", "navbar-controls"];
        this.defaultInterface.content.classes = ["h-100"];
        this.defaultInterface.navControlsRight.classes = ["fa", "fa-align-left", "fa-xs"];
        this.defaultInterface.navControlsRight.callback = () => this.closePresentation();
        this.interfaceService.changeInterface(this.defaultInterface);
    }


    closePresentation(): void {
        this.show_presentation = false;

        this.defaultInterface.navStyle = this.lesson.color.generateGradient();
        this.defaultInterface.navClasses = this.default_nav_classes;
        this.defaultInterface.content.classes = [""];
        this.defaultInterface.navControlsRight.classes = ["fa", "fa-play-circle", "fa-xs"];
        this.defaultInterface.navControlsRight.callback = () => this.openPresentation();
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    /********* AUDIO PLAYER *******/
    closeAudioPlayer(): void {
        this.show_player = false;
        this.audioPlayer.pause();

        this.defaultInterface.navStyle = this.lesson.color.generateGradient();
        this.defaultInterface.navClasses = this.default_nav_classes;
        this.defaultInterface.content.classes = [""];
        this.defaultInterface.navControlsRight.classes = ["fa", "fa-play-circle", "fa-xs"];
        this.defaultInterface.navControlsRight.callback = () => this.openAudioPlayer();
        this.interfaceService.changeInterface(this.defaultInterface);
    }

    openAudioPlayer(start: number = 0): void {
        this.show_player = true;

        // Interface
        this.defaultInterface.navStyle = null;
        this.defaultInterface.navClasses = ["navbar-default", "navbar-controls"];
        this.defaultInterface.content.classes = ["h-100"];
        this.defaultInterface.navControlsRight.classes = ["fa", "fa-align-left", "fa-xs"];
        this.defaultInterface.navControlsRight.callback = () => this.closeAudioPlayer();
        this.interfaceService.changeInterface(this.defaultInterface);

        if (this.audioPlayer) return;

        this.audioPlayer = new AudioService(this.lesson.content);
        if (start > 0) this.audioPlayer.setTime(start);
    }

    formatTime(seconds: number = 0): string {
        if (!seconds || seconds == Infinity) seconds = 0;

        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(14, 5);
    }

    audioPlayerLineClick(event: any) {
        let parent = event.target;
        if (parent.id == 'progress-bar') {
            parent = parent.parentElement;
        }

        let parentWidth = parent.offsetWidth;
        let currentWidth = event.clientX - parent.offsetLeft;

        let percent = currentWidth/parentWidth*100;
        this.audioPlayer.setPercent(percent);
    }
}
