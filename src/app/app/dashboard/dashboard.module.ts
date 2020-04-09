import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { DashboardComponent } from './dashboard.component'
import { FeedComponent } from './feed/feed.component'
import { DashboardRoutesModule } from './dashboard.routes'
import { SharedModule } from '../shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CarouselModule} from 'ngx-bootstrap';
import { FormatDate } from '../_helpers/date.helper';
import { InfoComponent } from './static/info.component';
import { UserComponent } from './user/user.component';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { LessonComponent} from './course/lesson/lesson.component';
import { PresentationComponent } from './course/lesson/categories/presentation/presentation.component';
import { TestComponent } from './course/test/test.component';
import { NewsComponent } from './news/news.component';
import { NewsViewComponent } from './news/news_view/news_view.component';
import { BonusesComponent } from './bonuses/bonuses.component';
import { WithdrawComponent } from './bonuses/withdraw/withdraw.component';

// Services
import {AuthGuard} from '../_services/auth.guard';
import { UserReqFieldsGuard } from '../_services/userReqFields.guard';
import {UserService} from '../_services/user.service';
import {CourseService} from "../_services/course.service";
import {NewsService} from "../_services/news.service";
import {LessonService} from "../_services/lesson.service";
import {TestService} from "../_services/test.service";
import {FeedService} from "../_services/feed.service";
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {SocketService} from "../_services/socket.service";
import {AnalyticsService, AnalyticsSocketService} from "../_services/analytics.service";
import {BonuseService} from '../_services/bonuse.service'
import {PushService} from '../_services/push.service';
import {DictionaryService} from '../_services/dictionary.service';
import { PipeModule } from '../pipe.module';

// Vendors
import {PinchZoomModule} from '../_vendor/ngx-pinch-zoom';
import {YoutubePlayerModule} from 'ng2-youtube-player';
import {PushNotificationsModule, SimpleNotificationsModule} from 'angular2-notifications/index';
import {NgSelectizeModule} from 'ng-selectize';
import {Ng2AutoCompleteModule} from 'ng2-auto-complete';
import {Ng2CompleterModule} from 'ng2-completer';

@NgModule({
    imports: [
        DashboardRoutesModule,
        SharedModule,
        InfiniteScrollModule,
        PdfViewerModule,
        CarouselModule.forRoot(),
        PinchZoomModule,
        YoutubePlayerModule,
        PushNotificationsModule,
        SimpleNotificationsModule,
        NgSelectizeModule,
        Ng2AutoCompleteModule,
        Ng2CompleterModule,
        MaterialModule,
        PipeModule
    ],
    declarations: [
        DashboardComponent,
        InfoComponent,
        UserComponent,
        DashboardComponent,
        CoursesComponent,
        CourseComponent,
        LessonComponent,
        PresentationComponent,
        TestComponent,
        FeedComponent,
        NewsComponent,
        NewsViewComponent,
        BonusesComponent,
        WithdrawComponent,
        FormatDate,
        InfoComponent,
        FeedComponent,
    ],
    providers: [
        UserService,
        CourseService,
        LessonService,
        TestService,
        FeedService,
        NewsService,
        SocketService,
        AnalyticsService,
        AnalyticsSocketService,
        PushService,
        BonuseService,
        DictionaryService,
        UserReqFieldsGuard,
        AuthGuard
    ]
})
export class DashboardModule { }
