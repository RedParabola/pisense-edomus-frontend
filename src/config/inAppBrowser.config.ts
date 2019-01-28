//Ionic Native
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';

/**
 * Constant with the inAppBrowser plugin configuration.
 */
export const defaultInAppBrowserOptions: InAppBrowserOptions = {
  location: 'yes',
  clearcache: 'yes',
  footer: 'yes',
  disallowoverscroll: 'no',
  keyboardDisplayRequiresUserAction: 'yes'
}