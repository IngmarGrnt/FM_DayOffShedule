import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../../services/team.service';
import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-team-calender',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule],
  templateUrl: './team-calender.component.html',
  styleUrls: ['./team-calender.component.css']
})
export class TeamCalendarComponent implements OnInit {
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>([]);
  allWorkdays: string[] = [];
  teamId: number = 1; // Specifiek team ID
  year: number = 2025; // Specifiek jaar

  constructor(private teamService: TeamService, private personService: PersonService) {}

  ngOnInit(): void {
    this.teamService.getWorkDaysForYear(this.teamId, this.year).subscribe((workdays) => {
      this.allWorkdays = workdays.shifts.map((shift) => shift.date.split('T')[0]);
      this.displayedColumns = ['name', ...this.allWorkdays];
      this.loadPersonsWithDayOffs();
    });
  }

  async loadPersonsWithDayOffs() {
    try {
      const persons = await this.personService.getAllPersons();
      const enrichedPersons = await Promise.all(
        persons.map(async (person) => {
          const dayOffsResponse = await this.personService.getDayOffs(person.id).toPromise();
          const dayOffs = dayOffsResponse?.$values.map((day) => new Date(day.dayOffDate).toISOString().split('d')[0]) || [];
          console.log(dayOffs)
          return {
            name: `${person.firstName} ${person.lastName}`,
            dayOffs,
          };
        })
      );

      const calendarData = enrichedPersons.map((person) => {
        const row: Record<string, string> = { name: person.name };
        this.allWorkdays.forEach((day) => {
          row[day] = person.dayOffs.includes(day) ? 'V' : '';
        });
        return row;
      });

      this.dataSource.data = calendarData;
    } catch (error) {
      console.error('Error loading persons or day-offs:', error);
    }
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }
}