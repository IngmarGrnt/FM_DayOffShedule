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
  private subscription?: Subscription;
  authService = inject(AuthService);
  constructor(
    private router: Router,

  ) {
    this.updateUserRole();
  }

  ngOnInit(): void {
    // Subscribe naar de gebruikersrol en werk de UI automatisch bij
    this.subscription = this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      this.username = localStorage.getItem('username'); // Ophalen van de gebruikersnaam
    });
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    // Unsubscribe om memory leaks te voorkomen
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  updateUserRole() {
    this.userRole = this.authService.getRole();
  }

  isLoggedIn(): boolean {
    return !!this.userRole;
  }
  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }


 loadProfileData(): void {
  let personId = this.authService.getUserId();
  console.log("PersonId in app component"+personId)
  if (personId !== null && !isNaN(personId)) {
    this.personService.getPersonById(personId).then((personDetails) => {
      this.personData = personDetails;
    });
  }
}


  islogout() {
    localStorage.removeItem('token'); // Token verwijderen
    localStorage.removeItem('username'); // Gebruikersnaam verwijderen
    this.router.navigate(['/login']); // Navigeren naar loginpagina
  }
  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

}
