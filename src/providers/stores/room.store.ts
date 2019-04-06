// Basic
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

// Api Services
import { RoomDatabaseService } from '../db/room.service.db';
import { ApiRoomProvider } from '../api/api-room.service';

// Services
import { AuthService } from '../services/auth.service';
import { NetworkStatus } from '../services/networkStatus.service';
import { LoggerService } from '../services/logger.service'

// Models
import { RoomModel, RoomDraftModel } from '../../core/model/room.model';

/**
 * Store to handle rooms.
 */
@Injectable()
export class RoomStore {

  /**
   * Observer to know if the room list change.
   */
  private _currentRoomsObservable: BehaviorSubject<RoomModel[]>

  /**
   * current room list.
   */
  private _currentRooms: RoomModel[]

  /**
   * Subscription to network status.
   */
  private _networkSubscription: Subscription;

  /**
   * Wether the app is currently connected or not.
   */
  private isOnline: boolean;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param roomDB Room database service
   * @param roomProvider Api room provider
   * @param authService Service to provide authentication
   * @param networkStatusService Network status service
   * @param loggerService logger service
   */
  constructor(private roomDB: RoomDatabaseService, private roomProvider: ApiRoomProvider, public auth: AuthService, private networkStatusService: NetworkStatus, private loggerService: LoggerService) {
    this._currentRoomsObservable = new BehaviorSubject<RoomModel[]>([]);
    this._currentRooms = [];
    this._networkSubscription = null;
  }

  public listenAuthenticationStatus(): void {
    this.auth.authenticationObserver().subscribe((status: boolean) => {
      if (status) {
        this._networkSubscription = this.networkStatusService.onlineObserver().subscribe((isOnline) => {
          this.isOnline = isOnline;
          this.synchronizeData();
        });
      } else if (this._networkSubscription) {
        this._networkSubscription.unsubscribe();
      }
    });
  }

  /**
   * when online, synchronize data with the remote changes in rooms
   */
  private synchronizeData(): void {
    if (this.isOnline) {
      const promiseArray: Promise<any>[] = [];
      // Get all rooms from remote service
      this.roomProvider.getAllRooms().then((rooms: RoomModel[]) => {
        // Save each room into the DB
        rooms.forEach(room => promiseArray.push(this.roomDB.set(room.id, room)));
        Promise.all(promiseArray).then(
          () => this.refreshList(),
          (error) => this.loggerService.error(this, `FAILED Set Room into DB.`, error)
        );
      }, (error) => this.loggerService.error(this, `FAILED Get All Rooms from API.`, error));
    }
  }

  /**
   * Retrieve the last DB values and set it as the current rooms
   */
  private refreshList(): Promise<any> {
    return this.roomDB.getAll().then((rooms: RoomModel[]) => {
      this._currentRooms = rooms;
      this._currentRoomsObservable.next(this._currentRooms);
    }, (error) => {
      this.loggerService.error(this, `FAILED Get All Rooms from DB.`, error);
    });
  }

  public getCurrentRoomById(roomId: string): RoomModel {
    return this._getCurrentRoomById(roomId);
  }

  private _getCurrentRoomById(roomId: string): RoomModel {
    return this._currentRooms.find((room: RoomModel) => {
      return room.id === roomId;
    });
  }

  /**
   * Method to know if the room list changes.
   */
  public roomsChange(): Observable<RoomModel[]> {
    return this._currentRoomsObservable.asObservable().share();
  }

  public createNewRoom(roomDraft: RoomDraftModel): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.roomProvider.createRoom(roomDraft)
        .then((room: RoomModel) => this.roomDB.set(room.id, room))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Set Room into DB.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public deleteRoom(roomId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.roomProvider.deleteRoom(roomId)
        .then(() => this.roomDB.remove(roomId))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process deleteRoom.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public renameRoom(room: RoomModel, newName: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.roomProvider.renameRoom(room.id, newName).then(
        () => {
          room.customName = newName;
          return this.roomDB.set(room.id, room)
        })
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process renameRoom.`, error);
          reject(error);
        });
    });
    return promise;
  }

  public updateRoomMainThing(roomId: string, thingId: string, thingType: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      const roomToUpdate = this._getCurrentRoomById(roomId);
      roomToUpdate.mainThingsId[thingType] = thingId;
      this.roomDB.set(roomId, roomToUpdate)
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process updateRoomMainThing.`, error);
          reject(error);
        });
    });
    return promise;
  }

  public linkThingToRoom(roomId: string, thingId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      const roomToUpdate = this._getCurrentRoomById(roomId);
      roomToUpdate.things[roomToUpdate.things.length] = thingId;
      this.roomDB.set(roomId, roomToUpdate)
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process addThingToRoom.`, error);
          reject(error);
        });
    });
    return promise;
  }

  public unlinkThingFromRoom(roomId: string, thingId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      const roomToUpdate = this._getCurrentRoomById(roomId);
      roomToUpdate.things = roomToUpdate.things.filter((thing) => {
        return thing !== thingId;
      });
      const thingType = Object.keys(roomToUpdate.mainThingsId).find(type => {
        return roomToUpdate.mainThingsId[type] === thingId;
      });
      if (thingType) {
        roomToUpdate.mainThingsId[thingType] = undefined;
      }
      this.roomDB.set(roomId, roomToUpdate)
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process unlinkThingFromRoom.`, error);
          reject(error);
        });
    });
    return promise;
  }

  public cleanUserRooms(): Promise<any> {
    this._currentRooms = [];
    this._currentRoomsObservable.next([]);
    return this.roomDB.removeAll();
  }
}