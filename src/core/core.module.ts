//Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

//Services
import { ConfigurationService } from './configuration.service';
import { ApiGenericProvider } from './api.service';

/**
 * Initialize the api to be exported and used.
 * @param http Angular http provider.
 * @param baseUrl Base url of the end-point.
 * @param contextUri Context uri in case it exist.
 */
export function apiFactory(http: HttpClient, baseUrl: string, contextUri: string = '') {
  return new ApiGenericProvider(`${baseUrl}${contextUri}`, http);
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