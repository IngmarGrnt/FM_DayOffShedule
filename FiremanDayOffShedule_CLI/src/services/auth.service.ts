import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //private apiUrl = 'https://localhost:7130/api/auth'; // Pas de URL aan als nodig
   private apiUrl = environment.apiUrl + '/api/auth';
  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();
  constructor(private http: HttpClient) {}

  private userRoleSubject = new BehaviorSubject<string | null>(this.getRoleFromToken());
  userRole$ = this.userRoleSubject.asObservable();

  login(username: string, password: string): Observable<{ token: string }> {
    return new Observable(observer => {
      this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email: username, password }).subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.token);
          this.loggedInSubject.next(true); // Update ingelogde status
          this.userRoleSubject.next(this.getRoleFromToken()); // Update gebruikersrol
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /**
   * Decodeer het token en haal de rol van de gebruiker op.
   */
  private getRoleFromToken(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const roleClaim = 'https://firemandayoffschedule.com/role'; // Pas aan naar jouw namespace
        localStorage.setItem('role_token',decodedToken[roleClaim]);
        return decodedToken[roleClaim] ?? null;

      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Controleer of de gebruiker ingelogd is.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Log de gebruiker uit door het token en andere gebruikersgegevens te verwijderen.
   */
  logout(): void {
    localStorage.removeItem('access_token'); // Token verwijderen
    this.loggedInSubject.next(false); // Update ingelogde status
    this.userRoleSubject.next(null); // Reset gebruikersrol
  }



  /**
   * Haal de huidige gebruikersrol op.
   */
  getRole(): string | null {
    return this.userRoleSubject.value;
  }

  /**
   * Controleer of de gebruiker een specifieke rol heeft.
   */
  hasRole(role: string): boolean {
    const userRole = this.getRole();
    return userRole === role || userRole === 'Admin'; // Pas aan als meerdere rollen nodig zijn
  }

  /**
   * Haal de gebruiker-ID op uit het token.
   */
  // getUserId(): number | null {
  //   const token = localStorage.getItem('access_token');
  //   if (token) {
  //     try {
  //       const decodedToken: any = jwtDecode(token);
  //       return decodedToken['sub'] ? Number(decodedToken['sub']) : null; // Gebruik 'sub' of een andere claimnaam
  //     } catch (error) {
  //       console.error('Error decoding token', error);
  //       return null;
  //     }
  //   }
  //   return null;
  // }

  getAuth0Id(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // console.log('getAuth0Id uit token:', decodedToken['sub']);
        return decodedToken['sub'] || null; // 'sub' bevat meestal de Auth0Id
      } catch (error) {
        console.error('Fout bij het decoderen van het token:', error);
        return null;
      }
    }
    return null;
  }
  
}
