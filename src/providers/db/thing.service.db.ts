//Basic
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//Services
import { StorageService } from '../services/storage.service';

//Config
import { thingConfig } from '../../config/config.module';

/**
 * thing database service to access to the persistance data.
 */
@Injectable()
export class ThingDatabaseService {

  /**
   * Thing database instance
   */
  private thingDatabase: Storage;

  /**
   * Construtor where we import all needed in the service.
   * @param storageService instance of the storage general service.
   */
  constructor(private storageService: StorageService) {
    this.thingDatabase = this.storageService.create(thingConfig.databaseConfig);
  }

  /**
   * Method to get a thing stored inside database.
   * @param key Primary key to get the value inside the database.
   */
  public get(key: string): Promise<any> {
    return this.storageService.get(this.thingDatabase, thingConfig.encryption, key);
  }

  /**
   * Method to set a thing inside database.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(key: string, value: any): Promise<any> {
    return this.storageService.set(this.thingDatabase, thingConfig.encryption, key, value);
  }

  /**
   * Method to get all the things from the database.
   */
  public getAll(): Promise<any> {
    return this.storageService.getAll(this.thingDatabase, thingConfig.encryption);
  }

  /**
   * Delete the thing of the key provided by parameter.
   * @param key Primary key to delete the value.
   */
  public remove(key: string) {
    return this.storageService.remove(this.thingDatabase, key);
  }

  /**
   * Delete all entries on the thing database.
   */
  public removeAll() {
    return this.storageService.removeAll(this.thingDatabase);
  }
}