//Basic
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//Services
import { StorageService } from '../services/storage.service';

//Config
import { applicationDataConfig } from '../../config/config.module';

/**
 * Application data database service to access to the persistance data.
 */
@Injectable()
export class ApplicationDataDatabaseService {

  /**
   * Application data database instance
   */
  private applicationDataDatabase: Storage;

  /**
   * Constructor where we import all needed in the service.
   * @param storageService instance of the storage general service.
   */
  constructor(private storageService: StorageService) {
    this.applicationDataDatabase = this.storageService.create(applicationDataConfig.databaseConfig);
  }

  /**
   * Method to get an application data stored inside database.
   * @param key Primary key to get the value inside the database.
   */
  public get(key: string): Promise<any> {
    return this.storageService.get(this.applicationDataDatabase, applicationDataConfig.encryption, key);
  }

  /**
   * Method to set an application data inside database.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(key: string, value: any): Promise<any> {
    return this.storageService.set(this.applicationDataDatabase, applicationDataConfig.encryption, key, value);
  }

  /**
   * Delete the application data of the key provided by parameter.
   * @param key Primary key to delete the value.
   */
  public remove(key: string) {
    return this.storageService.remove(this.applicationDataDatabase, key);
  }

}