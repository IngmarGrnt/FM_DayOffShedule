import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { LOCALE_ID } from '@angular/core';


registerLocaleData(localeNl, 'nl');
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <mat-sidenav-container class="sidenav-container">
      <!-- Sidebar -->
      <mat-sidenav #sidenav mode="side" opened>
        <mat-nav-list>
          <a mat-list-item routerLink="/">
            <mat-icon>dashboard</mat-icon>
            <span>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/persons">
            <mat-icon>person</mat-icon>
            <span>Personen</span>
          </a>
          <a mat-list-item routerLink="/">
            <mat-icon>dns</mat-icon>
            <span>Verlof invuldata</span>
          </a>
          <a mat-list-item routerLink="/yearCalender">
            <mat-icon>calendar_today</mat-icon>
            <span>Jaarkalender</span>
          </a>
          <a mat-list-item routerLink="/settings">
            <mat-icon>settings</mat-icon>
            <span>Instellingen</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

<!-- Main content -->
<mat-sidenav-content>
 
    <!-- <img src="src\assets\images\Brandweerzone_Centrum-Logo.jpg" alt="Brandweerzone Logo" class="logo"> -->


    <!-- Toolbar -->
    <mat-toolbar color="primary">
      <button mat-icon-button (click)="sidenav.toggle()">
        <mat-icon>menu</mat-icon>
      </button>
      <span>Dashboard Verlofregeling Brandweer Gent</span>
    </mat-toolbar>

    <!-- Content area -->
    <section class="content">
      <router-outlet></router-outlet>
    </section>
  </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./app.component.css'], 
  imports: [RouterModule, MaterialModule],
  providers: [{ provide: LOCALE_ID, useValue: 'nl' }]
})
export class AppComponent {
  // Met @ViewChild kun je de sidenav refereren en toggelen
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Eventueel kun je hier methoden voor de sidenav toevoegen, als je dit buiten het template wilt gebruiken
}
