import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {jwtDecode} from 'jwt-decode';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule,CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}



  onSubmit() {
    console.log('Ingevoerde gegevens:', { username: this.username, password: this.password });
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Token opslaan in localStorage
        this.router.navigate(['/']); // Verwijs naar een andere pagina na succesvolle login
      },
      error: (error) => {
        console.error('Login mislukt:', error); // Log de fout voor debugging
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
  
  
}
