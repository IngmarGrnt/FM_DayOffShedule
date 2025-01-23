import { Injectable } from '@angular/core';
import { PersonDetails } from '../interfaces/person.model';
import { HttpClient } from '@angular/common/http';
import { promises } from 'dns';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = environment.apiUrl + '/api/Person';

  constructor(private http: HttpClient) {}

  async getAllPersons(): Promise<PersonDetails[]> {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();

      if (data && data.$values) {
        return data.$values;
      } else {
        console.error('Ongeldig data formaat', data);
        return [];
      }
    } catch (error) {
      console.error('Fout bij het ophalen van person details', error);
      return [];
    }
  }

  async getPersonById(id: Number): Promise<PersonDetails | undefined> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`);

      if (!response.ok) {
        throw new Error(
          `Fout bij het ophalen van persoon met ID: ${id}, status: ${response.statusText}`
        );
      }

      const data = await response.json();

      return data ?? undefined;
    } catch (error) {
      console.error(`Fout bij het ophalen van persoon met ID: ${id}`, error);
      return undefined;
    }
  }

  async getPersonByAuth0Id(
    auth0Id: string
  ): Promise<PersonDetails | undefined> {
    try {
      // Constructeer de URL met een correct geëncodeerde queryparameter
      const response = await fetch(
        `${this.apiUrl}/Auth0Id?Auth0Id=${encodeURIComponent(auth0Id)}`
      );

      if (!response.ok) {
        throw new Error(
          `Fout bij het ophalen van persoon met Auth0ID: ${auth0Id}, status: ${response.statusText}`
        );
      }

      const data = await response.json();

      return data ?? undefined;
    } catch (error) {
      console.error(
        `Fout bij het ophalen van persoon met ID: ${auth0Id}`,
        error
      );
      return undefined;
    }
  }

  updatePerson(id: number, person: PersonDetails): Observable<PersonDetails> {
    return this.http.put<PersonDetails>(`${this.apiUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createPerson(person: PersonDetails): Observable<PersonDetails> {
    console.log('Sending JSON:', person); // Voor het versturen loggen
    return this.http.post<PersonDetails>(this.apiUrl, person).pipe(
      tap((response) => {
        console.log('Response JSON:', response); // Na het ontvangen van een respons loggen
      })
    );
  }

  searchPersons(filters: {
    teamId: string | null;
    gradeId: string | null;
    specialityId: string | null;
  }): Observable<PersonDetails[]> {
    const params = new URLSearchParams();
    if (filters.teamId) params.set('teamId', String(filters.teamId));
    if (filters.gradeId) params.set('gradeId', String(filters.gradeId));
    if (filters.specialityId)
      params.set('specialityId', String(filters.specialityId));
    console.log('Filters verstuurd naar API:', filters);
    return this.http.get<PersonDetails[]>(
      `${this.apiUrl}/search?${params.toString()}`
    );
  }

  addDayOff(personDayOff: PersonDayOffDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/dayoff`, personDayOff);
  }

  updatePersonByIdDayOffs(
    personId: number,
    dayOffs: PersonDayOffDTO[]
  ): Observable<any> {
    console.log('Update personId: ' + personId);
    console.log('Update dayOffs: ' + dayOffs);
    return this.http.put(
      `${this.apiUrl}/dayoffs?personId=${personId}`,
      dayOffs
    );
  }

  getPersonByIdDayOffs(
    personId: number
  ): Observable<{ $values: PersonDayOffDTO[] }> {
    return this.http.get<{ $values: PersonDayOffDTO[] }>(
      `${this.apiUrl}/${personId}/dayoffs`
    );
  }

  // Methode om het wachtwoord te wijzigen
  changePassword(payload: {
    id: number;
    currentPassword: string;
    newPassword: string;
  }): Observable<PersonDetails[]> {
    const endpoint = `${this.apiUrl}/${payload.id}/password`;
    return this.http.post<PersonDetails[]>(endpoint, {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });
  }

  updatePassword(
    id: number,
    currentPassword: string,
    newPassword: string
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/password`, {
      id,
      currentPassword,
      newPassword,
    });
  }

  resetPassword(email: string): Observable<void> {
    console.log('Resetting password from service:', email);
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { email });
  }

  getPersonsWithDayOffs(speciality?: string, teamId?: number): Observable<PersonWithDayOffDTO[]> {
    let url = `${this.apiUrl}/with-dayoffs`;
  
    // Bouw de queryparameters dynamisch op
    const params: string[] = [];
    if (speciality) {
      params.push(`speciality=${encodeURIComponent(speciality)}`);
    }
    if (teamId) {
      params.push(`teamId=${teamId}`);
    }
    if (params.length) {
      url += `?${params.join('&')}`;
    }
  
    // Maak de HTTP-aanroep
    return this.http.get<PersonWithDayOffDTO[]>(url).pipe(
      tap((response) => console.log('Response van API:', response))
    );
  }
  

}
// De DTO die naar de backend gestuurd moet worden
export interface DayOffs {
  $id: string;
  $values: string[]; // Verlofdagen als array van strings
}

export interface BackendResponse {
  $id: string;
  $values: PersonWithDayOffDTO[];
}

export interface PersonWithDayOffDTO {
  id: number;
  name: string;
  specialityName: string;
  dayOffBase: number;
  dayOffCount: number;
  dayOffs: {
    $id: string;
    $values: string[];
  };
}
export interface PersonDayOffDTO {
  personId: number;
  dayOffDate: string; // Formaat: 'YYYY-MM-DD'
}



