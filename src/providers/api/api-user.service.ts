// Basic
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiGenericProvider, ConfigurationService } from '../../core/core.module';

// Services
import { AuthService } from '../../providers/services/auth.service';

// Models
import { UserModel } from '../../core/model/user.model';

// Constants

/**
 * Constants speficying Url to make calls to.
 */
const { prefixURLEndPoint, apiBaseEndpoint } = ConfigurationService.environment.$apiConfig;

/**
 * Service that handles user information into/from server.
 */
@Injectable()
export class ApiUserProvider extends ApiGenericProvider {

  /**
   * ApiUserProvider constructor
   * @param http Angular's http service to make calls against a server.
   * @param authService Service to provide authentication
   */
  constructor(http: HttpClient, auth: AuthService) {
    super(`${prefixURLEndPoint}${apiBaseEndpoint}user`, http, auth);
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
