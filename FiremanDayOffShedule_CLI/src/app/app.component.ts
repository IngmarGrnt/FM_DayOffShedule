import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { LOCALE_ID } from '@angular/core';


registerLocaleData(localeNl, 'nl');
@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], 
  imports: [RouterModule, MaterialModule,CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }]
})
export class AppComponent {
  // Met @ViewChild kun je de sidenav refereren en toggelen
  @ViewChild('sidenav') sidenav!: MatSidenav;

  username: string | null = null;
  constructor(private router: Router) {}

// Controleer of er een token aanwezig is
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

// Uitlogfunctie
islogout() {
  localStorage.removeItem('token'); // Verwijder token
  this.router.navigate(['/login']); // Navigeer naar loginpagina
}

  ngOnInit() {
    this.username = localStorage.getItem('username'); // Ophalen van de gebruikersnaam
  }

  logout() {
    localStorage.removeItem('token'); // Token verwijderen
    localStorage.removeItem('username'); // Gebruikersnaam verwijderen
    this.router.navigate(['/login']); // Navigeren naar loginpagina
  }
  // Eventueel kun je hier methoden voor de sidenav toevoegen, als je dit buiten het template wilt gebruiken
}
