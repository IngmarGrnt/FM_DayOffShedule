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

  constructor(private fb: FormBuilder) {
    // Wachtwoordformulier instellen
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  private loadProfileData(): void {
    const personId = this.authService.getUserId();
    if (personId !== null && !isNaN(personId)) {
      this.personService.getPersonById(personId).then((personDetails) => {
        this.personData = personDetails;
      });
    }
  }

  private passwordMatchValidator(group: FormGroup): void {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      group.get('confirmPassword')?.setErrors(null);
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;

      // API-aanroep naar de updatePassword-methode in PersonService
      this.personService.updatePassword(this.personData.id, currentPassword, newPassword).subscribe(
        () => {
          alert('Wachtwoord succesvol gewijzigd.');
          this.passwordForm.reset();
        },
        (error) => {
          console.error('Fout bij het wijzigen van het wachtwoord:', error);
          if (error.status === 400) {
            alert('Huidig wachtwoord is onjuist.');
          } else {
            alert('Er is een fout opgetreden. Probeer het opnieuw.');
          }
        }
      );
    }
  }
}
