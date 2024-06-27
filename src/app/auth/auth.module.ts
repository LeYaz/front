import { CommonModule } from "@angular/common";
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from "@angular/core";
import { NgxsModule, Store } from "@ngxs/store";
import { AuthState } from "./store/auth.state";
import { RouterModule } from "@angular/router";
import { AUTH_MODULE_CONFIG, IClientAuthModuleConfig } from "./config/config";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { AuthHttpInterceptor } from "./interceptors/http.interceptors";
import { initializeApp } from "./config/auth.initializer";
import { LocalStorageService } from "./services/local-storage.service";

@NgModule({
    declarations: [],
    imports: [
      CommonModule,
      NgxsModule.forFeature([AuthState]),
      RouterModule,
    ],
  })
  export class ClientAuthModule {
    static forRoot(
      config: IClientAuthModuleConfig
    ): ModuleWithProviders<ClientAuthModule> {
      return {
        ngModule: ClientAuthModule,
        providers: [
          // Make our configuration settings injectable inside our module
          { provide: AUTH_MODULE_CONFIG, useValue: config },
          // Register our Http Inteceptor globally
          {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthHttpInterceptor,
            multi: true,
          },
          // Register our App initializer globally and provide dependencies
          {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            multi: true,
            // Pass the dependencies for our intializer function.
            // NOTE: Must be in the same order as the function 
            // arguments (initializeApp).
            deps: [AUTH_MODULE_CONFIG, HttpClient, LocalStorageService, Store],
          },
        ],
      };
    }
  }