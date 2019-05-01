//Basic
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from "rxjs";

//Services
import { UserStore } from '../../providers/stores/user.store';
import { RoomStore } from '../../providers/stores/room.store';
import { ThingStore } from '../../providers/stores/thing.store';
import { OfflineReminder } from '../../shared/shared.module';
import { LoggerService } from './logger.service';
import { ConfigurationService } from '../../core/configuration.service';
import { NetworkService } from '../services/network.service';
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
   * @param roomStore Store for handling rooms.
   * @param thingStore Store for handling things.
   * @param offlineReminder Service used to feedback that the app is offline
   * @param loggerService Logger service
   * @param networkService Network service
   * @param navigationService Navigation service to navigate through the app.
   */
  constructor(private platform: Platform, private userStore: UserStore, private roomStore: RoomStore, private thingStore: ThingStore, private offlineReminder: OfflineReminder, private loggerService: LoggerService, private networkService: NetworkService, private navigationService: NavigationService) {
    this._isReady = new BehaviorSubject(false);
  }

  /**
   * Method to initilize the application service
   */
  public initializeApplication(): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.platform.ready()
        .then(() => this._onCordovaEnvironment())
        .then(() => this._initializeServices())
        .then(() => this._prepareForAuthenticationChanges())
        .then(() => this._initializeUserSession())
        .then(() => {
          this._isReady.next(true);
          resolve();
        })
        .catch((error) => {
          this.loggerService.error(this, `Application services could not be correctly initialized.`);
          reject(error);
      });
    });
    return promise;
  }

  /**
   * Initialize if the application is on a cordova platform
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
   * // Initializes basic needs for each service.
   */
  private _initializeServices(): Promise<any> {
    if (isProduction) {
      this.loggerService.setProductionMode();
    }
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.networkService.init().then(
      () => {
        this.offlineReminder.init();
        this.navigationService.init();
        resolve();
      }, () => {
        reject();
      });
    });
    return promise;
  }

  /**
   * Prepares services and stores for listening authentication changes.
   */
  private _prepareForAuthenticationChanges(): Promise<any> {
    this.navigationService.subscribeAuthenticationStatus();
    this.userStore.listenAuthenticationStatus();
    this.roomStore.listenAuthenticationStatus();
    this.thingStore.listenAuthenticationStatus();
    return Promise.resolve();
  }

  /**
   *  Method to initialize the user session.
   */
  private _initializeUserSession(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.userStore.initializeUser().then(
        () => resolve(),
        () => {
          this.loggerService.error(this, `Could not initialize user session correctly.`);
          reject();
        }
      );
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

  public closeApp(): void {
    this.platform.exitApp();
  }
}