//Basic
import { Injectable } from "@angular/core";
import { Platform } from 'ionic-angular';

//Ionic native
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

//Stores
import { ApplicationDataStore } from '../stores/application-data.store';

//Fingerprintjs2
import Fingerprint2 from "fingerprintjs2";

/**
 * Service to know the device's unique Id.
 */
@Injectable()
export class UniqueDeviceIDService {

  /**
   * the value of the device's unique Id
   */
  private _uniqueDeviceId: string;

  /**
   * Constructor where we import all needed in the service.
   * @param platform Used to get information about your current device.
   * @param appDataStore Used to access to stored application info
   * @param uniqueDeviceID plugin to know the device's unique Id.
¡   */
  constructor(private platform: Platform, private appDataStore: ApplicationDataStore, private uniqueDeviceID: UniqueDeviceID) { }

  /**
   * Checks if platform is android, ios or browser to initialize with what requires each platform.
   */
  public init(): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      if (this._uniqueDeviceId) {
        resolve();
      } else {
        if (this.platform.is('android') || this.platform.is('ios')) { //Meaning not in browser
          this.uniqueDeviceID.get().then(
            (uuid: any) => {
              this._uniqueDeviceId = uuid;
              resolve();
            }, (error) => {
              reject(error);
            });
        } else {
          this.appDataStore.getUniqueDeviceId().then(
            (response) => { //We use the stored X-Guid
              this._uniqueDeviceId = response;
              resolve();
            }, (error) => { //First time initiated, then still no X-Guid value
              let fingerprintOptions = {
                excludeSessionStorage: true,
                excludeIndexedDB: true,
                excludeAddBehavior: true,
                excludeOpenDatabase: true,
                excludeDoNotTrack: true,
                excludeAdBlock: true,
                excludeHasLiedLanguages: true,
                excludeHasLiedResolution: true,
                excludeHasLiedOs: true,
                excludeHasLiedBrowser: true,
                excludeJsFonts: true,
                excludeFlashFonts: true
              };
              new Fingerprint2(fingerprintOptions).get((result, components) => {
                //Store the newly created Unique Device Id
                this.appDataStore.setUniqueDeviceId(result).then(
                //this.applicationDataDB.set(APPLICATION_CONSTANTS.BROWSER_X_GUID, result).then(
                  (response) => { //We use the newly created stored Unique Device Id
                    this._uniqueDeviceId = result;
                    resolve();
                  }, (error) => {
                    reject();
                  });
              });
            });
        }
      }
    });
    return promise;
  }

  /**
   * Returns the device's unique id.
   */
  public getUniqueDeviceId(): string {
    return this._uniqueDeviceId;
  }

}