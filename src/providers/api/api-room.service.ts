// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider, ConfigurationService } from '../../core/core.module';

// Services
import { AuthService } from '../../providers/services/auth.service';

// Models
import { RoomModel, RoomDraftModel } from '../../core/model/room.model';

/**
 * Constants speficying Url to make calls to.
 */
const { prefixURLEndPoint, apiBaseEndpoint } = ConfigurationService.environment.$apiConfig;

/**
 * Service that returns room information from server.
 */
@Injectable()
export class ApiRoomProvider extends ApiGenericProvider {

  /**
   * ApiRoomProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, auth: AuthService) {
    super(`${prefixURLEndPoint}${apiBaseEndpoint}room`, http, auth);
  }

  /**
   * Function that gets all rooms information.
   * @return List of all rooms.
   */
  public getAllRooms(): Promise<RoomModel[]> {
    let promise = new Promise<any[]>((resolve, reject) => {
      this.get('').then(
        (response: RoomModel[]) => {
          resolve(response);
        }, (error) => {
          reject(error);
          //resolve(this.getMockRooms());
        }
      );
    });
    return promise;
  }

  /**
   * Function that creates a new room.
   * @param roomInfo Room information.
   * @return newly created room.
   */
  public createRoom(roomInfo: RoomDraftModel): Promise<RoomModel> {
    let promise = new Promise<RoomModel>((resolve, reject) => {
      this.create('', roomInfo).then(
        (response: RoomModel) => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

  /**
   * Function that removes a room.
   * @param roomId Room id.
   */
  public deleteRoom(roomId: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.delete('', roomId).then(
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
   * Function that renames a room.
   * @param roomId Room id.
   * @param newName New name for the room.
   */
  public renameRoom(roomId: string, newName: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.update('/rename', { newName }, roomId).then(
        response => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

/*
  private getMockRooms(): RoomModel[] {
    const roomList: RoomModel[] = [
      {
        id: '11111',
        type: RoomModel.BEDROOM,
        customName: 'My nice bedroom',
        mainThingsId: { LIGHT: 'light1' },
        temperature: 26,
        humidity: 33,
        things: [
          {
            id: 'light1',
            type: ThingModel.LIGHT,
            model: 'Mock-Light v1.0',
            customName: 'My new Light',
            linkedRoomId: '11111',
            typeProperties: {
              powerType: LightModel.BINARY,
              powerStatus: LightModel.ON
            }
          },
          {
            id: 'ac1',
            type: ThingModel.AC,
            customName: 'My new AC',
            model: 'Super MockAir',
            linkedRoomId: '11111',
            typeProperties: {
              powerStatus: AirConditionerModel.ON,
              intensity: {
                currentValue: 3,
                defaultValue: 1,
                rangeMin: 1,
                rangeMax: 5,
                step: 1
              },
              temperature: {
                currentValue: 22,
                defaultValue: 24,
                rangeMin: 14,
                rangeMax: 34,
                step: 1
              },
            }
          }
        ]
      },
      {
        id: '22222',
        type: RoomModel.KITCHEN,
        customName: 'My lovely kitchen',
        mainThingsId: { LIGHT: 'light2' },
        things: [
          {
            id: 'light2',
            type: ThingModel.LIGHT,
            customName: 'My mock light',
            model: 'Mock-Light v1.0',
            linkedRoomId: '11111',
            typeProperties: {
              powerType: LightModel.BINARY,
              powerStatus: LightModel.OFF
            }
          }
        ]
      }
    ];
    return roomList;
  }
*/

}
