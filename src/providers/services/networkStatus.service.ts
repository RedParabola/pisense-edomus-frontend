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
   * Constructor where we import all needed in the service.
   * @param network plugin to know if the device is connected
   * @param platform Used to get information about your current device.
   */
  constructor(private network: Network, private platform: Platform) {
    // Dont care about the first state of the app, lets suppose that is online
    this._onlineObserver = new BehaviorSubject(true);
    this.platform.ready().then(() => { //We need to ensure that the plugins have been loaded (firefox issue)
      if (this.platform.is('cordova')) {
        this.network.type === 'none' ? this._onlineObserver.next(false) : this._onlineObserver.next(true);
        this.network.onchange().subscribe((status) => {
          if (status.type === 'online') {
            this._onlineObserver.next(true);
            this._currentNetworkStateCordova = true;
          } else {
            this._onlineObserver.next(false);
            this._currentNetworkStateCordova = false;
          }
        });
      } else {
        this._onlineObserver.next(navigator.onLine);
        this._onOnline(() => {
          this._onlineObserver.next(true);
        });
        this._onOffline(() => {
          this._onlineObserver.next(false);
        });
      }
    });
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

  /**
   * Register a new callback to be executed when network turns up.
   * @param cb callback
   */
  private _onOnline(cb: any): Function {
    let listener = cb;
    window.addEventListener('online', listener, false);
    return function deregisterOnOnline() {
      window.removeEventListener('online', listener);
    };
  }

  /**
   * Register a new callback to be executed when network turns down.
   * @param cb callback
   */
  private _onOffline(cb: any): Function {
    let listener = cb;
    window.addEventListener('offline', listener, false);
    return function deregisterOnOffline() {
      window.removeEventListener('offline', listener);
    };
  }
}