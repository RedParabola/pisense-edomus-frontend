// Basic
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

// Api Services
import { ThingDatabaseService } from '../db/thing.service.db';
import { ApiThingProvider } from '../api/api-thing.service';
import { ApiLinkProvider } from '../api/api-link.service';

// Services
import { RoomStore } from './room.store';
import { AuthService } from '../services/auth.service';
import { NetworkService } from '../services/network.service';
import { LoggerService } from '../services/logger.service'

// Models
import { ThingModel, ThingDraftModel, LightModel, AirConditionerModel, HumidifierModel } from '../../core/model/thing.model';
import { CommandRequestModel } from '../../core/model/command-request.model';
import { CommandAnswerModel } from '../../core/model/command-answer.model';

// Constants
import { COMMAND_CONSTANTS } from '../../core/constants/command.constants';

/**
 * Store to handle things.
 */
@Injectable()
export class ThingStore {

  /**
   * Observer to know if the thing list change.
   */
  private _currentThingsObservable: BehaviorSubject<ThingModel[]>

  /**
   * current thing list.
   */
  private _currentThings: ThingModel[]

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
   * @param roomStore Store for handling rooms.
   * @param thingDB Thing database service
   * @param thingProvider Api thing provider
   * @param linkProvider Api link provider
   * @param authService Service to provide authentication
   * @param networkService Network status service
   * @param loggerService logger service
   */
  constructor(private roomStore: RoomStore, private thingDB: ThingDatabaseService, private thingProvider: ApiThingProvider, private linkProvider: ApiLinkProvider, public auth: AuthService, private networkService: NetworkService, private loggerService: LoggerService) {
    this._currentThingsObservable = new BehaviorSubject<ThingModel[]>([]);
    this._currentThings = [];
    this._networkSubscription = null;
  }

  public isThingModelArray(arg: any): arg is ThingModel[] {
    return arg instanceof Array &&
      arg.every((element) => {
        return element.id !== undefined && element.typeProperties !== undefined
      });
  }

  public listenAuthenticationStatus(): void {
    this.auth.authenticationObserver().subscribe((status: boolean) => {
      if (status) {
        this._networkSubscription = this.networkService.onlineObserver().subscribe((isOnline) => {
          this.isOnline = isOnline;
          this.synchronizeData();
        });
      } else if (this._networkSubscription) {
        this._networkSubscription.unsubscribe();
      }
    });
  }

  /**
   * when online, synchronize data with the remote changes in things
   */
  private synchronizeData(): void {
    if (this.isOnline) {
      const promiseArray: Promise<any>[] = [];
      // Get all things from remote service
      this.thingProvider.getAllThings().then((things: ThingModel[]) => {
        // Save each thing into the DB
        things.forEach(thing => promiseArray.push(this.thingDB.set(thing.id, thing)));
        Promise.all(promiseArray).then(
          () => this.refreshList(),
          (error) => this.loggerService.error(this, `FAILED Set Thing into DB.`, error));
      }, (error) => this.loggerService.error(this, `FAILED Get All Things from API.`, error));
    }
  }

  /**
   * Retrieve the last DB values and set it as the current things
   */
  private refreshList(): Promise<any> {
    return this.thingDB.getAll().then((things: ThingModel[]) => {
      this._currentThings = things;
      this._currentThingsObservable.next(this._currentThings);
    }, (error) => {
      this.loggerService.error(this, `FAILED Get All Things from DB.`, error);
    });
  }

  private getCurrentThingById(thingId: string): ThingModel {
    return this._currentThings.find((thing: ThingModel) => {
      return thing.id === thingId;
    });
  }

  /**
   * Method to know if the thing list changes.
   */
  public thingsChange(): Observable<ThingModel[]> {
    return this._currentThingsObservable.asObservable().share();
  }

  public addNewThing(thingDraft: ThingDraftModel): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.thingProvider.addThing(thingDraft)
        .then((thing: ThingModel) => this.thingDB.set(thing.id, thing))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process addNewThing`, error);
          reject(error);
        });
    })
    return promise;
  }

  public deleteThing(thingId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.thingProvider.deleteThing(thingId)
        .then(() => this.thingDB.remove(thingId))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process deleteThing.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public renameThing(thing: ThingModel, newName: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.thingProvider.renameThing(thing.id, newName)
        .then(() => {
          thing.customName = newName;
          return this.thingDB.set(thing.id, thing);
        })
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `FAILED Process renameThing.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public flagAsMainThing(thing: ThingModel, oldMainThingId?: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      let oldMainThing: ThingModel;
      this.linkProvider.flagAsMainThing(thing.id, thing.type, oldMainThingId, thing.linkedRoomId)
        .then(() => {
          let promise: Promise<any>;
          if(!oldMainThingId) {
            promise = Promise.resolve();
          } else {
            oldMainThing = this.getCurrentThingById(oldMainThingId);
            oldMainThing.flaggedAsMain = false;
            promise = this.thingDB.set(oldMainThingId, oldMainThing);
          }
          return promise;
        })
        .then(() => {
          thing.flaggedAsMain = true;
          return this.thingDB.set(thing.id, thing);
        })
        .then(() => this.roomStore.updateRoomMainThing(thing.linkedRoomId, thing.id, thing.type))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `Failed Process flagAsMainThing.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public cleanUserThings(): Promise<any> {
    this._currentThings = [];
    this._currentThingsObservable.next([]);
    return this.thingDB.removeAll();
  }

  public linkRoom(thing: ThingModel, roomId: string): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      this.linkProvider.linkRoom(thing.id, roomId)
        .then(() => {
          thing.linkedRoomId = roomId;
          return this.thingDB.set(thing.id, thing);
        })
        .then(() => this.roomStore.linkThingToRoom(roomId, thing.id))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `Failed Process flagAsMainThing.`, error);
          reject(error);
        });
    })
    return promise;
  }

  public unlinkRoom(thing: ThingModel): Promise<any> {
    const promise: Promise<any> = new Promise((resolve, reject) => {
      const roomId: string = thing.linkedRoomId;
      this.linkProvider.unlinkRoom(thing.id, thing.linkedRoomId)
        .then(() => {
          thing.linkedRoomId = undefined;
          thing.flaggedAsMain = false;
          return this.thingDB.set(thing.id, thing);
        })
        .then(() => this.roomStore.unlinkThingFromRoom(roomId, thing.id))
        .then(() => this.refreshList())
        .then(() => resolve())
        .catch((error) => {
          this.loggerService.error(this, `Failed Process unlinkRoom.`, error);
          reject(error);
        });
    })
    return promise;
  }

  /**
   * turn on a given thing by its id
   */
  public turnOn(thing: ThingModel): Promise<any> {
    const commandReq: CommandRequestModel = {
      command: COMMAND_CONSTANTS.POWER.STATUS,
      value: ThingModel.ON
    } as CommandRequestModel;
    return this.setProperty(thing, commandReq);
  }

  /**
   * turn off a given thing by its id
   */
  public turnOff(thing: ThingModel): Promise<any> {
    const commandReq: CommandRequestModel = {
      command: COMMAND_CONSTANTS.POWER.STATUS,
      value: ThingModel.OFF
    } as CommandRequestModel;
    return this.setProperty(thing, commandReq);
  }

  /**
   * Method to set a given property to a given value on a given thingId
   * @param thingId the target thing
   * @param command the command to send
   */
  private setProperty(thing: ThingModel, command: CommandRequestModel): Promise<any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      this.thingProvider.setProperty(thing.id, command)
      .then((answer: CommandAnswerModel) => {
        this.updateThingWithCommand(thing, answer);
        return this.thingDB.set(thing.id, thing);
      })
      .then(() => this.refreshList())
      .then(() => resolve())
      .catch((error) => {
        this.loggerService.error(this, `Failed Process setProperty.`, error);
        reject(error);
      });
    });
    return promise;
  }

  private updateThingWithCommand(thing: ThingModel, command: CommandAnswerModel): void {
    switch (thing.type) {
      case ThingModel.LIGHT:
        this.updateLightWithCommand(thing, command);
        break;
      case ThingModel.AC:
        this.updateACWithCommand(thing, command);
        break;
      case ThingModel.HUMIDIFIER:
        this.updateHumidifierWithCommand(thing, command);
        break;
      default:
        break;
    }
  }

  private updateLightWithCommand(thing: ThingModel, command: CommandAnswerModel): void {
    switch (command.commandRequest.command) {
      case COMMAND_CONSTANTS.POWER.STATUS:
        thing.typeProperties.powerStatus = command.commandRequest.value === LightModel.ON?
          LightModel.ON : LightModel.OFF;
        break;
      default:
        break;
    }
  }

  private updateACWithCommand(thing: ThingModel, command: CommandAnswerModel): void {
    switch (command.commandRequest.command) {
      case COMMAND_CONSTANTS.POWER.STATUS:
        thing.typeProperties.powerStatus = command.commandRequest.value === AirConditionerModel.ON?
          AirConditionerModel.ON : AirConditionerModel.OFF;
        break;
      default:
        break;
    }
  }

  private updateHumidifierWithCommand(thing: ThingModel, command: CommandAnswerModel): void {
    switch (command.commandRequest.command) {
      case COMMAND_CONSTANTS.POWER.STATUS:
        thing.typeProperties.powerStatus = command.commandRequest.value === HumidifierModel.ON?
          HumidifierModel.ON : HumidifierModel.OFF;
        break;
      default:
        break;
    }
  }

}