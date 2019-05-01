//Basic
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../../core/configuration.service';

//Api Services
import { ApplicationDataDatabaseService } from '../db/application-data.service.db';

//Services
import { NetworkService } from '../services/network.service';

//Constants
import { APPLICATION_CONSTANTS } from '../../core/constants/application-data.constants';

/**
 * Constants speficying Url to make calls to.
 */
const { domainURLEndPoint, isHttpsProtocol, apiBaseEndpoint, jwtBlacklistedRoutes } = ConfigurationService.environment.$apiConfig;

/**
 * Store to handle general application data.
 */
@Injectable()
export class ApplicationDataStore {

  /**
   * Home LAN info such as MAC Address and SSID
   */
  private homeLanInfo: any;

  /**
   * local api endpoint
   */
  private localApiEndpoint: string;

  /**
   * remote api endpoint
   */
  private remoteApiEndpoint: string;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param appDataDB application data database access.
   * @param networkService Network service
   */
  constructor(private appDataDB: ApplicationDataDatabaseService, private networkService: NetworkService) {
    this.appDataDB.get(APPLICATION_CONSTANTS.HOME_LAN_INFO).then(
      (answer) => this._setHomeLanInfo(answer),
      (error) => this._setHomeLanInfo({}),
    )
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

  public initializeApiEndpoints(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.appDataDB.get(APPLICATION_CONSTANTS.CUSTOM_API_ENDPOINT).then(
        (answer: any) => {
          this._setNetworkUrls(answer.local, answer.remote);
          console.log('API Endpoints located and loaded.');
          resolve();
        }, (error) => {
          this._setNetworkUrls(domainURLEndPoint, domainURLEndPoint);
          console.log('Could not find API Endpoints. Loading default local server value.');
          resolve();
        }
      );
    });
    return promise;
  }

  public storeApiEndpoints(local: string, remote: string): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.appDataDB.set(APPLICATION_CONSTANTS.CUSTOM_API_ENDPOINT, {local, remote}).then(
        (answer: any) => {
          this.localApiEndpoint = answer.local;
          this.remoteApiEndpoint = answer.remote;
          console.log('New API Endpoints were linked to the app. A restart is needed.');
          resolve();
        }, (error) => {
          reject();
        }
      );
    });
    return promise;
  }

  public getLocalEndpoint(): string {
    return this.localApiEndpoint;
  }

  public getRemoteEndpoint(): string {
    return this.remoteApiEndpoint;
  }

  public getWhitelistedDomains(): string[] {
    const domains: string[] = [
      this.localApiEndpoint,
      this.remoteApiEndpoint
    ]
    return domains;
  }

  public getBlacklistedRoutes(): string[] {
    const domains: string[] = [];
    jwtBlacklistedRoutes.forEach(element => {
      domains.push(this.localApiEndpoint + '/' + apiBaseEndpoint + element);
      domains.push(this.remoteApiEndpoint + '/' + apiBaseEndpoint + element);
    });
    return domains;
  }

  public getHomeLanInfo(): any {
    return this.homeLanInfo;
  }

  public updateHomeLanInfo(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      let currentLanInfo = this.networkService.getCurrentLanInfo();
      if (this.networkService.isLAN() && currentLanInfo.ssid && currentLanInfo.bssid) {
        this.appDataDB.set(APPLICATION_CONSTANTS.HOME_LAN_INFO, currentLanInfo).then(
          (answer: any) => {
            this._setHomeLanInfo(answer);
            console.log('Updated Home LAN info successfully.');
            resolve(this.homeLanInfo);
          }, (error) => {
            console.log('Something went wrong when trying to update Home LAN info.');
            reject();
          }
        );
      } else {
        reject('You need to be connected to a valid LAN.');
      }
    });
    return promise;
  }

  private _setHomeLanInfo(lanInfo: any): void {
    this.homeLanInfo = lanInfo;
    this.networkService.setHomeLanInfo(this.homeLanInfo);
  }

  private _setNetworkUrls(local: string, remote: string): void {
    this.localApiEndpoint = local;
    this.remoteApiEndpoint = remote;
    const finalLocalEndpoint: string = isHttpsProtocol? 'https://' + local + '/' : 'http://' + local + '/';
    const finalRemoteEndpoint: string = isHttpsProtocol? 'https://' + remote + '/' : 'http://' + remote + '/';
    this.networkService.setNetworkUrls(finalLocalEndpoint, finalRemoteEndpoint);
  }
}