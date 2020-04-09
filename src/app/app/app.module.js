"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var platform_browser_1 = require('@angular/platform-browser');
var flex_layout_1 = require('@angular/flex-layout');
var animations_1 = require('@angular/platform-browser/animations');
var material_1 = require('@angular/material');
var ng_selectize_1 = require('ng-selectize');
var ngx_datatable_1 = require('@swimlane/ngx-datatable');
require('hammerjs');
var app_component_1 = require('./app.component');
var open_issue_component_1 = require('./issues/issue-create.component');
var topbar_navigation_component_1 = require('./topbar-navigation/topbar-navigation.component');
var navigation_component_1 = require('./navigation/navigation.component');
var issue_dialog_component_1 = require('./issues/issue-dialog.component');
var issue_list_component_1 = require('./issues/issue-list.component');
var api_service_1 = require('./api.service');
var issue_data_service_1 = require('./issue-data.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.ReactiveFormsModule,
                animations_1.BrowserAnimationsModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                material_1.MaterialModule,
                material_1.MdTabsModule,
                material_1.MdInputModule,
                material_1.MdDialogModule,
                flex_layout_1.FlexLayoutModule,
                ng_selectize_1.NgSelectizeModule,
                http_1.JsonpModule,
                ngx_datatable_1.NgxDatatableModule
            ],
            entryComponents: [
                issue_dialog_component_1.IssueDialogComponent
            ],
            declarations: [
                app_component_1.IrApp,
                open_issue_component_1.OpenIssueComponent,
                topbar_navigation_component_1.TopbarNavigationComponent,
                navigation_component_1.NavigationComponent,
                issue_dialog_component_1.IssueDialogComponent,
                issue_list_component_1.IssueListComponent
            ],
            providers: [issue_data_service_1.IssueDataService, api_service_1.ApiService],
            schemas: [core_1.CUSTOM_ELEMENTS_SCHEMA],
            bootstrap: [app_component_1.IrApp]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map