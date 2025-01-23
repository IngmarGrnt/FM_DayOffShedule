import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamService } from '../../../services/team.service';
import { TeamSelectionService } from '../../../services/Shared/team-selection.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-year-calender',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule
  ],
  templateUrl: './year-calender.component.html',
  styleUrls: ['./year-calender.component.css'],


})
export class YearCalenderComponent implements OnInit, OnDestroy {
  teamName: string = '';
  months: { shifts: { date: string, shiftType: string, shiftNumber: number, month: string }[] }[] = [];
  currentYear: number = 0;
  teamYearForm: FormGroup;
  displayedShiftNumbers: number[] = [];
  private subscription?: Subscription;
  private teamId?: number;
  isMobile: boolean = false;

  constructor(
    private teamService: TeamService,
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private adminService: AdminService  
  ) 
  
  {
  this.teamYearForm = this.fb.group({ year: [] });
  }

  ngOnInit(): void {

    this.adminService.getDayOffYear().subscribe((response) => {
      this.currentYear = response.year;

      this.teamYearForm.patchValue({ year: this.currentYear });
  
      this.subscription = this.teamSelectionService.selectedTeamId$.subscribe(
        (teamId) => {
          if (this.teamId !== teamId) {
            this.teamId = teamId;
  
       
            this.teamService.getTeamById(teamId).subscribe((team) => {
              this.teamName = team.name;
  
    
              this.loadWorkDaysForYear(teamId, this.currentYear);
            });
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
    });
  
    // BreakpointObserver om mobiele apparaten te detecteren
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  
    // Initialiseer andere waarden
    this.months = [];
    this.displayedShiftNumbers = [];
  }
  

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadWorkDaysForYear(teamId: number, year: number): void {
    this.teamService.getWorkDaysForYear(teamId, year).subscribe((data) => {
      const shiftNumbers = new Set<number>();
  
      this.months = data.shifts.reduce((acc: { shifts: { date: string, shiftType: string, shiftNumber: number, month: string }[] }[], shift) => {
        let monthEntry = acc.find(entry => entry.shifts[0]?.month === shift.month);
        if (!monthEntry) {
          monthEntry = { shifts: [] };
          acc.push(monthEntry);
        }
        monthEntry.shifts.push(shift);
        shiftNumbers.add(shift.shiftNumber);
        return acc;
      }, []);

      this.displayedShiftNumbers = Array.from(shiftNumbers).sort((a, b) => a - b);
      console.log(this.months);
    });
  }
  getShiftByNumber(shifts: { shiftNumber: number; date: string; shiftType: string; month: string }[], shiftNumber: number) {
    console.log(shifts)
    return shifts.find(shift => shift.shiftNumber === shiftNumber);
    
  }
  
}