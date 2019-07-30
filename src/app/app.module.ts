// Basic
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TitleCasePipe } from '@angular/common';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';

//Ionic Native
import { SplashScreen } from '@ionic-native/splash-screen';
import { Device } from '@ionic-native/device';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';
import { Globalization } from '@ionic-native/globalization';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AndroidPermissions } from '@ionic-native/android-permissions';

//ionic configuration
import { ionicConfig, mediaConfig, ResponsiveDefinition } from '../config/config.module';

//Translations
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

//Shared modules
import { SharedModule, MediaService } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';

//App
import { MyApp } from './app.component';
import { WizardThingModal } from '../components/modals/wizard-thing/wizard-thing.modal';
import { WizardRoomModal } from '../components/modals/wizard-room/wizard-room.modal';
import { WizardLinkModal } from '../components/modals/wizard-link/wizard-link.modal';

//Providers: Import the providers into the appModule in order to have a singleton of the application.
import { ApiUserProvider } from '../providers/api/api-user.service';
import { ApiRoomProvider } from '../providers/api/api-room.service';
import { ApiBoardProvider } from '../providers/api/api-board.service';
import { ApiThingProvider } from '../providers/api/api-thing.service';
import { ApiLinkProvider } from '../providers/api/api-link.service';

//Services
import { ResponsiveModule, ResponsiveConfig } from 'ng2-responsive';
import { InAppBrowserService } from '../providers/services/inAppBrowser.service'
import { StorageService } from '../providers/services/storage.service';
import { NetworkService } from '../providers/services/network.service';
import { UniqueDeviceIDService } from '../providers/services/unique-device-id.service';
import { AuthService } from '../providers/services/auth.service';
import { NavigationService } from '../providers/services/navigation.service';
import { ApplicationService } from '../providers/services/application.service';
import { LoadingService } from '../providers/services/loading.service';
import { ToastService } from '../providers/services/toast.service';
import { AlertService } from '../providers/services/alert.service';
import { ModalService } from '../providers/services/modal.service';
import { UtilsService } from '../providers/services/utils.service';
import { LoggerService } from '../providers/services/logger.service';

//Database: Import the databases into the appModule in order to have a singleton of the application.
import { UserDatabaseService } from '../providers/db/user.service.db'
import { ApplicationDataDatabaseService } from '../providers/db/application-data.service.db';
import { RoomDatabaseService } from '../providers/db/room.service.db'
import { BoardDatabaseService } from '../providers/db/board.service.db'
import { ThingDatabaseService } from '../providers/db/thing.service.db'

//Stores: Import the stores into the appModule in order to have a singleton of the application.
import { ApplicationDataStore } from '../providers/stores/application-data.store';
import { UserStore } from '../providers/stores/user.store';
import { RoomStore } from '../providers/stores/room.store';
import { BoardStore } from '../providers/stores/board.store';
import { ThingStore } from '../providers/stores/thing.store';

//Directives
import { OfflineReminder } from '../shared/offline-reminder/offline-reminder.service';

//Constants
import { USER_CONSTANTS } from '../core/constants/user.constants';

/**
 * The translate loader needs to know where to load i18n files
 * in Ionic's static asset pipeline.
 * @param http Angular httpClient provider.
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/locale-', '.json');
}

/**
 * Initialize the singleton of media service provider.
 */
export function provideMedia() {
  return new MediaService(mediaConfig);
}

export function jwtOptionsFactory(applicationDataStore, userDB) {
  return {
    tokenGetter: () => {
      return new Promise <string> ((resolve, reject) => {
        userDB.get(USER_CONSTANTS.TOKEN).then(
          (token) => resolve(token),
          (error) => resolve('')
        );
      });
    },
    whitelistedDomains: applicationDataStore.getWhitelistedDomains(),
    blacklistedRoutes: applicationDataStore.getBlacklistedRoutes(),
  }
}

/**
 * Main module where import the modules necesaries for run the application.
 */
@NgModule({
  declarations: [
    MyApp,
    WizardThingModal,
    WizardRoomModal,
    WizardLinkModal
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [ApplicationDataStore, UserDatabaseService],
      }
    }),
    ResponsiveModule,
    IonicModule.forRoot(MyApp, ionicConfig),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    SharedModule,
    CoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WizardThingModal,
    WizardRoomModal,
    WizardLinkModal
  ],
  providers: [

    //Native
    SplashScreen,
    Device,
    SQLite,
    BarcodeScanner,
    ScreenOrientation,
    Network,
    UniqueDeviceID,
    Diagnostic,
    Globalization,
    InAppBrowser,
    AndroidPermissions,
    TitleCasePipe,

    //Singleton providers
    ApiUserProvider,
    ApiRoomProvider,
    ApiBoardProvider,
    ApiThingProvider,
    ApiLinkProvider,

    //Singleton services
    InAppBrowserService,
    OfflineReminder,
    NetworkService,
    UniqueDeviceIDService,
    StorageService,
    AuthService,
    NavigationService,
    ApplicationService,
    LoadingService,
    ToastService,
    AlertService,
    ModalService,
    UtilsService,
    LoggerService,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: MediaService, useFactory: provideMedia },
    { provide: ResponsiveConfig, useFactory: ResponsiveDefinition },

    //database
    UserDatabaseService,
    ApplicationDataDatabaseService,
    RoomDatabaseService,
    BoardDatabaseService,
    ThingDatabaseService,

    //Stores
    UserStore,
    ApplicationDataStore,
    RoomStore,
    BoardStore,
    ThingStore
  ]
})
export class AppModule { }
