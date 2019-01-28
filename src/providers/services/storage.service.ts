//Basic
import { Injectable } from '@angular/core';
import { Storage, StorageConfig } from '@ionic/storage';

//Services
import { LoggerService } from '../../providers/services/logger.service'

//Constants
import { SECRET } from '../../core/constants/storage.constants';

//Encripter library
import { AES, enc } from 'crypto-js';

/**
 * Service to handler the storage with the application.
 */
@Injectable()
export class StorageService {

  /**
   * Construtor where we import all needed in the service.
   * @param loggerService logger service
   */
  constructor(private loggerService: LoggerService) { }

  /**
   * Method to create a new database with a custom configuration.
   * @param config Database configuration.
   */
  public create(config: StorageConfig): Storage {
    return new Storage(config);
  }

  /**
   * Method to get an object stored inside database and decript.
   * @param storage storage instance
   * @param encryption if the database has encryption.
   * @param key Primary key to get the value inside the database.
   */
  public get(storage: Storage, encryption: boolean, key: string): Promise<any> {
    return this._get(storage, encryption, key);
  }

  /**
   * Method to set an object stored inside database and encript.
   * @param storage storage instance
   * @param encryption if the database has encryption.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(storage: Storage, encryption: boolean, key: string, value: any): Promise<any> {
    if (encryption) { //If database is encrypted...
      return storage.set(key, AES.encrypt(JSON.stringify(value), SECRET).toString());
    } else {
      return storage.set(key, value);
    }
  }

  /**
   * Method to get everything stored inside database and decript.
   * @param storage storage instance
   * @param encryption if the database has encryption.
   */
  public getAll(storage: Storage, encryption: boolean): Promise<any> {
    return storage.keys().then(keys => Promise.all(keys.map(k => this._get(storage, encryption, k))));
  }

  /**
   * Delete the value of the key provided by parameter.
   * @param storage storage instance
   * @param key Primary key to delete the value
   */
  public remove(storage: Storage, key: string) {
    return storage.remove(key);
  }

  /**
   * remoove all the storage.
   * @param storage storage instance.
   */
  public removeAll(storage: Storage): Promise<any> {
    return storage.clear();
  }

  /**
   * Private method to get an object stored inside database and decript.
   * @param storage storage instance
   * @param encryption if the database has encryption.
   * @param key Primary key to get the value inside the database.
   */
  private _get(storage: Storage, encryption: boolean, key: string): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      storage.get(key).then((value) => {
        if (value) {
          if (encryption) { //If database is encrypted...
            try {
              resolve(JSON.parse(AES.decrypt(value, SECRET).toString(enc.Utf8)));
            } catch (exception) {
              resolve(AES.decrypt(value, SECRET).toString(enc.Utf8));
            }
          } else {
            try {
              resolve(JSON.parse(value));
            } catch (exception) {
              resolve(value);
            }
          }
        } else {
          reject();
        }
      }, (error) => {
        this.loggerService.error(this, error);
      });
    });
    return promise;
  }

}
