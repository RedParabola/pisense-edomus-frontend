//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services
import { ApplicationDataStore } from '../../providers/stores/application-data.store';

/**
 * Settings page.
 */
@IonicPage({ name: 'page-settings', segment: 'settings' })
@Component({ selector: 'page-settings', templateUrl: 'settings.html' })
export class SettingsPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Home LAN parameters.
   */
  public homeLanInfo: any;

  /**
   * Settings page constructor.
   * @param appDataStore Used to access to stored application info
   */
  constructor(private appDataStore: ApplicationDataStore) {
    this.homeLanInfo = this.appDataStore.getHomeLanInfo();
  }

  public updateHomeLanInfo(): void {
    this.appDataStore.updateHomeLanInfo().then(
      (answer) => {
        this.homeLanInfo = answer;
      }, () => {

    });
  }
}
