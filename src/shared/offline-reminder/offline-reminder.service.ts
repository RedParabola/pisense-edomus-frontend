//Basic
import { Injectable } from '@angular/core';

//Services
import { NetworkService } from '../../providers/services/network.service';

/**
 * Service to create the offline reminder.
 */
@Injectable()
export class OfflineReminder {

  /**
   * Element to add the offline icon into the body
   */
  private element: Element;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param networkService Network status provider
   */
  constructor(private networkService: NetworkService) {
    //create the div element
    this.element = document.createElement('div');
    this.element.classList.add('offline-reminder');


    //<i class="material-icons">signal_wifi_off</i>
    //Create the icon element
    let icon: Element = document.createElement('i');
    icon.classList.add('material-icons');
    let wifiText: Text = document.createTextNode('signal_wifi_off');
    icon.appendChild(wifiText);

    //Put the icon inside the div element
    this.element.appendChild(icon);
  }

  /**
   * Method to initialize the offline reminder service
   */
  public init() {
    this.networkService.onlineObserver().subscribe((isOnline) => {
      isOnline ? this._isOnline() : this._isOffline();
    });
  }

  /**
   * Method to remove the class if the app is online
   */
  private _isOnline() {
    document.body.getElementsByClassName('offline-reminder').length ? document.body.removeChild(this.element) : null;
  }

  /**
   * Method to add the class if the app is offline
   */
  private _isOffline() {
    document.body.appendChild(this.element);
  }
}