// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider } from '../../core/core.module';

// Services
import { NetworkService } from '../../providers/services/network.service';
import { AuthService } from '../../providers/services/auth.service';

// Models
import { UserModel } from '../../core/model/user.model';

/**
 * Service that handles user information into/from server.
 */
@Injectable()
export class ApiUserProvider extends ApiGenericProvider {

  /**
   * ApiUserProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param networkService Network status service
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, networkService: NetworkService, auth: AuthService) {
    super('user', http, networkService, auth);
  }

  /**
   * Function to register a new user.
   * @return the newly created user.
   */
  public register(credentials: any): Promise<UserModel> {
    let promise = new Promise<any>((resolve, reject) => {
      this.create('/register', credentials).then(
        () => resolve(),
        (error) => reject(error)
      );
    });
    return promise;
  }


  /**
   * Function to login a uuser.
   * @return the login credentials such a the new token.
   */
  public login(credentials: any): Promise<UserModel> {
    let promise = new Promise<any>((resolve, reject) => {
      this.create('/login', credentials).then(
        (answer) => resolve(answer),
        (error) => reject(error)
      );
    });
    return promise;
  }

}
