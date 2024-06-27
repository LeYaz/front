import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { GuestGuard } from './auth/guards/guest.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
    { 
        path: 'login', 
        component: LoginComponent,
        canActivate: [GuestGuard]
     },
    { 
        path: 'home', 
        component: HomeComponent,
        canActivate: [AuthGuard]
     },
];
