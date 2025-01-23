import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TeamService } from '../../services/team.service';
import { TeamSelectionService } from '../../services/Shared/team-selection.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { PersonDayOffDTO, PersonService } from '../../services/person.service';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-person-dayoff-input',
  templateUrl: './person-dayoff-input.component.html',
  styleUrls: ['./person-dayoff-input.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
  ]
})
export class PersonDayoffInputComponent implements OnInit, OnDestroy {
  teamName: string = '';
  months: { shifts: { date: string, shiftType: string, shiftNumber: number, month: string }[] }[] = [];
  currentYear: number =0;
  displayedShiftNumbers: number[] = [];
  teamYearForm: FormGroup;
  private subscription?: Subscription;
  private teamId?: number;
  isMobile: boolean = false;
  selectedDates: string[] = [];
  authService = inject(AuthService);
  selectedCount: number = 0;
  personDetails: any;

  constructor(
    private teamService: TeamService,
    private teamSelectionService: TeamSelectionService,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private personService: PersonService,
    private adminService: AdminService  
  ) {
    this.teamYearForm = this.fb.group({
      year: [this.currentYear]
    });
  }

async ngOnInit(): Promise<void>{
 this.adminService.getDayOffYear().subscribe((response) => { this.currentYear = response.year; }); 
    this.breakpointObserver.observe([Breakpoints.Handset])
      .subscribe(result => {
        this.isMobile = result.matches;
      });

      const auth0Id = this.authService.getAuth0Id(); // Haal Auth0Id op
    if (!auth0Id) {
      console.error('Geen Auth0Id gevonden.');
      return;
    }
    this.personDetails = await this.personService.getPersonByAuth0Id(auth0Id);
    if (this.personDetails && this.personDetails.id) {
      //console.log('Persoon ID uit Auth0Id:', this.personDetails.id);

      if (this.personDetails.id) {
        this.loadPersonDayOffs(this.personDetails.id);
      }

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
    this.selectedCount = this.selectedDates.length;
  }
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
    });
  }

  loadPersonDayOffs(personId: number): void {
    this.personService.getPersonByIdDayOffs(personId).subscribe(
      (response: { $values: PersonDayOffDTO[] }) => {
        const dayOffs = response.$values; // Haal de array uit $values
        //console.log('Ophalen van vrije dagen gelukt:', dayOffs); // Debug log
        dayOffs.forEach(dayOff => {
          this.onDateSelected(dayOff.dayOffDate); // Selecteer de datums
       
        });
      },
      (error) => {
        console.error('Fout bij ophalen van vrije dagen:', error);
      }
    );
  }
  
  
  getShiftByNumber(shifts: { shiftNumber: number; date: string; shiftType: string; month: string }[], shiftNumber: number) {
    return shifts.find(shift => shift.shiftNumber === shiftNumber);
  }

  isDateSelected(date: string): boolean {
    return this.selectedDates.includes(date);

  }

  onDateSelected(date: string): void {
    if (this.isDateSelected(date)) {
      this.selectedDates = this.selectedDates.filter(d => d !== date);
    } else {
      this.selectedDates.push(date);
      //console.log(date)
    }
    this.selectedCount = this.selectedDates.length;
  //  this.saveSelectedDates();
  }
 
selectedYearDatesCount (date: string):void{

}

  saveSelectedDates(): void {
    const personId = this.personDetails.id; 
    if (!personId) {
      console.error('User ID is not available.');
      return;
    }
  
    // Maak een lijst van alle geselecteerde datums als PersonDayOffDTO
    const dayOffs: PersonDayOffDTO[] = this.selectedDates.map(date => ({
      personId,
      dayOffDate: date
    }));
  
    // Roep de updateDayOffs methode aan met de volledige lijst
    this.personService.updatePersonByIdDayOffs(personId,dayOffs).subscribe(
      (responses) => {
        alert('Alle verlofdagen succesvol opgeslagen!');
        console.log('Succesvolle responses:', responses);
      },
      (error) => {
        alert('Er is een fout opgetreden bij het opslaan van de verlofdagen.');
        console.error('Error responses:', error);
      }
    );
    

  }
  
}
