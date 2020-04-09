import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_services/auth.guard';
import { UserReqFieldsGuard } from '../_services/userReqFields.guard';

import { DashboardComponent } from './dashboard.component'
import { FeedComponent } from './feed/feed.component'
import { InfoComponent } from './static/info.component';
import { UserComponent } from './user/user.component';
import { CourseComponent } from './course/course.component';
import { CoursesComponent } from './courses/courses.component';
import { LessonComponent} from './course/lesson/lesson.component';
import { TestComponent } from './course/test/test.component';
import { NewsComponent } from './news/news.component';
import { NewsViewComponent } from './news/news_view/news_view.component';
import { BonusesComponent } from './bonuses/bonuses.component';
import { WithdrawComponent } from './bonuses/withdraw/withdraw.component';



const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: '/dashboard/feed', pathMatch: 'full' },
            { path: 'user', component: UserComponent },
            { path: 'courses', component: CoursesComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'feed', component: FeedComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'course/:id', component: CourseComponent, canActivate: [UserReqFieldsGuard]},
            { path: 'course/lesson/:cid/:id', component: LessonComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'course/test/:cid/:id', component: TestComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'news', component: NewsComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'news/:id', component: NewsViewComponent, canActivate: [UserReqFieldsGuard] },
            //{ path: 'bonuses', component: BonusesComponent },
            { path: 'bonuses/:method', component: WithdrawComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'feed', component: FeedComponent, canActivate: [UserReqFieldsGuard] },
            { path: 'info', component: InfoComponent, canActivate: [UserReqFieldsGuard] }
        ]
    },
    { path: '**', redirectTo: '/dashboard/user', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutesModule { }
