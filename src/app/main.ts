import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import './assets/styl/main.styl';

if (webpack.ENV === 'production') {
    enableProdMode();
    console.log('Application production mode');
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .then(success => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/firebase-messaging-sw.js')
                .then(registration => console.log('SW has been registered with scope: ',
                    registration.scope));
        }
    })
    .catch(err => console.error(err));
