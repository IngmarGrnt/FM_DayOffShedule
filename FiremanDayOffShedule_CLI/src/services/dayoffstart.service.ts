import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DayoffstartService {

  //private apiUrl = 'https://localhost:7130/api/dayoffstart'; 
 private apiUrl = environment.apiUrl + '/api/dayoffstart';
  constructor(private http: HttpClient) {}

  getDayOffStart(): Observable<{ id: number, dayOffBase: string}[]> {
    return this.http.get<{ $id: string, $values: { id: number, dayOffBase: string }[] }>(this.apiUrl).pipe(
      map(response => response.$values)
      // Gebruik alleen het $values deel van de response
    );
    
  }
}
