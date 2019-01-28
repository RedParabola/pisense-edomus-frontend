//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services

/**
 * Efficiency page.
 */
@IonicPage({ name: 'page-efficiency', segment: 'efficiency' })
@Component({ selector: 'page-efficiency', templateUrl: 'efficiency.html' })
export class EfficiencyPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Efficiency page constructor.
   */
  constructor() {
  }

}
