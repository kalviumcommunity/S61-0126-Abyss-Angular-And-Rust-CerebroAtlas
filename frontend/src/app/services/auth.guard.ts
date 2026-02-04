import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // If SSR, allow rendering (do not block route)
    if (typeof window === 'undefined') {
      return true;
    }
    // In browser, check for token
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    // Redirect to login if not authenticated
    return this.router.parseUrl('/login');
  }
}
