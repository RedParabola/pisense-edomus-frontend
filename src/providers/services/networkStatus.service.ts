//Basic
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Platform } from 'ionic-angular';

//Ionic Native
import { Network } from '@ionic-native/network';

/**
 * Network status service to know if the application has access to internet or not.
 */
@Injectable()
export class NetworkStatus {

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
   * Constructor where we import all needed in the service.
   * @param network plugin to know if the device is connected
   * @param platform Used to get information about your current device.
   */
  constructor(private network: Network, private platform: Platform) {
    this._onlineObserver = new BehaviorSubject(false);
    this._networkType = 'none';
  }

  public init(): void {
    if (this.platform.is('cordova')) {
      this.network.onchange().subscribe((status) => {
        this._setStatusByNetworkType();
        status.type === 'online'? this._onOnline(): this._onOffline();
      });
    } else {
      this._onlineObserver.next(navigator.onLine);
      window.addEventListener('online', () => { this._onOnline() }, false);
      window.addEventListener('offline', () => { this._onOffline() }, false);
    }
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

  //unknown, ethernet, wifi, 2g, 3g, 4g, cellular, none
  private _setStatusByNetworkType(): void {
    switch (this.network.type) {
      case '2g'||'3g'||'4g'||'cellular':
        this._networkType = 'data';
        break;
      case 'ethernet'||'wifi':
        this._networkType = 'lan';
        break;
      case 'unknown'||'none':
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
  }

  /**
   * Register a new callback to be executed when network turns down.
   */
  private _onOffline(): void {
    if (this.platform.is('cordova')) {
      this._currentNetworkStateCordova = false;
    }
    this._onlineObserver.next(false);
  }
}