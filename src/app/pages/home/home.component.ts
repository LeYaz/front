import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Store } from '@ngxs/store';
import { Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IAuthUser } from '../../models/interfaces/auth-user.interface';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})


export class HomeComponent  implements OnInit{
  private destroyRef = inject(DestroyRef);
  user$!: Observable<IAuthUser>;
  name: string = '';

  constructor(
    private authService: AuthService,
    private store: Store,
    public dialog: MatDialog,
  ) { }
  
  ngOnInit(){
    this.user$ = this.store.select(state => state.auth.user);
  }

  //TODO notification components
}
