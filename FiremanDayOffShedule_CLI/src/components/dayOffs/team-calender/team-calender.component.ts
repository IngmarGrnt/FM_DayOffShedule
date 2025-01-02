import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { TeamService } from '../../../services/team.service';
import { PersonDayOffDTO, PersonService } from '../../../services/person.service';
import { forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { TeamSelectionService } from '../../../services/Shared/team-selection.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-team-calender',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './team-calender.component.html',
  styleUrls: ['./team-calender.component.css']
})
export class TeamCalendarComponent implements OnInit {

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  allWorkdays: { date: string; shiftType: string }[] = []; 
  filteredWorkdays: string[] = [];
  teamId: number = 1; // Specifiek team ID
  year: number=2025; // Specifiek jaar
  currentMonth: number =0; 
  viewMode: 'month' | 'quarter' = 'month'; // Weergaveoptie: maand of kwartaal
console: any;
  authService = inject(AuthService);
  selectedDates: string[] = [];
  
  constructor(private teamService: TeamService, private personService: PersonService, private cdr: ChangeDetectorRef,private teamSelectionService: TeamSelectionService) {}

  ngOnInit(): void {

// Stel het jaar in vanuit de TeamSelectionService
// const selectedYear = this.teamSelectionService.getSelectedYear();
// this.year = selectedYear || new Date().getFullYear();


    this.teamService.getWorkDaysForYear(this.teamId, this.year).subscribe((workdays) => {
      // this.allWorkdays = workdays.shifts.map((shift) => ({
      //   date: new Date(shift.date).toISOString().split('T')[0],
      //   shiftType: shift.shiftType,
      // }));
      this.allWorkdays = workdays.shifts.map((shift) => {
        const date = shift.date.split('T')[0];
        const shiftType = shift.shiftType;
    
        // Log de datum
       // console.log(`Datum: ${date}, ShiftType: ${shiftType}`);
    
        return { date, shiftType };
      });
    

      this.getWorkdays();
      this.loadPersonsWithDayOffs();
    
    });
  }

  // getWorkdays(): void {
  //     let startDate = new Date(Date.UTC(this.year, this.currentMonth, 1));
  //     let endDate = new Date(Date.UTC(this.year, this.currentMonth + 12, 0)); // Laatste dag van de maand

  //   // Filter de werkdagen die binnen de range vallen
  //   this.filteredWorkdays = this.allWorkdays
  //     .filter((workday) => {
  //       const workdayDate = new Date(workday.date);
  //       const isInRange = workdayDate >= startDate && workdayDate <= endDate;
  //       console.log(`Workday: ${workday.date}, In Range: ${isInRange}`);
  //       return isInRange;
  //     })<
  //     .map((workday) => workday.date);
  //   this.displayedColumns = ['name', ...this.filteredWorkdays];
  // }
  getWorkdays(): void {
    // Alle werkdagen worden geladen, maar navigeren naar de huidige maand
    this.filteredWorkdays = this.allWorkdays.map(workday => workday.date);
  
    // Stel de kolommen opnieuw in, inclusief de naamkolom
    this.displayedColumns = ['name', ...this.filteredWorkdays];

  }
  

  navigateMonth(offset: number, targetMonth?: number): void {
    const increment = this.viewMode === 'month' ? 1 : 4;
  
    if (targetMonth !== undefined) {
      // Navigeer naar een specifieke maand
      this.currentMonth = targetMonth % 12;
      this.year += Math.floor(targetMonth / 12) - Math.floor(this.currentMonth / 12);
    } else {
      // Standaard navigatie (volgende of vorige maand)
      this.currentMonth += offset * increment;
      if (this.currentMonth < 0) {
        this.currentMonth += 12;
        this.year--;
      } else if (this.currentMonth > 11) {
        this.currentMonth -= 12;
        this.year++;
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
  
  
  async loadPersonsWithDayOffs() {
    try {
      const persons = await this.personService.getAllPersons();
      // console.log('All persons:', persons); // Log all persons
  
      const allPersons = await Promise.all(
        persons.map(async (person) => {
          const dayOffsResponse = await this.personService.getDayOffs(person.id).toPromise();
          // console.log('DayOffsResponse:', dayOffsResponse);
          const dayOffs = dayOffsResponse?.$values.map((day) => day.dayOffDate.split('T')[0]) || [];
          // console.log(`Person: ${person.firstName} ${person.lastName}, DayOffs:`, dayOffs); // Log per person
  
          return {
            id: person.id,
            name: `${person.firstName} ${person.lastName}`,
            dayOffs,
          };
        })
      );
  
      const calendarData = allPersons.map((person) => {
        const row: Record<string, any> = { id: person.id, name: person.name };
        this.filteredWorkdays.forEach((day) => {
          row[day] = person.dayOffs.some((offDay) => offDay === day) ? 'V' : '';
        });
        return row;
      });
  
      // console.log('Calendar data:', calendarData);
      this.dataSource.data = calendarData;
      //console.log('DataSource after processing:', this.dataSource.data); // Controleer de volledige inhoud

    } catch (error) {
      console.error('Error loading persons or day-offs:', error);
    }
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
      const start = new Date(this.year, fourMonthStartMonth).toLocaleString('default', {
        month: 'short',
      });
      const end = new Date(this.year, fourMonthEndMonth).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
  
      // Combineer start- en eindperiode
      return `${start} - ${end}`;
    }
  }
  
  toggleDayOff(personId: number, date: string): void {
    const row = this.dataSource.data.find((r) => r.id === personId);
    if (row) {
      // Wissel tussen "V" en ""
      row[date] = row[date] === 'V' ? '' : 'V';
  
    }
  }
  
  
  getDayOffCount(day: string): number {
    const count = this.dataSource.data.filter(row => row[day] === 'V').length;
    return count;
  }
  
  getCounterClassDate(count: number): string {
    if (count >= 7) {
      return 'red';
    } else if (count === 6) {
      return 'green';
    } else if (count === 5) {
      return 'orange';
    } else {
      return '';
    }
  }
  getCounterClassPerson(count: number): string {
    if (count > 46) {
      return 'red'; // Controleer of deze klasse bestaat in de CSS
    } else if (count <= 45 && count >= 40) {
      return 'orange'; // Controleer deze klasse ook
    } else if (count === 46) {
      return 'green'; // Controleer deze klasse
    } else {
      return ''; // Geen klasse
    }
  }
  

  getShiftTypeForDate(date: string): { type: string; colorClass: string } | null {
    const workday = this.allWorkdays.find(workday => workday.date === date);
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
    const saveRequests = this.dataSource.data.map((row) => {
      const personId = row.id;
      const selectedDays = this.filteredWorkdays
        .filter((day) => row[day] === 'V') // Alleen dagen met "V"
        .map((day) => ({
          personId,
          dayOffDate: day,
        }));
  
      // Alleen een API-aanroep doen als er dagen geselecteerd zijn
      if (selectedDays.length > 0) {
        return this.personService.updateDayOffs(personId, selectedDays);
      } else {
        return null;
      }
    }).filter((request) => request !== null); // Verwijder null waarden (geen geselecteerde dagen)
  
    if (saveRequests.length > 0) {
      // Wacht tot alle API-aanroepen voltooid zijn
      forkJoin(saveRequests).subscribe(
        (responses) => {
          alert('Alle verlofdagen succesvol opgeslagen!');
          console.log('Succesvolle responses:', responses);
        },
        (error) => {
          alert('Er is een fout opgetreden bij het opslaan van de verlofdagen.');
          console.error('Error responses:', error);
        }
      );
    } else {
      alert('Er zijn geen wijzigingen om op te slaan.');
    }
  }
  

}