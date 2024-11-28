import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule,CommonModule,MaterialModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  role: string | null = null;
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Token opslaan
        localStorage.setItem('username', this.username); // Gebruikersnaam opslaan
        console.log(this.username)


        this.role = this.authService.getRole(); // Role ophalen
        console.log('Gebruikersrole:', this.role);


        this.router.navigate(['/profile']); // Navigeren na succesvolle login

      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
  
  
  
}
