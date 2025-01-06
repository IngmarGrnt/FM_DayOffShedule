import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
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

  constructor(private authService: AuthService, private router: Router,private http: HttpClient) {}

  // onSubmit() {
  //   this.authService.login(this.username, this.password).subscribe({
  //     next: (response) => {
  //       localStorage.setItem('token', response.token); // Token opslaan
  //       localStorage.setItem('username', this.username); // Gebruikersnaam opslaan
  //       console.log(this.username)


  //       this.role = this.authService.getRole(); // Role ophalen
  //       console.log('Gebruikersrole:', this.role);


  //       this.router.navigate(['/profile']); // Navigeren na succesvolle login

  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Invalid username or password.';
  //     },
  //   });
  // }
  
  login() {
    const loginData = {
      grant_type: 'password',
      client_id: 'mnVupE3bJDkKyeyv1GxbSp3ZHawTXqZH',
      client_secret: "klJAc_f1vjYY7GoqTtHfnPPL7hT0mcshkrKsVZyQY8q81GXYXDcoasUV4qrmN371",
      username: this.username,
      password: this.password,
      audience: "https://dev-h38sgv74fxg1ziwv.us.auth0.com/api/v2/",
      scope: "openid profile email",
      connection: "Username-Password-Authentication"
    };

    this.http.post('/oauth/token', loginData).subscribe({
      //Moet in de autservice komen te staan
      next: (response: any) => {
        console.log('Ingelogd!', response);
        localStorage.setItem('access_token', response.access_token);

        const decodedToken: any = jwtDecode(response.id_token);
        console.log('Decoded Token:', decodedToken);  
        localStorage.setItem('id_token',decodedToken);
        console.log('Decoded Token:', decodedToken);
  
         // Gebruik de role-claim uit het ID Token
        const userRole = decodedToken['https://firemandayoffschedule.com/role'];
        console.log('Gebruikersrole:', userRole);
  
        //  this.userRole = this.authService.getRole(); // Role ophalen
        // console.log('Gebruikersrole:', this.role);


        // Navigeer op basis van de rol
        if (userRole) {
          this.router.navigate(['/profile']);
        } else {
          this.router.navigate(['/dashboard']);
        }



        // Navigeer naar de profielpagina
        if (this.userRole !== 'admin') {
          this.router.navigate(['/profile']);
        } else {
          this.errorMessage = 'Geen toegang tot de profielpagina.';
        }
      },
      error: (error) => {
        console.error('Fout bij inloggen:', error);
        this.errorMessage = 'Onjuiste gebruikersnaam of wachtwoord.';
      },
    });
  }
}
