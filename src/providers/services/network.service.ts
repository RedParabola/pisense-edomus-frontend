//Basic
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Platform } from 'ionic-angular';

//Ionic Native
import { Network } from '@ionic-native/network';
import { AndroidPermissions } from '@ionic-native/android-permissions';

// Services
import { LoadingService } from './loading.service';

/**
 * WifiWizard2 module helps in getting LAN info such as SSID and MAC Address.
 */
declare let WifiWizard2: any;

/**
 * Network status service to know if the application has access to internet or not.
 */
@Injectable()
export class NetworkService {

  /**
   * Observer with the value of the current network status
   */
  private _onlineObserver: BehaviorSubject<boolean>;

  /**
   * the state of the actual network
   */
  private _currentNetworkStateCordova: boolean;

  /**
   * the current network type, whether it is 'data', 'lan' or 'none'
   */
  private _networkType: string;

  /**
   * current LAN info such as MAC address and SSID
   */
  private currentLanInfo: any;

  /**
   * home LAN info
   */
  private homeLanInfo: any;

  /**
   * local network url
   */
  private localNetworkUrl: string;

  /**
   * remote network url
   */
  private remoteNetworkUrl: string;

  /**
   * Constructor where we import all needed in the service.
   * @param network plugin to know if the device is connected
   * @param androidPermissions plugin to check android permissions regarding wifi detection
   * @param platform Used to get information about your current device.
   * @param loadingService Service used to generate a loading dialog
   */
  constructor(private network: Network, private androidPermissions: AndroidPermissions, private platform: Platform, private loadingService: LoadingService) {
    this._onlineObserver = new BehaviorSubject(false);
    this._networkType = 'none';
    this.currentLanInfo = {};
    this.homeLanInfo = {};
    this.localNetworkUrl = '';
    this.remoteNetworkUrl = '';

    if (this.platform.is('android') && ! this.platform.is('mobileweb')) {
      // TODO: Should warn user that android 8+ needs GPS permission and GPS turned ON
      // to provide you of SSID & MAC for security purposes.
      this.androidPermissions.requestPermissions([
        this.androidPermissions.PERMISSION.ACCESS_WIFI_STATE,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ]);
    }
  }

  public init(): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let isOnline: boolean;
      if (this.platform.is('cordova')) {
        isOnline = this.network.type !== 'none' && this.network.type !== 'unknown';
      } else {
        isOnline = navigator.onLine;
      }
      this._setStatusByNetworkType();
      if (this._isLAN()) {
        this._updateWifiInfo().then(
          () => {
            this._onlineObserver.next(isOnline);
            this.listenToNetworkChanges();
            resolve();
          });
      } else {
        this._onlineObserver.next(isOnline);
        this.listenToNetworkChanges();
        resolve();
      }
    });
    return promise;
  }

  public setNetworkUrls(local: string, remote: string): void {
    this.localNetworkUrl = local;
    this.remoteNetworkUrl = remote;
  }

  public setHomeLanInfo(lanInfo: any): void {
    this.homeLanInfo = lanInfo;
  }

  public getLocalNetworkUrl(): string {
    return this._getLocalNetworkUrl();
  }

  private _getLocalNetworkUrl(): string {
    return this.localNetworkUrl;
  }

  public getRemoteNetworkUrl(): string {
    return this._getRemoteNetworkUrl();
  }

  private _getRemoteNetworkUrl(): string {
    return this.remoteNetworkUrl;
  }

  public getActiveNetworkUrl(): string {
    let url: string;
    if (this._isDataNetwork() || this._isExternalLAN()) {
      url = this._getRemoteNetworkUrl();
    } else if (this._isLAN()) {
      url = this._getLocalNetworkUrl();
    }
    return url;
  }

  public getCurrentLanInfo(): any {
    return this.currentLanInfo;
  }

  /**
   * whether the network is considered online or not.
   */
  public isOnline(): boolean {
    if (this.platform.is('cordova')) {
      return this._currentNetworkStateCordova;
    } else {
      return navigator.onLine;
    }
  }

  /**
   * whether the network is considered offline or not.
   */
  public isOffline(): boolean {
    if (this.platform.is('cordova')) {
      return this._currentNetworkStateCordova;
    } else {
      return !navigator.onLine;
    }
  }

  /**
   * Returns an observable to know the changes on the network.
   */
  public onlineObserver(): Observable<boolean> {
    return this._onlineObserver.asObservable();
  }

  public isDataNetwork(): boolean {
    return this._isDataNetwork();
  }

  private _isDataNetwork(): boolean {
    return this._networkType === 'data';
  }

  public isLAN(): boolean {
    return this._isLAN();
  }

  private _isLAN(): boolean {
    return this._networkType === 'lan';
  }

  private _isExternalLAN(): boolean {
    return (this.currentLanInfo.bssid !== this.homeLanInfo.bssid) || (this.currentLanInfo.ssid !== this.homeLanInfo.ssid);
  }

  private listenToNetworkChanges(): void {
    if (this.platform.is('cordova')) {
      this.network.onchange().subscribe((status) => {
        this._setStatusByNetworkType();
        status.type === 'online' ? this._onOnline() : this._onOffline();
      });
    } else {
      window.addEventListener('online', () => { this._onOnline() }, false);
      window.addEventListener('offline', () => { this._onOffline() }, false);
    }
  }

  //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
  private _setStatusByNetworkType(): void {
    switch (this.network.type) {
      case '2g':
      case '3g':
      case '4g':
      case 'cellular':
        this._networkType = 'data';
        break;
      case 'ethernet':
      case 'wifi':
        this._networkType = 'lan';
        break;
      case 'unknown':
      case 'none':
        this._networkType = 'none';
        break;
      default:
        break;
    }
  }

  private _updateWifiInfo(): Promise <any> {
    const promise: Promise<any> = new Promise<any>((resolve, reject) => {
      const ssidPromise: Promise<any> = WifiWizard2.getConnectedSSID().then(
        (answer) => this.currentLanInfo.ssid = answer,
        () => this.currentLanInfo.ssid = undefined
      );
      const macPromise: Promise<any> = WifiWizard2.getConnectedBSSID().then(
        (answer) => this.currentLanInfo.bssid = answer,
        () => this.currentLanInfo.bssid = undefined
      );
      Promise.all([ssidPromise, macPromise]).then(resolve, resolve);
    });
    return promise;
  }

  /**
   * Register a new callback to be executed when network turns up.
   */
  private _onOnline(): void {
    if (this.platform.is('cordova')) {
      this._currentNetworkStateCordova = true;
      if (this._isLAN()) {
        this._updateWifiInfo().then(() => this._onlineObserver.next(true));
      } else {
        this.currentLanInfo = {};
        this._onlineObserver.next(true);
      }
    } else {
      this._onlineObserver.next(true);
    }
    this.loadingService.dismiss(true);
  }

  /**
   * Register a new callback to be executed when network turns down.
   */
  private _onOffline(): void {
    if (this.platform.is('cordova')) {
      this._currentNetworkStateCordova = false;
      this.currentLanInfo = {};
    }
    this._onlineObserver.next(false);
    this.loadingService.show({
      content: 'Please, reconnect to Data or Wifi network to continue using the app.'
    }, true);
  }
}