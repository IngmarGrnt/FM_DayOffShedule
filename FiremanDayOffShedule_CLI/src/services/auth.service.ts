import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7130/api/auth'; // Pas de URL aan als nodig

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, {
      email: username, // Gebruik 'email' in plaats van 'username'
      password,
    });
  }


  logout() {
    localStorage.removeItem('token'); // Token verwijderen
  }
}