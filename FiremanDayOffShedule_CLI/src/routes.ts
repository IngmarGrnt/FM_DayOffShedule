import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PersonDetailsComponent } from './components/person/person-details/person-details.component';
import { PersonComponent } from './components/person/base/person.component';
import { YearCalenderComponent } from './components/yearCalender/year-calender/year-calender.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/Profile/profile/profile.component';
import { PersonDayoffInputComponent } from './components/person-dayoff-input/person-dayoff-input.component';
import { TeamCalendarComponent } from './components/dayOffs/team-calender/team-calender.component';



const routeConfig: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardComponent,
    title: 'Home Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor','user'] }
  },
  {
    path: 'persons',
    component: PersonComponent,
    title: 'Personen Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor'] }
  },
  {
    path: 'person_details/:id',
    component: PersonDetailsComponent,
    title: 'Person Details Page',
    canActivate: [AuthGuard],
    data: { role: 'admin' }, 
  },
  {
    path: 'create-person',
    component: PersonDetailsComponent,
    title: 'Create Person Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor'] }
  },
  {
    path: 'yearCalender',
    component: YearCalenderComponent,
    title: 'YearCalender Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor','user'] },  // User of Admin kunnen deze pagina zien
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor','user'] },  // User of Admin kunnen deze pagina zien
  },
  {
    path: 'person-dayoff-input',
    component: PersonDayoffInputComponent,
    title: 'Person-DayOff-Input Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor','user'] },  // User of Admin kunnen deze pagina zien
  },
  {
    path: 'team-calender-input',
    component: TeamCalendarComponent,
    title: 'Team-DayOff-Page',
    canActivate: [AuthGuard],
    data: { roles: ['admin', 'editor'] }, 
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login Page',
  },
  //{
  //   path: 'secure',
  //   component: SecureComponent,
  //   canActivate: [AuthGuard],
  // },
];

export default routeConfig;
