import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Pipe({
    name: 'sanitizeStyle'
})
export class SanitizeStyle implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(html: string) : SafeStyle {
        return this._sanitizer.bypassSecurityTrustStyle(html);
    }
}

@Pipe({
    name: 'sanitizeHtml'
})
export class SanitizeHtml implements PipeTransform  {

    constructor(private _sanitizer: DomSanitizer){}

    transform(html: string) : SafeStyle {
        return this._sanitizer.bypassSecurityTrustHtml(html);
    }
}
