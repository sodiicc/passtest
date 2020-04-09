import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { ModalModule } from 'ngx-bootstrap';
import { PhoneComponent } from './_components/phone/phone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FcmService } from './_services/fcm.service';
import { AuthService } from './_services/authorization.service';
import { AnalyticsService } from './_services/analytics.service';
import { JsonpModule, HttpModule } from '@angular/http';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { NotificationsService, PushNotificationsService } from 'angular2-notifications/dist';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        JsonpModule,
        HttpModule,
        AngularFireModule.initializeApp({
            apiKey: "AIzaSyCHrJ0hhK0OnoeT8h6PEih98HBS3RiRRz4",
            authDomain: "appteka-mdm.firebaseapp.com",
            databaseURL: "https://appteka-mdm.firebaseio.com",
            projectId: "appteka-mdm",
            storageBucket: "appteka-mdm.appspot.com",
            messagingSenderId: "92242544027"
        }),
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        Ng2DeviceDetectorModule.forRoot(),
    ],
    declarations: [
        PhoneComponent
    ],
    providers: [
        FcmService,
        AuthService,
        AnalyticsService,
        NotificationsService,
        PushNotificationsService,
    ],
    exports: [
        PhoneComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule
    ]
})
export class SharedModule {}
