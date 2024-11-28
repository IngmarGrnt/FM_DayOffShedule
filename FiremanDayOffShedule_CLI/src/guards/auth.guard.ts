import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): boolean {
    const requiredRole = route.data?.role; // Haal de vereiste rol op

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      alert('You do not have permission to view this page');
      this.router.navigate(['/profile']);
      return false;
    }

    return true;
  }
}
