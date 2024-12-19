import { Component, OnInit } from '@angular/core';
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
  allWorkdays: string[] = [];
  filteredWorkdays: string[] = [];
  teamId: number = 1; // Specifiek team ID
  year: number = 2025; // Specifiek jaar
  currentMonth: number =0; 
  viewMode: 'month' | 'quarter' = 'month'; // Weergaveoptie: maand of kwartaal
console: any;


  
  constructor(private teamService: TeamService, private personService: PersonService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.teamService.getWorkDaysForYear(this.teamId, this.year).subscribe((workdays) => {
      this.allWorkdays = workdays.shifts.map((shift) => shift.date.split('T')[0]);
      this.filterWorkdays();
      this.loadPersonsWithDayOffs();
    });
  }

  filterWorkdays(): void {
    const startDate = new Date(this.year, this.currentMonth, 1);
    let endDate: Date;

    if (this.viewMode === 'month') {
      endDate = new Date(this.year, this.currentMonth + 1, 0); // Laatste dag van de maand
    } else {
      const quarterStartMonth = Math.floor(this.currentMonth / 3) * 3;
      startDate.setMonth(quarterStartMonth);
      endDate = new Date(this.year, quarterStartMonth + 3, 0); // Laatste dag van het kwartaal
    }

    this.filteredWorkdays = this.allWorkdays.filter((date) => {
      const workdayDate = new Date(date);
      return workdayDate >= startDate && workdayDate <= endDate;
    });

    this.displayedColumns = ['name', ...this.filteredWorkdays];
  }

  navigateMonth(offset: number): void {
    this.currentMonth += offset;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.year--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.year++;
    }
    this.filterWorkdays();
    this.loadPersonsWithDayOffs();
  }

  changeViewMode(mode: 'month' | 'quarter'): void {
    this.viewMode = mode;
    this.filterWorkdays();
    this.loadPersonsWithDayOffs();
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
      this.cdr.detectChanges();
      console.log('DataSource Data:', this.dataSource.data);

    } catch (error) {
      console.error('Error loading persons or day-offs:', error);
    }
  }
  
  

  getCurrentPeriod(): string {
    if (this.viewMode === 'month') {
      return new Date(this.year, this.currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
    } else {
      // Bereken het kwartaal op basis van de huidige maand
      const quarterIndex = Math.floor(this.currentMonth / 4);
      const startMonth = quarterIndex * 4; // Start van het kwartaal (0, 4, 8)
      const endMonth = startMonth + 3; // Eind van het kwartaal (3, 7, 11)
  
      const start = new Date(this.year, startMonth).toLocaleString('default', { month: 'short' });
      const end = new Date(this.year, endMonth).toLocaleString('default', { month: 'short', year: 'numeric' });
  
      return `${start} - ${end}`;
    }
    
  }
  
  updateDayOff(personId: number, date: string, value: string): void {
    // Update de lokale data (dataSource) met de gewijzigde waarde
    const row = this.dataSource.data.find(r => r.id === personId);
    if (row) {
      row[date] = value; // Update de geselecteerde dag
    }
  
    // Verzamelen van alle geselecteerde dagen
    console.log(this.dataSource.data.filter(r => r.id === personId))
    const selectedDays: PersonDayOffDTO[] = this.dataSource.data
    
      .filter(r => r.id === personId)
    
      .flatMap(r =>
        this.filteredWorkdays
          .filter(day => r[day] === 'V') // Alleen dagen met "V"
          .map(day => ({
            personId,
            dayOffDate: day
          }))
      );
      console.log("Selected Days :"+ selectedDays.flatMap)
    // Maak de API-aanroep om alle geselecteerde dagen op te slaan
    this.personService.updateDayOffs(personId, selectedDays).subscribe(
      response => {
        console.log('Alle verlofdagen succesvol opgeslagen:', response);
      },
      error => {
        console.error('Fout bij het opslaan van verlofdagen:', error);
      }
    );
  }
  

  
  toggleDayOff(personId: number, date: string): void {
    const row = this.dataSource.data.find((r) => r.id === personId);
    if (row) {
      row[date] = row[date] === 'V' ? '' : 'V';
      // console.log(`Toggled day off for person ${personId} on ${date} to ${row[date]}`);
      this.updateDayOff(personId, date, row[date]);
    }
  }
  
  getDayOffCount(day: string): number {
    const count = this.dataSource.data.filter(row => row[day] === 'V').length;
    // console.log(`Count for ${day}: ${count}`);
    return count;
  }
  
  getCounterClass(count: number): string {
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
  
}
