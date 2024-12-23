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
  allWorkdays: { date: string; shiftType: string }[] = []; 
  filteredWorkdays: string[] = [];
  teamId: number = 1; // Specifiek team ID
  year: number = 2025; // Specifiek jaar
  currentMonth: number =0; 
  viewMode: 'month' | 'quarter' = 'month'; // Weergaveoptie: maand of kwartaal
console: any;


  
  constructor(private teamService: TeamService, private personService: PersonService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
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
    

      this.filterWorkdays();
      this.loadPersonsWithDayOffs();
    
    });
  }

  filterWorkdays(): void {
    const startDate = new Date(Date.UTC(this.year, this.currentMonth, 1)); // Eerste dag van de maand
    const endDate = new Date(Date.UTC(this.year, this.currentMonth + 1, 0)); // Laatste dag van de maand

    

    if (this.viewMode === 'month') {
      endDate  // Laatste dag van de maand
    } else {
      const quarterStartMonth = Math.floor(this.currentMonth / 3) * 3;
      startDate.setMonth(quarterStartMonth);
      endDate
    }

    this.filteredWorkdays = this.allWorkdays
  .filter((workday) => {
    const workdayDate = new Date(workday.date);
    const isInRange = workdayDate >= startDate && workdayDate <= endDate;
    console.log(`Workday: ${workday.date}, In Range: ${isInRange}`);
    return isInRange;
  })
  .map((workday) => {
    console.log('Mapping workday:', workday.date);
    return workday.date;
  });
// console.log('Filtered Workdays:', this.filteredWorkdays);
// console.log('StartDate:', startDate.toISOString());
// console.log('EndDate:', endDate.toISOString());

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
    console.log('Navigated to month:', this.currentMonth, 'Year:', this.year);
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
      //console.log('DataSource after processing:', this.dataSource.data); // Controleer de volledige inhoud

        // Roep markConsecutiveDays aan voor elke rij
      // this.dataSource.data.forEach((row) => {
      //   row['consecutiveDays'] = this.markConsecutiveDays(row.id);
      // });

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
    //console.log(this.dataSource.data.filter(r => r.id === personId))
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
     // console.log("Selected Days :"+ selectedDays.flatMap)
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
      // Wissel tussen "V" en ""
      row[date] = row[date] === 'V' ? '' : 'V';
  
      // Update consecutiveDays opnieuw na de wijziging
      //row['consecutiveDays'] = this.markConsecutiveDays(personId);
  
      // Maak een API-aanroep om de wijziging op te slaan
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
  
  // markConsecutiveDays(personId: number): Record<string, string> {
  //   //console.log(`markConsecutiveDays called for person ID: ${personId}`);
  //   //console.log('Available rows in dataSource:', this.dataSource.data);
  
  //   const row = this.dataSource.data.find((r) => r.id === personId);
  
  //   if (!row) {
  //     console.error(`No row found for person ID ${personId}`);
  //     return {};
  //   }
  
  //   //console.log(`Row for person ID ${personId}:`, row);
  
  //   const consecutiveDays: Record<string, string> = {};
  //   let count = 0;
  
  //   this.filteredWorkdays.forEach((day, index) => {
  //     //console.log(`Checking day ${day} for person ID ${personId}: ${row[day]}`);
  //     if (row[day] === 'V') {
  //       count++;
  //     } else {
  //       if (count >= 4) {
  //         //console.log(`Sequence detected: ${count} days`);
  //         this.assignColors(consecutiveDays, this.filteredWorkdays.slice(index - count, index), count);
  //       }
  //       count = 0;
  //     }
  //   });
  
  //   if (count >= 4) {
  //     //console.log(`Final sequence detected: ${count} days`);
  //     this.assignColors(consecutiveDays, this.filteredWorkdays.slice(-count), count);
  //   }
  
  //   //console.log(`Consecutive days for person ID ${personId}:`, consecutiveDays);
  //   return consecutiveDays;
  // }
  
  
  // assignColors(consecutiveDays: Record<string, string>, days: string[], count: number): void {
  //   const color =
  //     count == 8
  //       ? 'light-red'
  //       : count == 6
  //       ? 'light-yellow'
  //       : count ==4
  //       ? 'light-green'
  //       : '';
  //   //console.log(`Assigning color ${color} to days:`, days);
  //   days.forEach((day) => {
  //     consecutiveDays[day] = color;
  //   });
  // }
  
  
  
 
  
}