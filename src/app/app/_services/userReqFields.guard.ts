import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class UserReqFieldsGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate() {
        let userReqFields = JSON.parse(localStorage.getItem('userReqFields'));
        if (userReqFields) {
            return true;
        }
        this.router.navigate(['/dashboard/user']);
        return false;
    }
}
