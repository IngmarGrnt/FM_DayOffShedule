import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { TeamSelectionService } from '../../../services/Shared/team-selection.service';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
@Component({
  selector: 'app-year-calender',
  templateUrl: './year-calender.component.html',
  styleUrls: ['./year-calender.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule
  ]
})
export class YearCalenderComponent implements OnInit, OnDestroy {
  teamName: string = '';
  months: { name: string, shifts: { date: string, shiftType: string }[] }[] = [
    { name: 'Jan', shifts: [] },
    { name: 'Feb', shifts: [] },
    { name: 'Maa', shifts: [] },
    { name: 'Apr', shifts: [] },
    { name: 'Mei', shifts: [] },
    { name: 'Jun', shifts: [] },
    { name: 'Jul', shifts: [] },
    { name: 'Aug', shifts: [] },
    { name: 'Sep', shifts: [] },
    { name: 'Okt', shifts: [] },
    { name: 'Nov', shifts: [] },
    { name: 'Dec', shifts: [] },
  ];
  currentYear: number = new Date().getFullYear();
  displayedColumns: string[] = ['month'];
  teamYearForm: FormGroup;
  private subscription?: Subscription;
  private teamId?: number;

  constructor(
    private teamService: TeamService,
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder
  ) {
    this.teamYearForm = this.fb.group({
      year: [this.currentYear]
    });
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.subscription = this.teamSelectionService.selectedTeamId$.subscribe(
      (teamId) => {
        if (this.teamId !== teamId) {
          this.teamId = teamId;
          this.teamService.getTeamById(teamId).subscribe((team) => {
            this.teamName = team.name;
          });
          this.loadWorkDaysForYear(teamId, this.currentYear);
        }
      }
    );

    this.teamYearForm.get('year')?.valueChanges.subscribe((year) => {
      if (year !== this.currentYear) {
        this.currentYear = year;
        if (this.teamId) {
          this.loadWorkDaysForYear(this.teamId, year);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadWorkDaysForYear(teamId: number, year: number): void {
    this.teamService.getWorkDaysForYear(teamId, year).subscribe((data) => {
      this.months.forEach(month => {
        month.shifts = data.shifts.filter((shift: { date: string, shiftType: string }) => this.getMonthFromDate(shift.date) === month.name);
      });
      this.updateDisplayedColumns();
    });
  }

  getMonthFromDate(dateString: string): string {
    const date = new Date(dateString);
    return this.months[date.getMonth()].name;
  }

  getMaxShiftIndices(): number[] {
    const maxShifts = Math.max(...this.months.map(month => month.shifts.length));
    return Array.from({ length: maxShifts }, (_, i) => i);
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = ['month'];
    this.displayedColumns.push(...this.getMaxShiftIndices().flatMap((_, index) => [`shift${index}`]));
  }
}


