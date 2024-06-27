import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { IAuthUser } from '../../models/interfaces/auth-user.interface';

// An interface for our Auth State
export interface IAuthState {
  initialized: boolean;
  isGuest: boolean;
  user: IAuthUser | undefined;
}

// State Action: Set User
export class AuthStateActionSetUser {
  static readonly type = '[Auth] Set User';
  constructor(public user: IAuthUser | undefined) {}
}

// State Action: Logout
export class AuthStateActionLogout {
  static readonly type = '[Auth] Logout';
}

/**
 * The main Auth State class
 * `initialized` property is useful for filtering out store events
 *  that might trigger before the store is actually initialized.
**/
@State<IAuthState>({
  name: 'auth',
  defaults: {
    initialized: false,
    user: undefined,
    isGuest: true,
  },
})
@Injectable()
export class AuthState {

  /**
   * Updates the state with the user object.
   * Marks the state as initialized.
   * Sets the isGuest;
  **/
  @Action(AuthStateActionSetUser)
  setUser(ctx: StateContext<IAuthState>, { user }: AuthStateActionSetUser) {
    const state = ctx.getState();
    // We can optionally check if the user object is valid at this point
    const validUser = user?.id !== undefined;

    ctx.setState({
      ...state,
      user: validUser ? user : undefined,
      isGuest: !validUser,
      initialized: true,
    });
  }

  @Action(AuthStateActionLogout)
  logout(ctx: StateContext<IAuthState>) {
    ctx.setState({
      user: undefined,
      isGuest: true,
      initialized: true,
    });
  }

  @Selector()
  static authData(state: IAuthState) {
    return {
      user: state.user,
      isGuest: state.isGuest,
      initialized: state.initialized,
    };
  }
}