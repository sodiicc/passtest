import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AgreementGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate() {
        let isAgreement = JSON.parse(localStorage.getItem('isAgreement'));
        if (!isAgreement) {
            return true;
        }
        this.router.navigate(['/dashboard/feed']);
        return false;
    }
}
