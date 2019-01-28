/**
 * Model for the app endpoint configuration.
 */
export interface AppConfiguration {

  /**
   * Environment configuration
   */
  $environment: AppConfiguration.AppEnvironment;

  /**
   * App information
   */
  appInfo: AppConfiguration.AppInfo;

  /**
   * HTML 5 base ref.
   */
  html5BaseHref: string;

  /**
   * Api environment configuration.
   */
  $apiConfig: AppConfiguration.ApiDefinition;

};


namespace AppConfiguration {

  /**
   * Application info
   */
  export interface AppInfo {

    /**
     * Application bundle id.
     */
    id: string;

  }

  /**
  * Environment configuration model inside the AppConfiguration namespace.
  */
  export interface AppEnvironment {
    
    /**
     * Name of the environment.
     */
    name: string;

    /**
     * Boolean to know if the application is on production environment.
     */
    isProduction: boolean;

  }

  /**
  * Endpoint configuration model inside the AppConfiguration namespace.
  */
  export interface ApiDefinition {

    /**
     * Base URL of the endpoint.
     */
    prefixURLEndPoint: string;

    /**
     * Security Base URL of the endpoint.
     */
    securityEndpoint: string;

    /**
     * Api base endpoint.
     */
    apiBaseEndpoint: string;

    /**
     * Api version endpoint.
     */
    apiVersion: string;
    
  }
}