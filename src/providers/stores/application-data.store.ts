//Basic
import { Injectable } from '@angular/core';

//Api Services
import { ApplicationDataDatabaseService } from '../db/application-data.service.db';

//Services
import { LoggerService } from '../services/logger.service'

//Models
import { TimerSettingModel } from '../../core/model/timer-setting.model';

//Constants
import { APPLICATION_CONSTANTS } from '../../core/constants/application-data.constants';

//Moment
import * as moment from 'moment';

/**
 * Store to handle general application data.
 */
@Injectable()
export class ApplicationDataStore {

  /**
   * stores the number of attempts and the next date to be asked
   */
  private currentPrivacyTimer: TimerSettingModel;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param appDataDB application data database access.
   * @param loggerService logger service
   */
  constructor(private appDataDB: ApplicationDataDatabaseService, private loggerService: LoggerService) {
    this.initPrivacyPermission();
  }

  /**
   * Initialize currentPrivacyTimer from the DB | first time 
   */
  private initPrivacyPermission(): void {
    this.appDataDB.get(APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS).then(
      (answer: TimerSettingModel) => {
        this.currentPrivacyTimer = answer;
      }, (error) => {
        let timerFirstTimeSettings: TimerSettingModel = this.getStartingTimer();
        this.appDataDB.set(APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS, timerFirstTimeSettings).then(
          (answer) => {
            this.currentPrivacyTimer = timerFirstTimeSettings;
          }, (error) => {
            this.loggerService.error(this, `AppDataDB SET FAIL for: ${APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS} ${timerFirstTimeSettings}.`);
          });
      });
  }

  /**
   * Use to get a default starting timer.
   */
  private getStartingTimer(): TimerSettingModel {
    let timerFirstTimeSettings: TimerSettingModel = <TimerSettingModel>{
      timerDate: undefined,
      attempts: 0
    };
    return timerFirstTimeSettings;
  }

  /**
   * Search if the app should ask for permissions again
   */
  public shouldAskPrivacyPermission(): boolean {
    let shouldAsk: boolean = true;
    if (this.currentPrivacyTimer.attempts === 3) {
      //3 attempts, should never ask again
      shouldAsk = false;
    } else {
      if (!this.currentPrivacyTimer.timerDate) {
        //first time since reset
        shouldAsk = true;
      } else {
        //compare current date to stored date
        let currentDate: number = moment().valueOf();
        let timerDate: number = this.currentPrivacyTimer.timerDate;
        shouldAsk = (currentDate >= timerDate);
      }
    }
    return shouldAsk;
  }

  /**
   * Delays the timer inside currentPrivacyTimer to fit the next attempt
   */
  public delayPrivacyPermission(): void {
    this.currentPrivacyTimer.attempts++;
    //this.currentPrivacyTimer.timerDate = moment().valueOf() + 2592000000 * this.currentPrivacyTimer.attempts;
    this.currentPrivacyTimer.timerDate = moment().valueOf() + 60000 * this.currentPrivacyTimer.attempts;
    this.setPrivacyTimer();
  }

  /**
   *  Resets privacy permissions
   */
  public resetPrivacyPermission(): void {
    this.currentPrivacyTimer = this.getStartingTimer();
    this.setPrivacyTimer();
  }

  /**
   * Set the privacyTimer in the DB
   */
  public setPrivacyTimer(): void {
    this.appDataDB.set(APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS, this.currentPrivacyTimer).then(
      (answer) => {
        this.loggerService.info(this, `AppDataDB SET SUCCESS for: ${APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS} ${this.currentPrivacyTimer}.`);
      }, (error) => {
        this.loggerService.error(this, `AppDataDB SET FAIL for: ${APPLICATION_CONSTANTS.PRIVACY_POPUP_STATUS} ${this.currentPrivacyTimer}.`);
      });
  }

  /**
   * Gets the unique device Id from the DB if exists.
   */
  public getUniqueDeviceId(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.appDataDB.get(APPLICATION_CONSTANTS.BROWSER_X_GUID).then(
        (answer) => {
          resolve(answer);
        }, (error) => {
          reject(error);
        }
      )
    });
    return promise;
  }

  /**
   * Sets or updates the unique device Id in the DB.
   * @param id Value of the unique device id
   */
  public setUniqueDeviceId(id: string): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.appDataDB.set(APPLICATION_CONSTANTS.BROWSER_X_GUID, id).then(
        (answer) => {
          resolve(answer);
        }, (error) => {
          reject(error);
        }
      )
    });
    return promise;
  }
}