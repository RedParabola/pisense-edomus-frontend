// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider } from '../../core/core.module';

// Services
import { NetworkService } from '../../providers/services/network.service';
import { AuthService } from '../../providers/services/auth.service';

/**
 * Service that handles link information into/from server.
 */
@Injectable()
export class ApiLinkProvider extends ApiGenericProvider {

  /**
   * ApiLinkProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param networkService Network service
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, networkService: NetworkService, auth: AuthService) {
    super('link', http, networkService, auth);
  }

  /**
   * Function that links a thing to a room.
   * @param thingId Thing id.
   * @param roomId Room id.
   * @param boardSN Serial Number of the board in which we connect the thing.
   * @param boardPin The given board pin in which we connect the thing.
   */
  public linkRoom(thingId: string, roomId: string, boardSN: string, boardPin: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.create('', { thingId, roomId, boardSN, boardPin }).then(
        response => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

  /**
   * Function that unlinks a thing from its room.
   * @param thingId Thing id.
   * @param roomId Room id.
   */
  public unlinkRoom(thingId: string, roomId: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.update('', { thingId, roomId }).then(
        response => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

  /**
   * Function that flags a thing as main of its type in its room.
   * @param thingId Thing id.
   * @param thingType Thing type.
   * @param oldMainThingId Old main thing id.
   * @param roomId Room id.
   */
  public flagAsMainThing(thingId: string, thingType: string, oldMainThingId: string, roomId): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.update('/main', { thingId, thingType, oldMainThingId, roomId }).then(
        response => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

}
