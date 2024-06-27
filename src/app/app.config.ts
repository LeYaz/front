import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { withNgxsRouterPlugin } from '@ngxs/router-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsWebSocketPlugin } from '@ngxs/websocket-plugin';
import { NgxsModule, provideStore } from '@ngxs/store';
import { provideHttpClient, withFetch, withInterceptorsFromDi, withJsonpSupport, withXsrfConfiguration } from '@angular/common/http';
import { ClientAuthModule } from './auth/auth.module';
import { environment } from './environments/environment.prod';
import { AuthState } from './auth/store/auth.state';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideStore(
    [],
    withNgxsReduxDevtoolsPlugin(),
    withNgxsFormPlugin(),
    withNgxsLoggerPlugin(),
    withNgxsRouterPlugin(),
    withNgxsStoragePlugin({ keys: '*' }),
    withNgxsWebSocketPlugin()),
    provideHttpClient(
      withJsonpSupport(),
      withFetch(),
      withXsrfConfiguration({}),
       // This is required for our interceptor to work
      withInterceptorsFromDi()
    ),
    importProvidersFrom(
      // Import our auth module and initialize settings for this app
      ClientAuthModule.forRoot({
        apiUrl: environment.apiUrl!, // pass the API url from an env var
        loginRedirect: '/account/login',
        unauthorizedRedirect: '/unauthorized',
        afterLogoutRedirect: '/'
      }),
        
      // Important: Initialize NGXS with the AuthState application wide.
      NgxsModule.forRoot([AuthState], {
        developmentMode: !environment.production,
      }),
    ),]
};
