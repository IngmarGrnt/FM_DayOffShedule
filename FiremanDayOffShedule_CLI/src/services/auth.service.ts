import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DecodedToken } from '../interfaces/decodeToken.model';
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7130/api/auth'; // Pas de URL aan als nodig
  private userRoleSubject = new BehaviorSubject<string | null>(this.getRoleFromToken());
  userRole$ = this.userRoleSubject.asObservable(); // Observable om de gebruikersrol te volgen
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return new Observable(observer => {
      this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
        email: username,
        password,
      }).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.userRoleSubject.next(this.getRoleFromToken()); // Update de rol na succesvol inloggen
          observer.next(response);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }
  getRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // console.log('Decoded Token:', decodedToken); // Controleer hier wat er in het gedecodeerde token zit
        return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token'); // Token verwijderen
    localStorage.removeItem('username'); // Gebruikersnaam verwijderen
  }

  getRole(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        // console.log('Decoded Token:', decodedToken); // Controleer hier wat er in het gedecodeerde token zit
        return decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }
  
  getUserId(): number | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken["userId"] ? Number(decodedToken["userId"]) : null; // Dit hangt af van hoe je de claim hebt genoemd
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  hasRole(role: string): boolean {
    const userRole = this.getRole();
    return userRole === role  || userRole === 'Admin';
  }
  
}