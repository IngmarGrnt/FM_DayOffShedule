import { ChangeDetectorRef, Component, ViewChild, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { LOCALE_ID } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PersonService } from '../services/person.service';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

registerLocaleData(localeNl, 'nl');
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, MaterialModule, CommonModule, FlexLayoutModule],
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }],
})
export class AppComponent {
  // Met @ViewChild kun je de sidenav refereren en toggelen
  @ViewChild('sidenav') sidenav!: MatSidenav;
  personService = inject(PersonService);
  personData: any = null;
  userId: string | null = null;
  username: string | null = null;
  role: any;
  userRole: string | null = null;
  token: string | null = null;
  private subscription?: Subscription;
  authService = inject(AuthService);
  isLoggedIn$ = this.authService.loggedIn$; // Observeer de ingelogde status
  constructor(
    private router: Router,

  ) {
    this.updateUserRole();
  }

  ngOnInit(): void {
    // Haal de token op bij component-initialisatie
    this.token = localStorage.getItem('access_token');
    if (this.token) {
      this.decodeTokenAndSetRole(); // Decodeer token en stel rol in
      this.loadProfileData(); // Laad profieldata
    }

    // console.log('Gebruikersrol bijgewerkt:', this.userRole);

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
      // console.log('Gebruikersrol uit token:', this.userRole);
    } catch (error) {
      console.error('Fout bij decoderen van token:', error);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe om memory leaks te voorkomen
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  updateUserRole() {
    this.userRole;
  }

  /**
   * Controleer of de gebruiker is ingelogd (op basis van token).
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token; // Controleer of een token aanwezig is
  }

  hasRole(role: string): boolean {
    if (!this.userRole) {
      this.decodeTokenAndSetRole();
    }
    return this.userRole === role;
  }

  



  private async loadProfileData(): Promise<void> {
    const auth0Id = this.authService.getAuth0Id(); // Haal Auth0Id op
    if (!auth0Id) {
      console.error('Geen Auth0Id gevonden.');
      return;
    }
  
    try {
   
      const personDetails = await this.personService.getPersonByAuth0Id(auth0Id);
      if (personDetails && personDetails.id) {
        // console.log('Persoon ID uit Auth0Id:', personDetails.id);
  
        // Haal gedetailleerde gegevens op met de ID
        const fullPersonDetails = await this.personService.getPersonById(personDetails.id);
        this.personData = fullPersonDetails;
        // console.log('Volledige persoongegevens:', this.personData);
      } else {
        console.error('Geen persoon gevonden met Auth0Id:', auth0Id);
      }
    } catch (error) {
      console.error('Fout bij het laden van profielgegevens:', error);
    }
  }
  


  islogout() {
    localStorage.removeItem('token'); // Token verwijderen
    // localStorage.removeItem('username'); // Gebruikersnaam verwijderen
    this.router.navigate(['/login']); // Navigeren naar loginpagina
  }
  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

}
