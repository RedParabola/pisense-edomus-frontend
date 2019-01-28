//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services

/**
 * Account page.
 */
@IonicPage({ name: 'page-account', segment: 'account' })
@Component({ selector: 'page-account', templateUrl: 'account.html' })
export class AccountPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Account page constructor.
   */
  constructor() {
  }

}
