import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate() {
        let isAgreement = JSON.parse(localStorage.getItem('isAgreement'));
        let currentUser = localStorage.getItem("currentUser");
        
        if (currentUser && isAgreement) {
            return true;
        }
        if (!currentUser) {
            this.router.navigate(['']);
            return false;
        }
        if (!isAgreement) {
            this.router.navigate(['/agreement']);
            return false;
        }
    }
}
