import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  //private apiUrl = 'https://localhost:7130/api/Role'; 
  private apiUrl = environment.apiUrl + '/api/Role';
  constructor(private http: HttpClient) {}

  // Haal de lijst van rollen op uit het $values veld van de API respons
  getRoles(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ $id: string, $values: { id: number, name: string }[] }>(this.apiUrl).pipe(
      map(response => response.$values)  // Gebruik alleen het $values deel van de response
    );
  }
}

