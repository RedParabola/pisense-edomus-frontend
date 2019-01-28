// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider, ConfigurationService } from '../../core/core.module';

// Services

// Models

// Constants

/**
 * Constants speficying Url to make calls to.
 */
const { prefixURLEndPoint, apiBaseEndpoint } = ConfigurationService.environment.$apiConfig;

/**
 * Service that handles link information into/from server.
 */
@Injectable()
export class ApiLinkProvider extends ApiGenericProvider {

  /**
   * ApiLinkProvider constructor
   * @param http Angular's http service to make calls against a server.
   */
  constructor(http: HttpClient) {
    super(`${prefixURLEndPoint}${apiBaseEndpoint}link`, http);
  }

  /**
   * Function that links a thing to a room.
   * @param thingId Thing id.
   * @param roomId Room id.
   */
  public linkRoom(thingId: string, roomId: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.create('', { thingId, roomId }).then(
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
