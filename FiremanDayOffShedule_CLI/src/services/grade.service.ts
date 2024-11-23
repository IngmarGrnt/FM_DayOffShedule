import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class GradeService {
  private apiUrl = 'https://localhost:7130/api/Grade'; 

  constructor(private http: HttpClient) {}

  getGrades(): Observable<{ id: number, name: string }[]> {
    return this.http.get<{ $id: string, $values: { id: number, name: string }[] }>(this.apiUrl).pipe(
      map(response => response.$values)  // Gebruik alleen het $values deel van de response
    );
  }
}
