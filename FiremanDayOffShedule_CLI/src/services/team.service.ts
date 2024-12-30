import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Team } from '../interfaces/team.model';
import { WorkDays } from '../interfaces/team.model';
import { Shift } from '../interfaces/team.model';
import { TransformedWorkDays } from '../interfaces/team.model';
@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'https://localhost:7130/api/Team';
  private selectedYear: number | null = null;
  constructor(private http: HttpClient) {}

  getTeams(): Observable<{ id: number; name: string }[]> {
    console.log(
      'getTeams',
      this.http.get<{ $id: string; $values: { id: number; name: string }[] }>(
        this.apiUrl
      )
    );
    return this.http
      .get<{ $id: string; $values: { id: number; name: string }[] }>(
        this.apiUrl
      )
      .pipe(
        map((response) => response.$values) // Gebruik alleen het $values deel van de response
      );
  }

  // Methode om een specifiek team op te halen met zijn ID
  getTeamById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  // // Methode om werkdagen van een team voor een specifiek jaar op te halen
  // getWorkDaysForYear(
  //   id: number,
  //   year: number
  // ): Observable<TransformedWorkDays> {
  //   return this.http
  //     .get<WorkDays>(`${this.apiUrl}/workdays/${id}/${year}`)
  //     .pipe(
  //       map((data) => ({
  //         shifts: data.shifts.$values.map((shift) => ({
  //           date: shift.date,
  //           shiftType: shift.shiftType,
  //           shiftNumber: shift.shiftNumber,
  //           month: shift.month,
  //         })),
  //       }))
  //     );
  // }

  // Methode om werkdagen van een team voor een specifiek jaar op te halen
getWorkDaysForYear(
  id: number,
  year: number
): Observable<TransformedWorkDays> {
  return this.http
    .get<WorkDays>(`${this.apiUrl}/workdays/${id}/${year}`)
    .pipe(
      tap((data) => {
        // Log de originele data die je van de API ontvangt
       // console.log('Originele API-data:', data);
      }),
      map((data) => ({
        shifts: data.shifts.$values.map((shift) => ({
          date: shift.date,
          shiftType: shift.shiftType,
          shiftNumber: shift.shiftNumber,
          month: shift.month,
        })),
      })),
      tap((transformedData) => {
        // Log de getransformeerde data
       // console.log('Getransformeerde data:', transformedData);
      })
    );
}



}
