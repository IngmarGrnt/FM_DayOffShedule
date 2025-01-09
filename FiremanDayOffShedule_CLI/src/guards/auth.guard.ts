import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    const accessToken = localStorage.getItem('access_token');
    // console.log('Token uit localstorage:', accessToken);

    if (!accessToken) {
      // console.error('Geen token gevonden, doorverwijzen naar loginpagina.');
      router.navigate(['/login']);
      return false;
    }

    // Decodeer het token en controleer op rol
    const decodedToken: any = jwtDecode(accessToken);
    const roleClaim = 'https://firemandayoffschedule.com/role'; // Pas aan naar jouw namespace
    const userRole = decodedToken[roleClaim];
    // console.log('Gebruikersrol uit token:', userRole);

    if (!userRole) {
      // console.error('Geen geldige rol gevonden, doorverwijzen naar loginpagina.');
      router.navigate(['/login']);
      return false;
    }

    // Controleer of de gebruiker de vereiste rol heeft
    const requiredRoles = route.data?.['roles'] as string[]; // Array van toegestane rollen
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      // console.error(`Gebruiker heeft geen toegang. Vereiste rollen: ${requiredRoles}`);
      router.navigate(['/unauthorized']); // Navigeer naar een unauthorized-pagina
      return false;
    }

    // Toegang toegestaan
    return true;
  } catch (error) {
    console.error('Fout bij decoderen van token:', error);
    router.navigate(['/login']);
    return false;
  }
};
