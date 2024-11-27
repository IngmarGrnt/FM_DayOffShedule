import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PersonDetailsComponent } from './components/person/person-details/person-details.component';
import { PersonComponent } from './components/person/base/person.component';
import { YearCalenderComponent } from './components/yearCalender/year-calender/year-calender.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/Profile/profile/profile.component';


const routeConfig: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    title: 'Home Page',
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'persons',
    component: PersonComponent,
    title: 'Personen Page',
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
  },
  {
    path: 'person_details/:id',
    component: PersonDetailsComponent,
    title: 'Person Details Page',
    canActivate: [AuthGuard],
    data: { role: 'Admin' }, 
  },
  {
    path: 'create-person',
    component: PersonDetailsComponent,
    title: 'Create Person Page',
    canActivate: [AuthGuard],
    data: { role: 'Admin' }, 
  },
  {
    path: 'yearCalender',
    component: YearCalenderComponent,
    title: 'YearCalender Page',
    canActivate: [AuthGuard],
    data: { role: 'User' }, // User of Admin kunnen deze pagina zien
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page',
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile Page',
    canActivate: [AuthGuard],
    data: { role: 'User' }, // User of Admin kunnen deze pagina zien
  },
];

export default routeConfig;
