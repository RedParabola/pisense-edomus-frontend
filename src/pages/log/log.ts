//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services

/**
 * Log page.
 */
@IonicPage({ name: 'page-log', segment: 'log' })
@Component({ selector: 'page-log', templateUrl: 'log.html' })
export class LogPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Log page constructor.
   */
  constructor() {

  }

}
