import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy,inject } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TeamSelectionService } from '../../services/Shared/team-selection.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PersonDayOffDTO , PersonService} from '../../services/person.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-person-dayoff-input',
  templateUrl: './person-dayoff-input.component.html',
  styleUrls: ['./person-dayoff-input.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule
  ]
})
export class PersonDayoffInputComponent implements OnInit, OnDestroy {
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
  isMobile: boolean = false;
  selectedDates: string[] = []; // Array om geselecteerde datums bij te houden
  authService = inject(AuthService);
  constructor(
    private teamService: TeamService,
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private personService: PersonService

  ) {
    this.teamYearForm = this.fb.group({
      year: [this.currentYear]
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        const previousIsMobile = this.isMobile;
        this.isMobile = result.matches;
        if (previousIsMobile !== this.isMobile) {
          // Retain the selected dates when switching between mobile and desktop
          this.selectedDates = [...this.selectedDates];
        }
      });

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

  onDateSelected(date: string): void {
    console.log('Datum geselecteerd:', date); // Debuggen of dit wordt aangeroepen
    if (this.selectedDates.includes(date)) {
      this.selectedDates = this.selectedDates.filter(d => d !== date);
    } else {
      this.selectedDates.push(date);
    }
  }
  
  // isDateSelected(date: string): boolean {
  //   return this.selectedDates.includes(date);
  // }
  isDateSelected(date: string): boolean {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Converteer naar 'YYYY-MM-DD' formaat
    return this.selectedDates.some(selectedDate => {
      const selectedFormattedDate = new Date(selectedDate).toISOString().split('T')[0];
      return formattedDate === selectedFormattedDate;
    });
  }

  saveSelectedDates(): void {
    const personIdService = this.authService.getUserId();
    
    if (personIdService === null) {
      console.error('Gebruikers-ID is niet beschikbaar.');
      return; 
    }
  
    this.selectedDates.forEach(date => {
      const dayOff: PersonDayOffDTO = {
        personId: personIdService,
        dayOffDate: date,
      };
  
      this.personService.addDayOff(dayOff).subscribe(
        response => {
          console.log('Datum succesvol opgeslagen:', response);
        },
        error => {
          console.error('Fout bij opslaan van datum:', error);
        }
      );
    });
  }
  loadPersonDayOffs(personId: number): void {
    this.personService.getDayOffs(personId).subscribe(
      (dayOffs) => {
        this.selectedDates = dayOffs.map(dayOff => dayOff.dayOffDate);
        console.log('Opgehaalde vrije dagen:', this.selectedDates); // Log om te controleren of de datums goed worden opgehaald
      },
      (error) => {
        console.error('Fout bij het ophalen van vrije dagen:', error);
      }
    );
  }

  }
  
