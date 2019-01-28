//Basic
import { Injectable } from '@angular/core';

//Models
import { AppConfiguration } from './model/appConfiguration.model';

/**
 * variable to get the environment from the window of the application.
 */
declare const appEnvironment: AppConfiguration;

/**
 * variable to access to the data of the package.json.
 */
declare const packageApp: any

/**
 * Service to publish the configuration of the environment.
 */
@Injectable()
export class ConfigurationService {

  /**
   * variable to bind the environment from the window to the service.
   */
  public static environment = appEnvironment;

  /**
   * variable to bind the package.json from the window to the service
   */
  public static packageApp = packageApp;
}
