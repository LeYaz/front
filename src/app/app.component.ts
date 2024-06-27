import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AuthState, IAuthState } from './auth/store/auth.state';
import { Observable } from 'rxjs';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  // @Select(AuthState) auth$!: Observable<IAuthState>;
  auth$: Observable<IAuthState> = inject(Store).select<IAuthState>(AuthState.authData);
  title = 'front';
}
