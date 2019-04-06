// Basic
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

// Services
import { ToastService } from '../../providers/services/toast.service';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class AuthService {

  /**
   * Currently authenticated user
   */
  private _authenticatedUser: any;
  /**
   * Observer with the value of the current authentication state
   */
  private _authenticationState: BehaviorSubject<boolean>;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param helper 
   * @param toastService Controller to generate & present light notifications.
   * @param loggerService logger service
   */
  constructor(private helper: JwtHelperService, private toastService: ToastService, private loggerService: LoggerService) {
      this._authenticatedUser = null;
      this._authenticationState = new BehaviorSubject(false);
  }

  public isAuthenticated(): boolean {
    return this._authenticationState.value;
  }
  
  public getAuthenticatedUser(): any {
    return this._authenticatedUser;
  }

  public isTokenValid(token): boolean {
    return !this.helper.isTokenExpired(token);
  }

  public getTokenExpirationDate(token): Date {
    return this.helper.getTokenExpirationDate();
  }

  public setAuthenticatedByToken(token): any {
    this._authenticatedUser = this.helper.decodeToken(token);
    this._authenticationState.next(true);
    this.loggerService.info(this, `Authentication successful.`);
  }
  
  /**
   * Returns an observable to know the changes on the authentication status.
   */
  public authenticationObserver(): Observable<boolean> {
    return this._authenticationState.asObservable();
  }
  
  public onRequestedLogout(): void {
    if (this._authenticatedUser) {
      this._logout();
      this._showAlert('Session logout :)');
    }
  }
  
  public onUnauthorizedRequest(): void {
    if (this._authenticatedUser) {
      this._logout();
      this._showAlert('Could not handle the request because session expired. Please login again!');
    }
  }
  
  public onUnauthorizedRouting(): void {
    if (this._authenticatedUser) {
      this._logout();
      this._showAlert('Session expired. Please login again!');
    }
  }

  private _logout(): void {
    this._authenticatedUser = null;
    this._authenticationState.next(false);
    this.loggerService.info(this, `Authentication logout.`);
  }
  
  private _showAlert(message: string): void {
    this.toastService.showToast({ message })
  }
  
}