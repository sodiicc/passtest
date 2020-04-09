import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LoginComponent} from './login/login.component';
import {AgreementComponent} from './agreement/agreement.component';
import {AgreementGuard} from './_services/agreement.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: LoginComponent},
    { path: 'agreement', pathMatch: 'full', component: AgreementComponent, canActivate: [AgreementGuard]},
    { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'}
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: false});
