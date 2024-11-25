import { Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/dashboard.component';
import { PersonDetailsComponent } from './components/person/person-details/person-details.component';
import { PersonComponent } from './components/person/base/person.component';
import { YearCalenderComponent } from './components/yearCalender/year-calender/year-calender.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routeConfig: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    title: 'Home Page',
    canActivate: [AuthGuard], // Beveiligd met de Auth Guard
  },
  {
    path: 'persons',
    component: PersonComponent,
    title: 'Personen Page',
    canActivate: [AuthGuard], // Beveiligd met de Auth Guard
  },
  {
    path: 'person_details/:id',
    component: PersonDetailsComponent,
    title: 'Person Details Page',
    canActivate: [AuthGuard], // Beveiligd met de Auth Guard
  },
  {
    path: 'create-person',
    component: PersonDetailsComponent,
    title: 'Create Person Page',
    canActivate: [AuthGuard], // Beveiligd met de Auth Guard
  },
  {
    path: 'yearCalender',
    component: YearCalenderComponent,
    title: 'YearCalender Page',
    canActivate: [AuthGuard], // Beveiligd met de Auth Guard
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page',
  },
];

export default routeConfig;
