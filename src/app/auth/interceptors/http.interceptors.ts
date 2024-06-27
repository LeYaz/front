import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AUTH_MODULE_CONFIG, BYPASS_AUTH_INTERCEPTOR, IClientAuthModuleConfig } from "../config/config";
import { BuildAuthHttpHeaders } from "../utils/auth-headers.utils";
import { ILoginResponse } from "../../models/interfaces/login-response.interface";

@Injectable()
export class AuthHttpInterceptor implements HttpInterceptor {
  constructor(private http: HttpClient, private authService: AuthService) {}
  
  // We use this to prevent multiple requests for refreshing
  isRefreshingAuthToken = false;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Check context for Bypass
    // Earlier we've set up an `HttpContextToken`
    // We can check if it was passed in the HttpContext
    // and skip any logic defined in this interceptor.
    // Usage: `new HttpContext().set(BYPASS_AUTH_INTERCEPTOR, true);`
    if (req.context.get(BYPASS_AUTH_INTERCEPTOR) === true) {
      return next.handle(req);
    }
    
    // We are assuming here that all calls to our API start with `/api/`.
    // Http calls on the server side require a base url.
    // We are going to pass this to our request url.
    const API_URL = inject<IClientAuthModuleConfig>(AUTH_MODULE_CONFIG).apiUrl;
    
    // We only want to apply this logic for our backend
    // which means any request that starts with `/api/` in our case
    if (req.url?.startsWith('/api/')) {
      // Retrieve the `Access Token` from localStorage
      const accessToken = this.authService.retrieveAccessToken();
      // Build the request headers
      let headers = new HttpHeaders();
      
      // If an accessToken is found attach it to the request headers
      if (accessToken) {
        headers = BuildAuthHttpHeaders(accessToken);
      }
      
      // Request object is immutable by default. We therefore need to clone
      // it and override it with our settings.
      // 1. Add base url and replace `/api/` path
      // 2. Attach Auth headers
      req = req.clone({
        url: `${API_URL}${req.url.replace('/api/', '/')}`,
        headers: headers,
      });
    }
      
    // Return the cloned request and try to catch errors
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Retrieve the refreshToken from localStorage
        const refreshToken = this.authService.retrieveRefreshToken();
        
        // If the error status code is 401 (Unauthorized) and a refreshToken
        // exists in our localStorage then try to request a new Access Token
        if (
          err.status == HttpStatusCode.Unauthorized &&
          refreshToken &&
          !this.isRefreshingAuthToken // To prevent multiple calls
        ) {
          this.isRefreshingAuthToken = true;
          
          // Call /auth/refresh endpoint to get new Access Token
          return this.http
            .get<Omit<ILoginResponse, 'refresh'>>(`${API_URL}/auth/refresh`, {
              headers: BuildAuthHttpHeaders(refreshToken),
            })
            .pipe(
              switchMap((res) => {
                // Retry original request after new headers are set
                // from refresh endpoint
                if (res.access) {
                  // Update our localStorage with new Tokens
                  this.authService.storeAccessTokens({
                    access: res.access,
                    refresh: refreshToken,
                  });
                      
                  // Clone the request object with new tokens
                  // and retry the original url
                  req = req.clone({
                    headers: BuildAuthHttpHeaders(res.access),
                  });
                }
                // Reset the isRefreshingAuthToken variable
                this.isRefreshingAuthToken = false;
                return next.handle(req);
              }),
              // If we catch an error at this point it means that
              // the user doesn't have permissions to access the requested 
              // resource. It's up to you to determine what happens here.
              catchError(() => {
                return throwError(() => 'UNAUTHORIZED');
              })
            );
        }
        
        // If everything else fails reset and throw an error.
        this.isRefreshingAuthToken = false;
        return throwError(() => err);
      })
    );
  }
}