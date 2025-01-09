import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { PersonService } from '../../../services/person.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  personService = inject(PersonService);
  authService = inject(AuthService);
  personData: any = null;
  passwordForm: FormGroup;
  personDetails: any;
  errorMessage: string | undefined;  
  
  constructor(private fb: FormBuilder) {
    // Wachtwoordformulier instellen
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      // { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  private async loadProfileData(): Promise<void> {
    const auth0Id = this.authService.getAuth0Id(); // Ophalen van Auth0Id
    if (auth0Id) {
      try {
        this.personDetails = await this.personService.getPersonByAuth0Id(auth0Id);
        if (this.personDetails) {
          this.personData = this.personDetails;
          // console.log('Persoongegevens geladen:', this.personData);
        } else {
          console.error('Geen gegevens gevonden voor de opgegeven Auth0Id:', auth0Id);
        }
      } catch (error) {
        console.error('Fout bij het laden van de profielgegevens:', error);
      }
    } else {
      console.error('Geen Auth0Id gevonden.');
    }
  }

  // private passwordMatchValidator(group: FormGroup): void {
  //   const newPassword = group.get('newPassword')?.value;
  //   const confirmPassword = group.get('confirmPassword')?.value;

  //   if (newPassword !== confirmPassword) {
  //     group.get('confirmPassword')?.setErrors({ mismatch: true });
  //   } else {
  //     group.get('confirmPassword')?.setErrors(null);
  //   }
  // }

  // onChangePassword(): void {
  //   if (this.passwordForm.valid) {
  //     const { currentPassword, newPassword } = this.passwordForm.value;

  //     // API-aanroep naar de updatePassword-methode in PersonService
  //     this.personService.updatePassword(this.personData.id, currentPassword, newPassword).subscribe(
  //       () => {
  //         alert('Wachtwoord succesvol gewijzigd.');
  //         this.passwordForm.reset();
  //       },
  //       (error) => {
  //         console.error('Fout bij het wijzigen van het wachtwoord:', error);
  //         if (error.status === 400) {
  //           alert('Huidig wachtwoord is onjuist.');
  //         } else {
  //           alert('Er is een fout opgetreden. Probeer het opnieuw.');
  //         }
  //       }
  //     );
  //   }
  // }
  resetPassword() {
    this.personService.resetPassword(this.personData.emailAdress).subscribe({
      next: (response: any) => {
        alert(response.message); // Gebruik het bericht uit de JSON-response
      },
      error: (error) => {
        console.error('Fout bij het aanvragen van wachtwoordreset:', error);
        this.errorMessage = 'Er is een fout opgetreden. Probeer het opnieuw.';
      },
    });
  }


}
