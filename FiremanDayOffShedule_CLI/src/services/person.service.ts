import { Injectable } from '@angular/core';
import { PersonDetails} from '../interfaces/person.model';
import { HttpClient } from '@angular/common/http';
import { promises } from 'dns';
import { Observable,tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PersonService {

url='https://localhost:7130/api/Person';
//environments in Angular
  constructor(private http: HttpClient) { }


async getAllPersons(): Promise<PersonDetails[]> {
  try {
    const response = await fetch(this.url);
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
    const response = await fetch(`${this.url}/${id}`);

    if (!response.ok) {
      throw new Error(`Fout bij het ophalen van persoon met ID: ${id}, status: ${response.statusText}`);
    }

    const data = await response.json();

    return data ?? undefined;
  } catch (error) {

    console.error(`Fout bij het ophalen van persoon met ID: ${id}`, error);
    return undefined;
  }
}

updatePerson(id: number, person: PersonDetails): Observable<PersonDetails> {
  return this.http.put<PersonDetails>(`${this.url}/${id}`, person);
}

deletePerson(id: number): Observable<void> {
  return this.http.delete<void>(`${this.url}/${id}`);
}

createPerson(person: PersonDetails): Observable<PersonDetails> {
  console.log('Sending JSON:', person); // Voor het versturen loggen
  return this.http.post<PersonDetails>(this.url, person).pipe(
    tap((response) => {
      console.log('Response JSON:', response); // Na het ontvangen van een respons loggen
    })
  );
}


searchPersons(filters: { teamId: string | null, gradeId: string | null, specialityId: string | null }): Observable<PersonDetails[]> {
  const params = new URLSearchParams();
  if (filters.teamId) params.set('teamId', String(filters.teamId));
  if (filters.gradeId) params.set('gradeId', String(filters.gradeId));
  if (filters.specialityId) params.set('specialityId', String(filters.specialityId));
  console.log('Filters verstuurd naar API:', filters);
  return this.http.get<PersonDetails[]>(`${this.url}/search?${params.toString()}`);
}

 // Voeg een methode toe voor het toevoegen van een dag vrij
 addDayOff(personDayOff: PersonDayOffDTO): Observable<any> {
  return this.http.post(`${this.url}/dayoff`, personDayOff);
}

getDayOffs(personId: number): Observable<PersonDayOffDTO[]> {
  return this.http.get<PersonDayOffDTO[]>(`${this.url}/${personId}/dayoffs`);
}

// Methode om het wachtwoord te wijzigen
changePassword(payload: { id: number; currentPassword: string; newPassword: string }): Observable<PersonDetails[]> {
  const endpoint = `${this.url}/${payload.id}/password`;
  return this.http.post<PersonDetails[]>(endpoint, {
    currentPassword: payload.currentPassword,
    newPassword: payload.newPassword,
  });
}

updatePassword(id: number, currentPassword: string, newPassword: string): Observable<void> {
  return this.http.put<void>(`${this.url}/${id}/password`, {
    id,
    currentPassword,
    newPassword
  });
}

}

// De DTO die naar de backend gestuurd moet worden
export interface PersonDayOffDTO {
personId: number;
dayOffDate: string; // Formaat: 'YYYY-MM-DD'
}


