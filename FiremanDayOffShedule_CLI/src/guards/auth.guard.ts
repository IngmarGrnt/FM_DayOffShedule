import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Controleer of er een token is
    if (token) 
      {
        console.log("Token toegestaan",token)
      return true; // Toegang toegestaan

    }

    // Als de gebruiker niet is ingelogd, doorverwijzen naar loginpagina
    this.router.navigate(['/login']);
    return false;
  }
}
