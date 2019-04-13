// Basic
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

//Ionic native
import { SplashScreen } from '@ionic-native/splash-screen';

//Services
import { ApplicationService } from '../providers/services/application.service';
import { LoggerService } from '../providers/services/logger.service';

//Models
import { PageModel } from '../core/model/page.model';

/**
 * This component is the root of the application and provide us the sidebar.
 */
@Component({ selector: 'ion-app', templateUrl: 'app.html' })
export class MyApp {

  /**
   * Child navigation in our view can be accessed from our parent component easily.
   */
  @ViewChild(Nav) private nav: Nav;

  /**
   * The root page where the application will start
   */
  public rootPage: any = 'page-login';

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param platform Used to get information about your current device.
   * @param splashScreen Service to access to de splashScreen functionallity.
   * @param applicationService Service to get the application main functionality.
   * @param loggerService Logger service
   */
  constructor(private platform: Platform, private splashScreen: SplashScreen, private applicationService: ApplicationService, private loggerService: LoggerService) {
    // App set-up
    this._initializeApp();
  }

  /**
   * Main configurations of the app, here is configured all the related with the preconfiguration of the application.
   */
  private _initializeApp() {
    this.applicationService.initializeApplication().then(() => {
      if (this.platform.is('cordova')) {
        this.splashScreen.hide();
      }
    }, () => {
      this.loggerService.error(this, `App will not start correctly.`); 
    });
  }

  /**
   * Navigate to the page selected.
   * @param page page option selected
   */
  public openPage(page: PageModel) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != this.nav.getActive().id) {
      this.nav.setRoot(page.component);
    }
  }

}
