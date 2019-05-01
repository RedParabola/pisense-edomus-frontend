//Basic
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationService } from '../core/configuration.service';

//Errors
import { ApiError } from './api-error/api-error';
import { ApiErrorBadInput } from './api-error/api-error-bad-input';
import { ApiErrorNotFound } from './api-error/api-error-not-found';
import { ApiErrorTimeOut } from './api-error/api-error-time-out';

//RXJS
import { Observable } from 'rxjs/Observable';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';

// Services
import { NetworkService } from '../providers/services/network.service';
import { AuthService } from '../providers/services/auth.service';

// Constants
import { API_CONSTANTS } from '../core/constants/api.constants';

/**
 * Constants speficying Url to make calls to.
 */
const { domainURLEndPoint, apiBaseEndpoint } = ConfigurationService.environment.$apiConfig;

/**
 * Generic class for API management
 */
@Injectable()
export class ApiGenericProvider {

  /**
   * headers as an object
   */
  private headers: any;

  /**
   * URL to do the call to.
   */
  private url: string;

  /**
   * ApiGenericProvider constructor
   * @param serviceEndpoint service endpoint to append to url.
   * @param http HTTP service to do the calls.
   * @param networkService Network service
   * @param authService Service to provide authentication
   */
  constructor(protected serviceEndpoint: string, protected http: HttpClient, protected networkService: NetworkService, protected auth: AuthService) {
    this.headers = {};
    this.headers[API_CONSTANTS.CONTENT_TYPE] = API_CONSTANTS.JSON;
    this.networkService.onlineObserver().subscribe((isOnline) => {
      if (isOnline) {
        let activeNetworkUrl: string = this.networkService.getActiveNetworkUrl();
        if (activeNetworkUrl) {
          this.url = `${activeNetworkUrl}${apiBaseEndpoint}${serviceEndpoint}`;
        } else {
          this.url =`http://${domainURLEndPoint}/${apiBaseEndpoint}${serviceEndpoint}`;
        }
      }
    });
  }

  /**
   * Performs a GET call (if id given, appending id after url in the form: {url}{endpoint}/{id})
   * @param endpoint Additional specific endpoint of the request.
   * @param id Unique value from the object it wants to be retrieved.
   * @returns Promise that if resolved, will return call response.
   */
  protected get(endpoint: string, id?: string) {
    const headers: HttpHeaders = new HttpHeaders(this.headers);
    return this.http.get(id? `${this.url}${endpoint}/${encodeURIComponent(id)}`:`${this.url}${endpoint}`, { headers })
      .timeout(10000)
      .map(response => response)
      .catch((err) => this.handleError(err))
      .toPromise();
  }

  /**
   * Performs a POST call (if id given, appending id after url in the form: {url}{endpoint}/{id}) in order to create an object. Body call specifies object structure.
   * @param endpoint Additional specific endpoint of the request.
   * @param resource Structure specifying new object creation info.
   * @param id Unique value from the object it wants to be retrieved.
   * @returns Promise that if resolved, will return call response.
   */
  protected create(endpoint: string, resource: any, id?: string) {
    const headers: HttpHeaders = new HttpHeaders(this.headers);
    return this.http.post(id? `${this.url}${endpoint}/${encodeURIComponent(id)}`:`${this.url}${endpoint}`, JSON.stringify(resource),  { headers })
      .timeout(10000)
      .map(response => response)
      .catch((err) => this.handleError(err))
      .toPromise();
  }

  /**
   * Performs a PATCH call (if id given, appending id after url in the form: {url}{endpoint}/{id}) in order to update an object. Body call specifies object structure.
   * @param endpoint Additional specific endpoint of the request.
   * @param resource Object that needed info for the update.
   * @param id Unique value from the object it wants to be retrieved.
   * @returns Promise that if resolved, will return call response.
   */
  protected update(endpoint: string, resource: any, id?: string) {
    const headers: HttpHeaders = new HttpHeaders(this.headers);
    return this.http.put(id? `${this.url}${endpoint}/${encodeURIComponent(id)}`:`${this.url}${endpoint}`, JSON.stringify(resource),  { headers })
      .timeout(10000)
      .map(response => response)
      .catch((err) => this.handleError(err))
      .toPromise();
  }

  /**
   * Performs a DELETE call to {url}{endpoint}/{id} in order to remove an object.
   * @param endpoint Additional specific endpoint of the request.
   * @param id Unique value from the object specified.
   * @returns Promise that if resolved, will return call response.
   */
  protected delete(endpoint: string, id: string) {
    const headers: HttpHeaders = new HttpHeaders(this.headers);
    return this.http.delete(`${this.url}${endpoint}/${encodeURIComponent(id)}`,  { headers })
      .timeout(10000)
      .map(response => response)
      .catch((err) => this.handleError(err))
      .toPromise();
  }

  /**
   * Function that handles several different errors.
   * @param error error from response.
   */
  private handleError(error: Response) {
    if (error instanceof TimeoutError) {
      return Observable.throw(new ApiErrorTimeOut());
    } else if (error.status === 400) {
      return Observable.throw(new ApiErrorBadInput(error.json()));
    } else if (error.status === 401) {
      this.auth.onUnauthorizedRequest();
      return Observable.throw(new ApiError());
    } else if (error.status === 404) {
      return Observable.throw(new ApiErrorNotFound());
    } else {
      return Observable.throw(new ApiError(error));
    }
  }

}