//Basic
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//Services
import { StorageService } from '../services/storage.service';

//Config
import { userConfig } from '../../config/config.module';

/**
 * user database service to access to the persistance data.
 */
@Injectable()
export class UserDatabaseService {

  /**
   * User database instance
   */
  private userDatabase: Storage;

  /**
   * Construtor where we import all needed in the service.
   * @param storageService instance of the storage general service.
   */
  constructor(private storageService: StorageService) {
    this.userDatabase = this.storageService.create(userConfig.databaseConfig);
  }

  /**
   * Method to get a user stored inside database.
   * @param key Primary key to get the value inside the database.
   */
  public get(key: string): Promise<any> {
    return this.storageService.get(this.userDatabase, userConfig.encryption, key);
  }

  /**
   * Method to set a user inside database.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(key: string, value: any): Promise<any> {
    return this.storageService.set(this.userDatabase, userConfig.encryption, key, value);
  }

  /**
   * Method to get all the users from the database.
   */
  public getAll(): Promise<any> {
    return this.storageService.getAll(this.userDatabase, userConfig.encryption);
  }

  /**
   * Delete the user of the key provided by parameter.
   * @param key Primary key to delete the value.
   */
  public remove(key: string) {
    return this.storageService.remove(this.userDatabase, key);
  }

  /**
   * Delete all entries on the user database.
   */
  public removeAll() {
    return this.storageService.removeAll(this.userDatabase);
  }
}