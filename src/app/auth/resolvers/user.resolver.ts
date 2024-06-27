import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngxs/store';
import { map } from 'rxjs';
import { AuthState, IAuthState } from '../store/auth.state';
import { IJwtPayload } from '../../models/interfaces/jwt-payload.interface';

export const UserResolver: ResolveFn<IJwtPayload | undefined> = () =>
  inject(Store)
    .select<IAuthState>(AuthState)
    .pipe(map((state) => state?.user));