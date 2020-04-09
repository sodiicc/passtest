import { NgModule }      from '@angular/core';
import { SanitizeHtml, SanitizeStyle } from './_helpers/sanitize.helper';


@NgModule({
    imports:        [],
    declarations:   [SanitizeHtml, SanitizeStyle],
    exports:        [SanitizeHtml, SanitizeStyle],
})

export class PipeModule {

  static forRoot() {
     return {
         ngModule: PipeModule
     };
  }
} 