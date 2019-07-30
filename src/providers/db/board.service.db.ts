//Basic
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//Services
import { StorageService } from '../services/storage.service';

//Config
import { boardConfig } from '../../config/config.module';

/**
 * board database service to access to the persistance data.
 */
@Injectable()
export class BoardDatabaseService {

  /**
   * Board database instance
   */
  private boardDatabase: Storage;

  /**
   * Construtor where we import all needed in the service.
   * @param storageService instance of the storage general service.
   */
  constructor(private storageService: StorageService) {
    this.boardDatabase = this.storageService.create(boardConfig.databaseConfig);
  }

  /**
   * Method to get a board stored inside database.
   * @param key Primary key to get the value inside the database.
   */
  public get(key: string): Promise<any> {
    return this.storageService.get(this.boardDatabase, boardConfig.encryption, key);
  }

  /**
   * Method to set a board inside database.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(key: string, value: any): Promise<any> {
    return this.storageService.set(this.boardDatabase, boardConfig.encryption, key, value);
  }

  /**
   * Method to get all the boards from the database.
   */
  public getAll(): Promise<any> {
    return this.storageService.getAll(this.boardDatabase, boardConfig.encryption);
  }

  /**
   * Delete the board of the key provided by parameter.
   * @param key Primary key to delete the value.
   */
  public remove(key: string) {
    return this.storageService.remove(this.boardDatabase, key);
  }

  /**
   * Delete all entries on the board database.
   */
  public removeAll() {
    return this.storageService.removeAll(this.boardDatabase);
  }
}