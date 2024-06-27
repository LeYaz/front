import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AUTH_MODULE_CONFIG, IClientAuthModuleConfig } from "../config/config";
import { AuthState, IAuthState } from "../store/auth.state";
import { Store } from "@ngxs/store";
import { catchError, map, of } from "rxjs";

export const AuthGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const moduleConfig = inject<IClientAuthModuleConfig>(AUTH_MODULE_CONFIG);
  
    return inject(Store)
      .select<IAuthState>(AuthState.authData)
      .pipe(
        map((authState) =>
          authState.isGuest
            ? router.parseUrl(`${moduleConfig.loginRedirect}?next=${state.url}`)
            : true
        ),
        catchError(() => {
          return of(false);
        })
      );
  };