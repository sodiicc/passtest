import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MdmAppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {AgreementComponent} from './agreement/agreement.component';
import {routing} from './app.routes';
import {SharedModule} from './shared.module';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {InterfaceService} from './_services/interface.service';
import {UserService} from './_services/user.service';
import {AgreementService} from './_services/agreement.service';
import {AgreementGuard} from './_services/agreement.guard';

import { PipeModule } from './pipe.module';



@NgModule({
    imports: [
        routing,
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        PipeModule
    ],
    declarations: [
        MdmAppComponent,
        LoginComponent,
        AgreementComponent,
    ],
    providers: [
        InterfaceService,
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        UserService,
        AgreementService,
        AgreementGuard
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [MdmAppComponent]
})
export class AppModule {}
