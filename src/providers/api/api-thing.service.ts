// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider } from '../../core/core.module';

// Services
import { NetworkService } from '../../providers/services/network.service';
import { AuthService } from '../../providers/services/auth.service';

// Models
import { ThingModel, ThingDraftModel } from '../../core/model/thing.model';
import { CommandAnswerModel } from '../../core/model/command-answer.model';
import { CommandRequestModel } from '../../core/model/command-request.model';

/**
 * Service that handles thing information into/from server.
 */
@Injectable()
export class ApiThingProvider extends ApiGenericProvider {

  /**
   * ApiThingProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param networkService Network service
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, networkService: NetworkService, auth: AuthService) {
    super('thing', http, networkService, auth);
  }

  /**
   * Function that gets all things information.
   * @return List of all things.
   */
  public getAllThings(): Promise<ThingModel[]> {
    let promise = new Promise<any[]>((resolve, reject) => {
      this.get('').then(
        (response: ThingModel[]) => {
          resolve(response);
        }, (error) => {
          reject(error);
          //resolve(this.getMockThings());
        }
      );
    });
    return promise;
  }

  /**
   * Function that adds a new thing.
   * @param thingInfo Thing information.
   * @return newly created thing.
   */
  public addThing(thingInfo: ThingDraftModel): Promise<ThingModel> {
    let promise = new Promise<ThingModel>((resolve, reject) => {
      this.create('', thingInfo).then(
        (response: ThingModel) => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

  /**
   * Function that removes a thing.
   * @param thingId Thing id.
   */
  public deleteThing(thingId: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.delete('', thingId).then(
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
   * Function that renames a thing.
   * @param thingId Thing id.
   * @param newName New name for the thing.
   */
  public renameThing(thingId: string, newName: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      this.update('/rename', { newName }, thingId).then(
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
   * Function that sends a specific command for a given thing.
   * @param thingId id of the thing to modify.
   * @param command command to send to the given thing.
   * @return Answer to the requested command.
   */
  public setProperty(thingId: string, command: CommandRequestModel): Promise<CommandAnswerModel> {
    let promise = new Promise<CommandAnswerModel>((resolve, reject) => {
      this.update('/command', command, thingId).then(
        (response: CommandAnswerModel) => {
          resolve(response);
        }, (error) => {
          reject(error)
          //resolve(this.getMockCommandAnswer(command));
        }
      );
    });
    return promise;
  }

/*
  private getMockCommandAnswer(command: CommandRequestModel): CommandAnswerModel {
    const commandAnswer: CommandAnswerModel = {
      commandRequest: command,
      answer: 'OK'
    };
    return commandAnswer;
  }

  private getMockThings(): ThingModel[] {
    const thingList: ThingModel[] = [
      {
        id: 'light1',
        type: ThingModel.LIGHT,
        customName: 'My new Light',
        model: 'Mock-Light v1.0',
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
      },
      {
        id: 'light2',
        type: ThingModel.LIGHT,
        customName: 'My mock light',
        model: 'Mock-Light v1.0',
        typeProperties: {
          powerType: LightModel.BINARY,
          powerStatus: LightModel.OFF
        }
      }
    ];
    return thingList;
  }
*/

}
