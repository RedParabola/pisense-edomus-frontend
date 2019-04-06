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

  /**
   * Shows a modal with options.
   * @param component Component to be shown as modal.
   * @param data Parameters to be sent to the modal.
   * @param options Modal options.
   * @returns Modal item to be able to manipulate it.
   */
  public goTo(pageRoute: string, navigationParameters?: any): void {
    if (this._isPublicRoute(pageRoute)) {
      this.activeNav.push(pageRoute, navigationParameters);
    } else {
      if (this.auth.isAuthenticated()) {
        this.activeNav.push(pageRoute, navigationParameters);
      } else {
        this.auth.onUnauthorizedRouting();
        this.activeNav.push('page-login');
      }
    }
  }

  private _isPublicRoute(route: string): boolean {
    return PUBLIC_ROUTES.indexOf(route) !== -1;
  }

}