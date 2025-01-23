import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = environment.apiUrl + '/api/admin';

  constructor(private http: HttpClient) {}

  getDayOffYear(): Observable<{ year: number }> {
    return this.http.get<{ year: number }>(`${this.apiUrl}/year`);
  }
  

}
