//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services

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
   * Settings page constructor.
   */
  constructor() {
  }

}
