//Basic
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

//Services
import { StorageService } from '../services/storage.service';

//Config
import { roomConfig } from '../../config/config.module';

/**
 * room database service to access to the persistance data.
 */
@Injectable()
export class RoomDatabaseService {

  /**
   * Room database instance
   */
  private roomDatabase: Storage;

  /**
   * Construtor where we import all needed in the service.
   * @param storageService instance of the storage general service.
   */
  constructor(private storageService: StorageService) {
    this.roomDatabase = this.storageService.create(roomConfig.databaseConfig);
  }

  /**
   * Method to get a room stored inside database.
   * @param key Primary key to get the value inside the database.
   */
  public get(key: string): Promise<any> {
    return this.storageService.get(this.roomDatabase, roomConfig.encryption, key);
  }

  /**
   * Method to set a room inside database.
   * @param key Primary key to be stored inside the database.
   * @param value Value to be stored inside the database
   */
  public set(key: string, value: any): Promise<any> {
    return this.storageService.set(this.roomDatabase, roomConfig.encryption, key, value);
  }

  /**
   * Method to get all the rooms from the database.
   */
  public getAll(): Promise<any> {
    return this.storageService.getAll(this.roomDatabase, roomConfig.encryption);
  }

  /**
   * Delete the room of the key provided by parameter.
   * @param key Primary key to delete the value.
   */
  public remove(key: string) {
    return this.storageService.remove(this.roomDatabase, key);
  }

  /**
   * Delete all entries on the room database.
   */
  public removeAll() {
    return this.storageService.removeAll(this.roomDatabase);
  }
}