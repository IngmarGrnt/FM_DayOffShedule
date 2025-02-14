import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { PersonService } from '../../../services/person.service';
import { RoleService } from '../../../services/role.service';
import { GradeService } from '../../../services/grade.service';
import { SpecialityService } from '../../../services/speciality.service';
import { TeamService } from '../../../services/team.service';
import { DayoffstartService } from '../../../services/dayoffstart.service';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogComponent } from '../../dialogs/message-dialog/message-dialog.component';

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css'],
})
export class PersonDetailsComponent implements OnInit {
  personId: number | null = null;
  roles: { id: number; name: string }[] = [];
  grades: { id: number; name: string }[] = [];
  specialities: { id: number; name: string }[] = [];
  teams: { id: number; name: string }[] = [];
  dayOffstarts: { id: number; dayOffBase: string }[] = [];

  route: ActivatedRoute = inject(ActivatedRoute);
  personService = inject(PersonService);
  personDetailsForm: FormGroup;
  isNewPerson: boolean = true;
  errorMessage: string = '';
  Auth0Id: string | null = null;  
  role: string | null = null; 
  Password: string | null = null; 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private gradeService: GradeService,
    private specialityService: SpecialityService,
    private teamService: TeamService,
    private dayOffStartService: DayoffstartService,
    private dialog: MatDialog
    
  ) {
    this.personDetailsForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailAdress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      teamId: [null, Validators.required],
      roleId: [null, Validators.required],
      gradeId: [null, Validators.required],
      specialityId: [null, Validators.required],
      dayOffStartId: [null, Validators.required],
      password: [
        { value: null, disabled: true },
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id && !isNaN(+id)) {
        this.personId = +id;
        this.isNewPerson = false;
        this.loadPersonDetails(this.personId);
      } else {
        this.isNewPerson = true;
        console.warn('Ongeldige of ontbrekende ID, nieuwe persoon wordt aangemaakt.');
      }
    });

    this.loadDropdownData();
    this.setupEmailAutoFill();
  }

  private loadDropdownData(): void {
    this.roleService.getRoles().subscribe({
      next: (roles) => (this.roles = roles),
      error: (err) => console.error('Fout bij het ophalen van rollen:', err),
    });

    this.gradeService.getGrades().subscribe({
      next: (grades) => (this.grades = grades),
      error: (err) => console.error('Fout bij het ophalen van graden:', err),
    });

    this.specialityService.getSpecialities().subscribe({
      next: (specialities) => (this.specialities = specialities),
      error: (err) => console.error('Fout bij het ophalen van specialiteiten:', err),
    });

    this.teamService.getTeams().subscribe({
      next: (teams) => (this.teams = teams),
      error: (err) => console.error('Fout bij het ophalen van teams:', err),
    });

    this.dayOffStartService.getDayOffStart().subscribe({
      next: (dayOffstarts) => (this.dayOffstarts = dayOffstarts),
      error: (err) => console.error('Fout bij het ophalen van dagstarts:', err),
    });
  }

  private setupEmailAutoFill(): void {
    const lastNameControl = this.personDetailsForm.get('lastName');
    const firstNameControl = this.personDetailsForm.get('firstName');
    const emailAdressControl = this.personDetailsForm.get('emailAdress');
  
    if (lastNameControl && firstNameControl && emailAdressControl) {
      this.personDetailsForm.valueChanges.subscribe(() => {
        let lastName = lastNameControl.value?.trim().toLowerCase() || '';
        let firstName = firstNameControl.value?.trim().toLowerCase() || '';
  
        // Normaliseren van de namen door spaties en '-' te vervangen
        lastName = lastName.replace(/[\s-]/g, '');
        firstName = firstName.replace(/[\s-]/g, '');
  
        if (lastName && firstName) {
          const email = `${firstName}.${lastName}@bwzc.be`;
          emailAdressControl.setValue(email, { emitEvent: false });
        }
      });
    }
  }
  

  private loadPersonDetails(id: number): void {
    this.personService.getPersonById(id).then((personDetails) => {
      if (personDetails) {
        this.personDetailsForm.patchValue({
          firstName: personDetails.firstName,
          lastName: personDetails.lastName,
          emailAdress: personDetails.emailAdress,
          phoneNumber: personDetails.phoneNumber,
          gradeId: personDetails.grade?.id,
          roleId: personDetails.role?.id,
          specialityId: personDetails.speciality?.id,
          teamId: personDetails.team?.id,
          dayOffStartId: personDetails.dayOffStart?.id,
        });
      }
    });
  }

  get f() {
    return this.personDetailsForm.controls;
  }

  onSubmit(): void {
    if (this.personDetailsForm.valid) {
      const formData = {
        id: this.personId,
        ...this.personDetailsForm.value,
        teamId: Number(this.personDetailsForm.value.teamId),
        roleId: Number(this.personDetailsForm.value.roleId),
        gradeId: Number(this.personDetailsForm.value.gradeId),
        specialityId: Number(this.personDetailsForm.value.specialityId),
        dayOffStartId: Number(this.personDetailsForm.value.dayOffStartId),
        password: String (this.generateDefaultPassword()),
      };
      //console.log('Verzendgegevens:', formData);
      this.Password = formData.password;
      //console.log('this.Paswoord:', this.Password);
      if (this.isNewPerson) {
        this.personService.createPerson(formData).subscribe((newPerson) => {
          //console.log('Nieuwe persoon:', formData.Password);
          this.openDialog(`Nieuw persoon succesvol aangemaakt. Het wachtwoord is: ${this.Password}`)
          //alert(`Nieuw persoon succesvol aangemaakt. Het wachtwoord is: ${this.Password}`);
          this.router.navigate(['/persons']);
        });
      } else {
        this.personService.updatePerson(this.personId!, formData).subscribe(() => {
          this.router.navigate(['/persons']);
        });
      }
    } else {
      console.log('Formulier is ongeldig', this.personDetailsForm.errors);
    }
  }

  onDelete(): void {
    const confirmDelete = confirm('Weet je zeker dat je deze persoon wilt verwijderen?');
    if (confirmDelete) {
      this.personService.deletePerson(this.personId!).subscribe({
        next: () => {
          //console.log("persoon verwijderd")
          this.router.navigate(['/persons']);
        },
        error: (err) => {
          console.error('Fout bij verwijderen van de persoon:', err);
        },
      });
    }
  }

  generateDefaultPassword(): string {
    const lastName = this.personDetailsForm.get('lastName')?.value || '';
    const specialityId = this.personDetailsForm.get('specialityId')?.value;
    const specialityName = this.specialities.find((s) => s.id === specialityId)?.name || '';
    const currentYear = new Date().getFullYear();
    //console.log('Password:', `${lastName}_${specialityName}_${currentYear}*`);
    return lastName && specialityName
      ? `${lastName}_${specialityName}_${currentYear}*`
      : 'defaultPassword123';
  }
  
  resetPassword() {
    if (this.personDetailsForm.valid) {
      const formData = {
        id: this.personId,
        ...this.personDetailsForm.value,
      };
      console.log('email:', formData.emailAdress);  
    if (formData.emailAdress==null || formData.emailAdress=='') {
      this.errorMessage = 'Het emailadress is ongeldig';
      return;
    }
    this.personService.resetPassword(formData.emailAdress).subscribe({
      next: (response: any) => {
        this.openDialog(response.message);
      },
      error: (error) => {
        console.error('Fout bij het aanvragen van wachtwoordreset:', error);
        this.errorMessage = 'Er is een fout opgetreden. Probeer het opnieuw.';
      },
    });
  }

  

}
  private openDialog(message: string): void {
    this.dialog.open(MessageDialogComponent, {
      width: '400px',
      data: { message },
    });
  }
  
}
