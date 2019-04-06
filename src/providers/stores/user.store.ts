//Basic
import { Injectable } from '@angular/core';

//Api Services
import { UserDatabaseService } from '../db/user.service.db';
import { ApiUserProvider } from '../api/api-user.service';

//Services
import { RoomStore } from '../stores/room.store';
import { ThingStore } from '../stores/thing.store';
import { AuthService } from '../services/auth.service';
import { LoggerService } from '../services/logger.service';

//Models
import { UserModel } from '../../core/model/user.model';

//Constants
import { USER_CONSTANTS } from '../../core/constants/user.constants';

/**
 * Store to handle user data.
 */
@Injectable()
export class UserStore {

  /**
   * stores the current user
   */
  private currentUser: any;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param userDB user database access.
   * @param userProvider Api user provider
   * @param roomStore Store for handling rooms.
   * @param thingStore Store for handling things.
   * @param authService auth service
   * @param loggerService logger service
   */
  constructor(private userDB: UserDatabaseService, private userProvider: ApiUserProvider, private roomStore: RoomStore, private thingStore: ThingStore, private authService: AuthService, private loggerService: LoggerService) {
    this.currentUser = null;
  }

  /**
   * Initialize authenticated user by detecting stored token.
   */
  public initializeUser(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this._listenAuthenticationStatus();
      this.userDB.get(USER_CONSTANTS.TOKEN).then(
        (token: any) => {
          if (this.authService.isTokenValid(token)) {
            this.loggerService.info(this, `Located VALID TOKEN, refreshing authenticated user.`);
            this.authService.setAuthenticatedByToken(token);
            // this.setRefreshTokenDate(token);
            resolve();
          } else {
            this.loggerService.info(this, `Located EXPIRED TOKEN, removing from DB.`);
            this._cleanLastUserInfo().then(
              () => resolve(),
              () => reject()
            );
          }
        }, (error) => {
          this.loggerService.info(this, `No Token found in DB.`);
          resolve();
        }
      );
    });
    return promise;
  }

  private setRefreshTokenDate(token: string): void {
    // Set logic for refreshing the token.
    // 1. We need a refresh token.
    // 2. We need to check the expiration date: this.authService.getTokenExpirationDate(token);
    // 3. We want it to refresh 5-10 min before expiration date.
    // https://blog.angular-university.io/angular-jwt-authentication/ comments below :)
  }

  public getCurrentUser(): any {
    return Object.assign({}, this.currentUser);
  }

  /**
   * Performs a register against the backend. If successful, logins with the info
   * @param credentials Value of use credentials
   */
  public registerUser(credentials: any): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.userProvider.register(credentials).then(
        (res) => resolve(),
        (error) => reject(error)
      );
    });
    return promise;
  }

  /**
   * Logins a user agains the backend
   * @param credentials Value of use credentials
   */
  public loginUser(credentials: any): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.userProvider.login(credentials).then(
        (res) => {
          const token = res[USER_CONSTANTS.TOKEN];
          this.userDB.set(USER_CONSTANTS.TOKEN, token).then(
            (answer) => {
              this.authService.setAuthenticatedByToken(token);
              // this.setRefreshTokenDate(token);
              resolve();
            }, (error) => reject(error)
          );
        }, (error) => reject(error)
      );
    });
    return promise;
  }

  public logoutUser(): void {
    this.authService.onRequestedLogout();
  }

  private _listenAuthenticationStatus(): void {
    this.authService.authenticationObserver().subscribe((status: boolean) => {
      if (status) {
        this.currentUser = this.authService.getAuthenticatedUser();
      } else {
        if (!!this.currentUser) {
          this._cleanLastUserInfo().then(
            () => this.loggerService.info(this, `Logout successful.`),
            (error) => { }
          );
        }
      }
    })
  }

  private _cleanLastUserInfo(): Promise < any > {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {

      let roomClean = this.roomStore.cleanUserRooms();
      let thingClean = this.thingStore.cleanUserThings();
      let tokenClean = this.userDB.remove(USER_CONSTANTS.TOKEN);

      Promise.all([roomClean, thingClean, tokenClean]).then(() => {
        this.loggerService.info(this, `User info cleared successfully from databases.`),
        resolve();
      }, () => {
        this.loggerService.error(this, `Failed on clearing user info from databases.`);
        reject();
      });


    });
    return promise;
  }
  
}
