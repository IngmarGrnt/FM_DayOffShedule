import { Routes } from "@angular/router";
import { HomeComponent } from "./components/dashboard/dashboard.component";
import { PersonDetailsComponent } from "./components/person/person-details/person-details.component";
import { PersonComponent } from "./components/person/base/person.component";
import { YearCalenderComponent } from "./components/yearCalender/year-calender/year-calender.component";
const routeConfig:Routes =[
    {
        path:'',
        pathMatch: 'full',
        component:HomeComponent,
        title:'Home Page',
       
    },
    {
        path: 'persons',
        component: PersonComponent,
        title: 'Personen Page'
    },
    {
        path: 'person_details/:id',
        component: PersonDetailsComponent,
        title: 'Person Details Page'
    },
    {
        path: 'create-person',
        component: PersonDetailsComponent,
        title: 'Person Details Page'
    },
    {
        path: 'yearCalender',
        component: YearCalenderComponent,
        title: 'yearCalender Page'
    },
  
    
];

export default routeConfig;