// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider } from '../../core/core.module';

// Services
import { NetworkService } from '../../providers/services/network.service';
import { AuthService } from '../../providers/services/auth.service';

// Models
import { BoardModel } from '../../core/model/board.model';

/**
 * Service that handles board information into/from server.
 */
@Injectable()
export class ApiBoardProvider extends ApiGenericProvider {

  /**
   * ApiBoardProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param networkService Network service
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, networkService: NetworkService, auth: AuthService) {
    super('board', http, networkService, auth);
  }

  /**
   * Function that gets all boards information.
   * @return List of all boards.
   */
  public getAllBoards(): Promise<BoardModel[]> {
    let promise = new Promise<any[]>((resolve, reject) => {
      this.get('').then(
        (response: BoardModel[]) => {
          resolve(response);
        }, (error) => {
          reject(error);
          //resolve(this.getMockBoards());
        }
      );
    });
    return promise;
  }

  /**
   * Function that gets the currently connected board information.
   * @return usb connected board.
   */
  public getUsbConnectedBoard(): Promise<BoardModel> {
    let promise = new Promise<any>((resolve, reject) => {
      this.get('/detect').then(
        (response: BoardModel) => {
          resolve(response);
        }, (error) => {
          reject(error);
        }
      );
    });
    return promise;
  }

}
