//Basic
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Platform } from 'ionic-angular';

//Ionic Native
import { Network } from '@ionic-native/network';

// Services
import { LoadingService } from './loading.service';

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
   * @param platform Used to get information about your current device.
   * @param loadingService Service used to generate a loading dialog
   */
  constructor(private network: Network, private platform: Platform, private loadingService: LoadingService) {
    this._onlineObserver = new BehaviorSubject(false);
    this._networkType = 'none';
    this.localNetworkUrl = '';
    this.remoteNetworkUrl = '';
  }

  public init(): void {
    let isOnline: boolean;
    if (this.platform.is('cordova')) {
      isOnline = this.network.type !== 'none' && this.network.type !== 'unknown';
    } else {
      isOnline = navigator.onLine;
    }
    this._setStatusByNetworkType();
    this._onlineObserver.next(isOnline);
    this.listenToNetworkChanges();
  }

  public setNetworkUrls(local: string, remote: string): void {
      this.localNetworkUrl = local;
      this.remoteNetworkUrl = remote;
  }

  public getLocalNetworkUrl(): string {
    return this.localNetworkUrl;
  }

  public getRemoteNetworkUrl(): string {
    return this.remoteNetworkUrl;
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
    return this._networkType === 'data';
  }

  public isLAN(): boolean {
    return this._networkType === 'lan';
  }

  private listenToNetworkChanges(): void {
    if (this.platform.is('cordova')) {
      this.network.onchange().subscribe((status) => {
        this._setStatusByNetworkType();
        status.type === 'online'? this._onOnline(): this._onOffline();
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

  /**
   * Register a new callback to be executed when network turns up.
   */
  private _onOnline(): void {
    if (this.platform.is('cordova')) {
      this._currentNetworkStateCordova = true;
    }
    this._onlineObserver.next(true);
    this.loadingService.dismiss(true);
  }

  /**
   * Register a new callback to be executed when network turns down.
   */
  private _onOffline(): void {
    if (this.platform.is('cordova')) {
      this._currentNetworkStateCordova = false;
    }
    this._onlineObserver.next(false);
    this.loadingService.show({
      content: 'Please, reconnect to Data or Wifi network to continue using the app.'
    }, true);
  }
}