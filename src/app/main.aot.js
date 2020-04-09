"use strict";
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var app_module_ngfactory_1 = require('../aot/src/app.module.ngfactory');
if (webpack.ENV === 'production') {
    core_1.enableProdMode();
}
platform_browser_1.platformBrowser().bootstrapModuleFactory(app_module_ngfactory_1.AppModuleNgFactory);
//# sourceMappingURL=main.aot.js.map