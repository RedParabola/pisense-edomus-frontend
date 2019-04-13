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
     * Strict domain and port of the endpoint.
     */
    domainURLEndPoint: string;

    /**
     * Whether it uses https or just http.
     */
    isHttpsProtocol: boolean;

    /**
     * Api base endpoint.
     */
    apiBaseEndpoint: string;

    /**
     * Api version endpoint.
     */
    apiVersion: string;

    /**
     * Routes blacklisted for current given api endpoint.
     */
    jwtBlacklistedRoutes: string[];
    
  }
}