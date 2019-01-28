//Basic
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from "rxjs";

//Services
import { OfflineReminder } from '../../shared/shared.module';
import { LoggerService } from './logger.service';
import { ConfigurationService } from '../../core/configuration.service';

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
   * @param offlineReminder Service used to feedback that the app is offline
   * @param loggerService Logger service
   */
  constructor(private platform: Platform, private offlineReminder: OfflineReminder, private loggerService: LoggerService) {
    this._isReady = new BehaviorSubject(false);
  }

  /**
   * Method to initilize the application service
   */
  public initilizeApplication(): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.platform.ready().then(() => {
        if (isProduction) {
          this.loggerService.setProductionMode();
        }
        //Initialize if the application is on a cordova platform
        let onCordova = this._onCordovaEnvironment()

        // Initialize offline reminder service
        let offlineReminder = this._initializeOfflineReminderService();
        Promise.all([onCordova, offlineReminder]).then(() => {
          this._isReady.next(true);
          resolve();
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

}