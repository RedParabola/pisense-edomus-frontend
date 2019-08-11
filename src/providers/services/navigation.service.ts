// Basic
import { Injectable } from '@angular/core';
import {App, NavControllerBase} from 'ionic-angular';

// Services
import { AuthService } from '../../providers/services/auth.service';

// Constants
import { PUBLIC_ROUTES } from '../../core/constants/navigation.constants';

/**
 * Service to guide navigation.
 */
@Injectable()
export class NavigationService {

  /**
   * Active nav controller
   */
  private activeNav: NavControllerBase;

  /**
   * Navigation service constructor.
   * @param app Application reference to get the active nav.
   * @param authService Service to provide authentication
   */
  constructor(private app: App, public auth: AuthService) {
  }

  /**
   * 
   */
  public init(): void {
    this.activeNav = this.app.getActiveNav();
  }

  public subscribeAuthenticationStatus(): void {
    this.auth.authenticationObserver().subscribe((status: boolean) => {
      if (status) {
        this._goTo('page-base-tabs');
      } else {
        this._goTo('page-login');
      }
    });
  }

  public goTo(pageRoute: string, navigationParameters?: any): void {
    this._goTo(pageRoute, navigationParameters);
  }

  /**
   * Shows a modal with options.
   * @param component Component to be shown as modal.
   * @param data Parameters to be sent to the modal.
   * @param options Modal options.
   * @returns Modal item to be able to manipulate it.
   */
  private _goTo(pageRoute: string, navigationParameters?: any): void {
    if (this._isPublicRoute(pageRoute)) {
      if (pageRoute === 'page-login') {
        this.activeNav.goToRoot(navigationParameters);
      } else {
        this.activeNav.push(pageRoute, navigationParameters);
      }
    } else {
      if (this.auth.isAuthenticated()) {
        this.activeNav.push(pageRoute, navigationParameters);
      } else {
        this.auth.onUnauthorizedRouting();
        this.activeNav.goToRoot(navigationParameters);
      }
    }
  }

  private _isPublicRoute(route: string): boolean {
    return PUBLIC_ROUTES.indexOf(route) !== -1;
  }

}