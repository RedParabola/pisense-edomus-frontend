//Basic
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from "rxjs";

//Services
import { UserStore } from '../../providers/stores/user.store';
import { OfflineReminder } from '../../shared/shared.module';
import { LoggerService } from './logger.service';
import { ConfigurationService } from '../../core/configuration.service';
import { AuthService } from './auth.service';
import { NavigationService } from './navigation.service';

/**
 * sets isProduction variable (enviroment)
 */
const { isProduction } = ConfigurationService.environment.$environment;

/**
 * Service utils for the application.
 */
@Injectable()
export class ApplicationService {

  /**
   * Observer to know when the application is ready
   */
  private _isReady: BehaviorSubject<boolean>;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param platform Used to get information about your current device.
   * @param userStore Store to handle user info.
   * @param offlineReminder Service used to feedback that the app is offline
   * @param loggerService Logger service
   * @param navigationService Navigation service to navigate through the app.
   * @param authService Service to provide authentication
   */
  constructor(private platform: Platform, private userStore: UserStore, private offlineReminder: OfflineReminder, private loggerService: LoggerService, private navigationService: NavigationService, private authService: AuthService) {
    this._isReady = new BehaviorSubject(false);
  }

  /**
   * Method to initilize the application service
   */
  public initializeApplication(): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (isProduction) {
          this.loggerService.setProductionMode();
        }
        //Initialize if the application is on a cordova platform
        let onCordova = this._onCordovaEnvironment();

        //Initialize navigation service nav
        let navigationReady = this._initNavigationService();
        
        //Initialize authenticated user
        let authenticatedStatus = this._initAuthenticatedStatus();


        //Initialize offline reminder service
        let offlineReminder = this._initializeOfflineReminderService();
        Promise.all([
          onCordova,
          navigationReady,
          offlineReminder,
          authenticatedStatus
        ]).then(() => {
          this._isReady.next(true);
          resolve();
        }, () => {
          this.loggerService.error(this, `Application services could not be correctly initialized.`); 
          reject();
        });
      });
    });
    return promise;
  }

  /**
   * Method that says when the application is ready
   */
  public ready(): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this._isReady.subscribe((isReady) => {
        if (isReady) {
          resolve();
        }
      });
    });
    return promise;
  }

  /**
   * Method to know which things we have to set if cordova exists.
   */
  private _onCordovaEnvironment(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      // If we are on a cordova platform (Android, iOS, Browser)
      if (this.platform.is('cordova')) {
        //
      }
      resolve();
    });
    return promise;
  }

  /**
   *  Method to initialize the offline reminder inside the application context.
   */
  private _initializeOfflineReminderService(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.offlineReminder.init();
      resolve();
    });
    return promise;
  }

  /**
   *  Method to initialize the offline reminder inside the application context.
   */
  private _initNavigationService(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.navigationService.init();
      resolve();
    });
    return promise;
  }

  /**
   *  Method to initialize the authenticated status.
   */
  private _initAuthenticatedStatus(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.authService.authenticationObserver().subscribe((status: boolean) => {
        if (status) {
          this.navigationService.goTo('page-base-tabs');
        } else {
          this.navigationService.goTo('page-login');
        }
      });
      this.userStore.initializeUser().then(
        () => resolve(),
        () => {
          this.loggerService.error(this, `Could not initialize authenticated status correctly.`);
          reject();
        }
      );
    });
    return promise;
  }

}