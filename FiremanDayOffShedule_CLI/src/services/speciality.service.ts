import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SpecialityService {
  //private apiUrl = 'https://localhost:7130/api/Speciality'; 
  private apiUrl = environment.apiUrl + '/api/Speciality';
  constructor(private http: HttpClient) {}

  getSpecialities(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ $id: string, $values: { id: number, name: string }[] }>(this.apiUrl).pipe(
      map(response => response.$values)  // Gebruik alleen het $values deel van de response
    );
  }
}

