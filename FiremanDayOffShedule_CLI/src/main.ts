/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import routeConfig from './routes';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAuth0 } from '@auth0/auth0-angular';

bootstrapApplication(AppComponent,{
  providers:[
    provideRouter(routeConfig),
    provideHttpClient(), 
    provideAnimationsAsync(),
    provideAuth0({
      domain: 'dev-h38sgv74fxg1ziwv.us.auth0.com', // Vervang met jouw Auth0-domein
      clientId: 'oRibFlp2kGnnOmxNd9HWqUni6ymhCWbX', // Vervang met jouw Client ID
    }),
  ]
})
  .catch((err) => console.error(err));

  // bootstrapApplication(AppComponent, {
  //   providers: [
  //     provideHttpClient(withInterceptors([authInterceptor])) // Function-based interceptor toevoegen
  //   ],
  // }).catch(err => console.error(err));