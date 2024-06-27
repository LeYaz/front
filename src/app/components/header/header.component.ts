import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isGuest$! : Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isGuest$ = this.store.select(state => state.auth.isGuest);
  }

  home(){
    this.router.navigate(['home']);
  }

  group(){
    this.router.navigate(['group']);
  }

  settings(){
    this.router.navigate(['settings']);
  }

  logout(){
    this.authService.logout();
  }

  login(){
    this.router.navigate(['login']);
  }

}
