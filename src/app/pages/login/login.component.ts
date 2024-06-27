import { Component, DestroyRef, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ILoginDTO } from '../../models/interfaces/login-dto.interface';
import { AuthService } from '../../auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IRegisterDTO } from '../../models/interfaces/register-dto.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private destroyRef = inject(DestroyRef);

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private authService: AuthService) { }

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  registerForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    userName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  });
  haveAccount: boolean = true;

  onLogin() {
    const credentials: ILoginDTO =  { 
      email: this.loginForm.value.email ?? '',
      password: this.loginForm.value.password ?? ''
    };
    this.authService.login(credentials, 'home')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {},
        error: (e) =>{
          this._snackBar.open("Invalid email or password", "Close", {
            duration: 2000,
          });
        }
      })
  }

  onRegister() {
    if (this.registerForm.value.password != this.registerForm.value.confirmPassword) {
      this._snackBar.open("Passwords do not match", "Close", {
        duration: 2000,
      });
      return;
    }
    const credentials: IRegisterDTO =  { 
      email: this.registerForm.value.email ?? '',
      password: this.registerForm.value.password ?? '',
      userName: this.registerForm.value.userName ?? '',
      firstName: this.registerForm.value.firstName ?? '',
      lastName: this.registerForm.value.lastName ?? ''
    };
    this.authService.register(credentials)
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: () => {
        this._snackBar.open("Account created", "Login", {
          duration: 5000,
        }).onAction()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.haveAccount = true;
        });
      },
      error: () => {
        this._snackBar.open("Account creation failed", "Close", {
          duration: 2000,
        });
      }
    });
    
  }
}
