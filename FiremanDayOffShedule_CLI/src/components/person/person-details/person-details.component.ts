import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-person-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MaterialModule],
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.css'],
})
export class PersonDetailsComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  personService = inject(PersonService);
  personDetailsForm: FormGroup;
  roles: { id: number; name: string }[] = [];
  grades: { id: number; name: string }[] = [];
  specialities: { id: number; name: string }[] = [];
  teams: { id: number; name: string }[] = [];
  isNewPerson: boolean = true;
  personId: number | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private roleService: RoleService,
    private gradeService: GradeService,
    private specialityService: SpecialityService,
    private teamService: TeamService,

  ) {
    this.personDetailsForm = this.fb.group({
      lastName: ['', Validators.required],
      firstName: ['', Validators.required],
      emailAdress: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      teamId: [null, Validators.required],
      roleId: [null, Validators.required],
      gradeId: [null, Validators.required],
      specialityId: [null, Validators.required],
    });
  }

  // ngOnInit(): void {
  //   const personDetailsId = Number(this.route.snapshot.params['id']);

  //   // Haal de dropdown waarden op via de respectieve services
  //   this.roleService.getRoles().subscribe((roles) => (this.roles = roles));
  //   console.log('Received roles:', this.roles);
  //   this.gradeService.getGrades().subscribe((grades) => (this.grades = grades));
  //   this.specialityService
  //     .getSpecialities()
  //     .subscribe((specialities) => (this.specialities = specialities));
  //   this.teamService.getTeams().subscribe((teams) => (this.teams = teams));
  //   this.personService.getPersonById(personDetailsId).then((personDetails) => {
  //     if (personDetails) {
  //       console.log('Person Details: ', personDetails);
  //       this.personDetailsForm.patchValue({
  //         lastName: personDetails.lastName,
  //         firstName: personDetails.firstName,
  //         emailAdress: personDetails.emailAdress,
  //         phoneNumber: personDetails.phoneNumber,
  //         gradeId: personDetails.grade?.id,
  //         roleId: personDetails.role?.id,
  //         specialityId: personDetails?.speciality.id,
  //         teamId: personDetails.team?.id,
  //       });
  //     }
  //   });
  // }

  ngOnInit(): void {
    // Controleer of er een ID in de route is
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.personId = +id; // Zet de id om naar een nummer
        this.isNewPerson = false; // We werken een bestaande persoon bij
        this.loadPersonDetails(this.personId);  // Haal de details op
      } else {
        this.isNewPerson = true; // Geen ID, we maken een nieuwe persoon aan
      }
    });
    // Haal de dropdown waarden op via de respectieve services
    this.loadDropdownData();
  }

  // Haal de dropdown waarden op
  private loadDropdownData(): void {
    this.roleService.getRoles().subscribe(roles => this.roles = roles);
    this.gradeService.getGrades().subscribe(grades => this.grades = grades);
    this.specialityService.getSpecialities().subscribe(specialities => this.specialities = specialities);
    this.teamService.getTeams().subscribe(teams => this.teams = teams);
  }
  // Haal de persoongegevens op voor bestaande personen
  private loadPersonDetails(id: number): void {
    this.personService.getPersonById(id).then(personDetails => {
      if (personDetails) {
        this.personDetailsForm.patchValue({
          lastName: personDetails.lastName,
          firstName: personDetails.firstName,
          emailAdress: personDetails.emailAdress,
          phoneNumber: personDetails.phoneNumber,
          gradeId: personDetails.grade?.id,
          roleId: personDetails.role?.id,
          specialityId: personDetails.speciality?.id,
          teamId: personDetails.team?.id
        });
      }
    });
  }

  get f() {
    return this.personDetailsForm.controls;
  }

  // onSubmit(): void {
  //   const personDetailsId = Number(this.route.snapshot.params['id']);

  //   if (this.personDetailsForm.valid) {
  //     const formData = {
  //       id: personDetailsId,
  //       ...this.personDetailsForm.value,
  //       //Zet string in numbers
  //       teamId: Number(this.personDetailsForm.value.teamId),
  //       roleId: Number(this.personDetailsForm.value.roleId),
  //       gradeId: Number(this.personDetailsForm.value.gradeId),
  //       specialityId: Number(this.personDetailsForm.value.specialityId),
  //     };

  //     console.log('Update persoon:', formData);

  //     this.personService
  //       .updatePerson(personDetailsId, formData)
  //       .subscribe((updatedPerson) => {
  //         console.log('Persoon succesvol bijgewerkt', updatedPerson);
  //         alert('Persoon succesvol bijgewerkt');
  //         this.router.navigate(['/persons']);
  //       });
  //   } else {
  //     console.log('Formulier is ongeldig');
  //   }
  // }
// Submit de persoon gegevens
onSubmit(): void {
  if (this.personDetailsForm.valid) {
    const formData = {
      id: this.personId,
      ...this.personDetailsForm.value,
      teamId: Number(this.personDetailsForm.value.teamId),
      roleId: Number(this.personDetailsForm.value.roleId),
      gradeId: Number(this.personDetailsForm.value.gradeId),
      specialityId: Number(this.personDetailsForm.value.specialityId)
    };

    if (this.isNewPerson) {
      // Voeg nieuwe persoon toe
      this.personService.createPerson(formData).subscribe(newPerson => {
        alert('Nieuw persoon succesvol aangemaakt');
        this.router.navigate(['/persons']);  // Terug naar de lijst van personen
      });
    } else {
      // Update bestaande persoon
      this.personService.updatePerson(this.personId!, formData).subscribe(updatedPerson => {
        alert('Persoon succesvol bijgewerkt');
        this.router.navigate(['/persons']);  // Terug naar de lijst van personen
      });
    }
  } else {
    console.log('Formulier is ongeldig');
  }
}

  onDelete(): void {
    const personDetailsId = Number(this.route.snapshot.params['id']);
    const confirmDelete = confirm(
      'Weet je zeker dat je deze persoon wilt verwijderen?'
    );

    if (confirmDelete) {
      this.personService.deletePerson(personDetailsId).subscribe(
        () => {
          alert('Persoon succesvol verwijderd');
          this.router.navigate(['/persons']);
        },
        (error) => {
          console.error(
            'Er ging iets mis bij het verwijderen van de persoon',
            error
          );
        }
      );
    }
  }
}
