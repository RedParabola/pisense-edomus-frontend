//Basic
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

//Services
import { ApplicationDataStore } from '../providers/stores/application-data.store';
import { ConfigurationService } from './configuration.service';
import { ApiGenericProvider } from './api.service';
import { NetworkService } from '../providers/services/network.service';
import { AuthService } from '../providers/services/auth.service';

/**
 * Initialize the api to be exported and used.
 * @param http Angular http provider.
 * @param appDataStore Used to access to stored application info
 * @param networkService Network service
 * @param authService Service to provide authentication
 * @param baseUrl Base url of the end-point.
 * @param contextUri Context uri in case it exist.
 */

export function initializeEndpoint(appDataStore: ApplicationDataStore) {
  return () => appDataStore.initializeApiEndpoints();
}

export function apiFactory(http: HttpClient, networkService: NetworkService, auth: AuthService, baseUrl: string, contextUri: string = '') {
  return new ApiGenericProvider(`${baseUrl}${contextUri}`, http, networkService, auth);
}



/**
 * Module to export the core services of the application.
 */
@NgModule({
  imports: [CommonModule],
  exports: [],
  declarations: [],
  providers: [
    ConfigurationService,
    { provide: APP_INITIALIZER, useFactory: initializeEndpoint, deps: [ApplicationDataStore], multi: true },
    // REST
    { provide: ApiGenericProvider, useFactory: apiFactory, deps: [HttpClient] },
  ]
})
export class CoreModule { }

// Reexport all models
export * from './configuration.service';
export * from './api.service';
export * from './api-error/api-error';
export * from './api-error/api-error-not-found';
export * from './api-error/api-error-time-out';