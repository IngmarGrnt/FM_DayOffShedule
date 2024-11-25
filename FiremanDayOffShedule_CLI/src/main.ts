/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './routes';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';


bootstrapApplication(AppComponent,{
  providers:[
    provideRouter(routeConfig),
    provideHttpClient(), provideAnimationsAsync()
  ]
})
  .catch((err) => console.error(err));

  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideHttpClient(withInterceptors([authInterceptor])) // Function-based interceptor toevoegen
  //   ],
  // }).catch(err => console.error(err));