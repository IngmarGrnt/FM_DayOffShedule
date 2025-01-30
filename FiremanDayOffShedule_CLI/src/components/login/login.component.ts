import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { PersonService } from '../../services/person.service';
import { environment } from '../../environments/environment';
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
  email:string ='';
  userRole: string | null = null;
  isResettingPassword: boolean = false;
  constructor(private personService: PersonService, private router: Router,private http: HttpClient) {}


  login() {
    const loginData = {
      username: this.username,
      password: this.password,
    };
    const apiUrl = environment.apiUrl + '/api/auth/login'; 
    this.http.post<{ access_token: string; id_token: string ;}>(apiUrl, loginData)
      .subscribe({
        next: (response) => {
          localStorage.setItem('access_token', response.access_token);
          //localStorage.setItem('id_token', response.id_token);
          //console.log('Token:', response); 
          this.decodeTokenAndSetRole();
          // Navigeer naar de profielpagina
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Fout bij inloggen:', error);
          this.errorMessage = 'Onjuiste gebruikersnaam of wachtwoord.';
        },
      });

  }
  
  private decodeTokenAndSetRole(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Geen token gevonden.');
      return;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const roleClaim = 'https://firemandayoffschedule.com/role'; // Pas aan naar jouw namespace
      this.userRole = decodedToken[roleClaim];
      if(this.userRole){
        localStorage.setItem('role_token',this.userRole);
      }
      else{
        console.log('Geen Gebruikersrol uit token Gevonden:', this.userRole)
      }
      //console.log('Gebruikersrol uit token:', this.userRole);
    } catch (error) {
      console.error('Fout bij decoderen van token:', error);
    }
  }

  resetPassword() {
    if (!this.username) {
      this.errorMessage = 'Vul een geldig e-mailadres in om je wachtwoord te resetten.';
      return;
    }

    this.personService.resetPassword(this.username).subscribe({
      next: (response: any) => {
        alert(response.message); // Gebruik het bericht uit de JSON-response
      },
      error: (error) => {
        console.error('Fout bij het aanvragen van wachtwoordreset:', error);
        this.errorMessage = 'Er is een fout opgetreden. Probeer het opnieuw.';
      },
    });
  }

  toggleResetPassword() {
    this.isResettingPassword = !this.isResettingPassword;
    this.errorMessage = '';
  }
}

