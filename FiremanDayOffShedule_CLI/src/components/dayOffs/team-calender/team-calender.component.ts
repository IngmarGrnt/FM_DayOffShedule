import { Component, Inject, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { TeamService } from '../../../services/team.service';
import {
  BackendResponse,
  PersonDayOffDTO,
  PersonService,
  PersonWithDayOffDTO,
} from '../../../services/person.service';
import { forkJoin, map, Observable } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { TeamSelectionService } from '../../../services/Shared/team-selection.service';
import { AuthService } from '../../../services/auth.service';
import { DayoffstartService } from '../../../services/dayoffstart.service';
import { AdminService } from '../../../services/admin.service';
import { PersonDetails } from '../../../interfaces/person.model';

@Component({
  selector: 'app-team-calender',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './team-calender.component.html',
  styleUrls: ['./team-calender.component.css'],
})
export class TeamCalendarComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  allWorkdays: { date: string; shiftType: string }[] = [];
  filteredWorkdays: string[] = [];
  teamId: number = 1;
  year: number = 0;
  currentMonth: number = 0;
  viewMode: 'month' | 'quarter' = 'month'; // Weergaveoptie: maand of kwartaal
  console: any;
  authService = inject(AuthService);
  role: string | null = null; 
  isUser: boolean = false;
  selectedDates: string[] = [];
  persons: any[] = [];
  dayOffBase: number = 0;

  constructor(
    private teamService: TeamService,
    private personService: PersonService,
    private cdr: ChangeDetectorRef,
    private teamSelectionService: TeamSelectionService,
    private adminService: AdminService
  ) {}
  ngOnInit(): void {
    this.fetchDayOffYear().subscribe({
      next: async (year: number) => {
        this.year = year; // Sla het jaar op
        console.log('YearOnInit:', this.year);

        const auth0Id = this.authService.getAuth0Id() || '';
        console.log('auth0Id:', auth0Id);
        const userRole = this.authService.getRole();
        this.isUser = await userRole === 'User';  

        // Haal de persoon op via Auth0Id
        const person = await this.personService.getPersonByAuth0Id(auth0Id);
        console.log('Person:', person);
        this.teamId = person?.team.id || 0; // Zorg dat teamId een fallback heeft
        console.log('teamId:', this.teamId);

        this.teamService
          .getWorkDaysForYear(this.teamId, this.year)
          .subscribe((workdays) => {
            this.allWorkdays = workdays.shifts.map((shift) => {
              const date = shift.date.split('T')[0];
              const shiftType = shift.shiftType;

              return { date, shiftType };
            });

            this.getWorkdays();
            this.loadPersonsWithDayOffs();
          });
      },
      error: (error) => {
        console.error('Error fetching year:', error);
      },
    });
  }

  getWorkdays(): void {
    // Alle werkdagen worden geladen, maar navigeren naar de huidige maand
    this.filteredWorkdays = this.allWorkdays.map((workday) => workday.date);

    // Stel de kolommen opnieuw in, inclusief de naamkolom
    this.displayedColumns = ['name', ...this.filteredWorkdays];
  }

  navigateMonth(offset: number, targetMonth?: number): void {
    const increment = this.viewMode === 'month' ? 1 : 4;

    if (targetMonth !== undefined) {
      // Navigeer naar een specifieke maand
      this.currentMonth = targetMonth % 12;
      this.year +=
        Math.floor(targetMonth / 12) - Math.floor(this.currentMonth / 12);
    } else {
      // Standaard navigatie (volgende of vorige maand)
      this.currentMonth += offset * increment;
      if (this.currentMonth < 0) {
        this.currentMonth += 12;
        this.year;
      } else if (this.currentMonth > 11) {
        this.currentMonth -= 12;
        this.year;
      }
    }

    this.getWorkdays();
    this.loadPersonsWithDayOffs();

    // Scroll naar de navigerende maand
    const container = document.querySelector('.calendar-scroll');
    if (container) {
      const targetDate = this.filteredWorkdays.find((date) => {
        const workdayDate = new Date(date);
        return (
          workdayDate.getMonth() === this.currentMonth &&
          workdayDate.getFullYear() === this.year
        );
      });

      if (targetDate) {
        // Bereken scrollpositie van de datum
        const index = this.filteredWorkdays.indexOf(targetDate);
        const scrollAmount = index * 68; // Kolombreedte in pixels (pas aan indien nodig)
        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }

  // async loadPersonsWithDayOffs() {
  //   try {
  //    this.persons = await this.personService.getAllPersons();
  //    let speciality = localStorage.getItem('speciality');

  //     this.persons = this.persons.filter(person => person.specialityName === speciality);
  //     const allPersons = await Promise.all(
  //       this.persons.map(async (person) => {
  //         const dayOffsResponse = await this.personService.getPersonByIdDayOffs(person.id).toPromise();

  //         const dayOffBaseResponse = await this.dayOffService.getDayOffStart().toPromise();
  //         //const dayOffBase = dayOffBaseResponse?.find(base => base.id === person.id)?.dayOffBase || null;
  //         const dayOffBase = dayOffBaseResponse?.find(base => base.id === person.id)?.dayOffBase || null
  //         const dayOffs = dayOffsResponse?.$values.map((day) => day.dayOffDate.split('T')[0]) || [];

  //         return {
  //           id: person.id,
  //           name: `${person.firstName} ${person.lastName}`,
  //           dayOffs,
  //           dayOffBase:dayOffBase
  //         };
  //       })
  //     );

  //     this.dataSource.data = this.generateCalendarData(allPersons);
  //   } catch (error) {
  //     console.error('Error loading persons or day-offs:', error);
  //   }
  // }

  async loadPersonsWithDayOffs() {
    try {
      const speciality = localStorage.getItem('speciality') || '';

      // Geef expliciet het type op voor de API-respons
      const response = (await this.personService
        .getPersonsWithDayOffs(speciality, this.teamId)
        .toPromise()) as unknown as BackendResponse;

      console.log('Response van API (persons):', response);

      if (!response || !response.$values) {
        console.error('Ongeldige API-respons:', response);
        return;
      }

      // Haal de array van personen uit $values
      this.persons = response.$values;

      console.log('Extracted persons array:', this.persons);

      // Transformeer de data
      const transformedPersons = this.persons.map((person) => ({
        id: person.id,
        name: person.name,
        specialityName: person.specialityName,
        dayOffBase: person.dayOffBase,
        dayOffCount: person.dayOffCount,
        dayOffs: person.dayOffs?.$values || [], // Extracteer dagafwezigheden
      }));

      console.log('Getransformeerde data:', transformedPersons);
      this.dataSource.data = this.generateCalendarData(transformedPersons);
    } catch (error) {
      console.error(
        'Fout bij het laden van personen met dagafwezigheden:',
        error
      );
    }
  }

  generateCalendarData(
    persons: {
      id: number;
      name: string;
      dayOffs: string[];
      dayOffBase: number;
    }[]
  ): any[] {
    return persons.map((person) => {
      const row: Record<string, any> = {
        id: person.id,
        name: person.name,
        dayOffBase: person.dayOffBase, // Voeg de dayOffBase toe aan de rij
      };
      this.filteredWorkdays.forEach((day: string) => {
        row[day] = person.dayOffs.includes(day) ? 'V' : '';
      });
      return row;
    });
  }

  getCurrentPeriod(): string {
    if (this.viewMode === 'month') {
      // Maandweergave: toon de naam van de maand en het jaar
      return new Date(this.year, this.currentMonth).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
    } else {
      // Periode van 4 maanden
      const fourMonthStartMonth = Math.floor(this.currentMonth / 4) * 4;
      const fourMonthEndMonth = fourMonthStartMonth + 3;

      // Haal maandnamen en jaar op
      const start = new Date(this.year, fourMonthStartMonth).toLocaleString(
        'default',
        {
          month: 'short',
        }
      );
      const end = new Date(this.year, fourMonthEndMonth).toLocaleString(
        'default',
        {
          month: 'short',
          year: 'numeric',
        }
      );

      // Combineer start- en eindperiode
      return `${start} - ${end}`;
    }
  }

  toggleDayOff(personId: number, date: string): void {
    if (this.isUser) {
      return;
    } else {
      const row = this.dataSource.data.find((r) => r.id === personId);
      if (row) {
        // Wissel tussen "V" en ""
        row[date] = row[date] === 'V' ? '' : 'V';
      }
    }
  }

  getDayOffCount(day: string): number {
    const count = this.dataSource.data.filter((row) => row[day] === 'V').length;
    return count;
  }

  getCounterClassDate(count: number): string {
    const personCount = this.persons.length;
    // Helperfunctie om af te ronden naar het eerstvolgende deelbare getal door 4
    const roundUpToNextMultipleOfFour = (num: number): number => {
      return Math.ceil(num / 4) * 4;
    };

    const personsDayOffAverage = roundUpToNextMultipleOfFour(personCount) / 4;

    if (count >= personsDayOffAverage + 1) {
      return 'red';
    } else if (count === personsDayOffAverage) {
      return 'green';
    } else if (count === personsDayOffAverage - 1) {
      return 'orange';
    } else {
      return '';
    }
  }

  getCounterClassPerson(count: number, personDayOffBase: number): string {
    if (count > personDayOffBase) {
      return 'red';
    } else if (count <= personDayOffBase - 1 && count >= personDayOffBase - 5) {
      return 'orange';
    } else if (count === personDayOffBase) {
      return 'green';
    } else {
      return '';
    }
  }

  getShiftTypeForDate(
    date: string
  ): { type: string; colorClass: string } | null {
    const workday = this.allWorkdays.find((workday) => workday.date === date);
    if (!workday) {
      return null;
    }

    const shiftType = workday.shiftType.toLowerCase();
    if (shiftType === 'day') {
      return { type: 'D', colorClass: 'day-shift' };
    } else if (shiftType === 'night') {
      return { type: 'N', colorClass: 'night-shift' };
    }
    return { type: '', colorClass: '' }; // Default voor onbekend type
  }

  getPersonDayOffCount(personId: number): number {
    const row = this.dataSource.data.find((r) => r.id === personId);
    if (!row) return 0;

    return this.filteredWorkdays.filter((day) => row[day] === 'V').length;
  }

  saveDayOff(): void {
    if (this.isUser) {
      alert('U heeft geen rechten om wijzigingen op te slaan.');
      return;
    }
    const saveRequests = this.dataSource.data
      .map((row) => {
        const personId = row.id;
        const selectedDays = this.filteredWorkdays
          .filter((day) => row[day] === 'V') // Alleen dagen met "V"
          .map((day) => ({
            personId,
            dayOffDate: day,
          }));

        // Alleen een API-aanroep doen als er dagen geselecteerd zijn
        if (selectedDays.length > 0) {
          return this.personService.updatePersonByIdDayOffs(
            personId,
            selectedDays
          );
        } else {
          return null;
        }
      })
      .filter((request) => request !== null); // Verwijder null waarden (geen geselecteerde dagen)

    if (saveRequests.length > 0) {
      // Wacht tot alle API-aanroepen voltooid zijn
      forkJoin(saveRequests).subscribe(
        (responses) => {
          alert('Alle verlofdagen succesvol opgeslagen!');
          console.log('Succesvolle responses:', responses);
        },
        (error) => {
          alert(
            'Er is een fout opgetreden bij het opslaan van de verlofdagen.'
          );
          console.error('Error responses:', error);
        }
      );
    } else {
      alert('Er zijn geen wijzigingen om op te slaan.');
    }
  }

  fetchDayOffYear(): Observable<number> {
    return this.adminService.getDayOffYear().pipe(
      map((response: { year: number }) => response.year) // Specificeer het type van 'response'
    );
  }
}
