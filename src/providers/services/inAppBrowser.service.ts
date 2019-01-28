//Basic
import { Injectable } from '@angular/core';

//Ionic Native
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser';

//Config
import { defaultInAppBrowserOptions } from '../../config/config.module';

/**
 * Service to generate an abstract class between the inAppPlugin and the application.
 */
@Injectable()
export class InAppBrowserService {

  /**
   * Default option if no options provided for In App Browser
   */
  private defaultOptionsIab: InAppBrowserOptions;

  /**
   * Construtor where we import all needed in the service.
   * @param iab InAppBrowser plugin injection.
   */
  constructor(private iab: InAppBrowser) {
    this.defaultOptionsIab = defaultInAppBrowserOptions;
  }

  /**
   * Opens a URL in a new InAppBrowser or Safari view controller instance, the current browser instance, or the system browser.
   * @param url The URL to load
   * @param target The target in which to load the URL, an optional parameter that defaults to _self.
   * @param specificOptionsIab  Options for the InAppBrowser.
   */
  public create(url: string, targetIab?: string, specificOptionsIab?: InAppBrowserOptions): InAppBrowserObject {
    let options = specificOptionsIab || this.defaultOptionsIab;
    let target = targetIab || '_system';
    return this.iab.create(url, target, options);
  }
}
