//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController } from 'ionic-angular';

//Services

/**
 * Menu page.
 */
@IonicPage({ name: 'page-menu', segment: 'menu' })
@Component({ selector: 'page-menu', templateUrl: 'menu.html' })
export class MenuPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Menu page constructor.
   * @param navCtrl Navigation controller to navigate to the options different pages.

   */
  constructor(private navCtrl: NavController) {
  }

  /**
   * 
   */
  public goToOption(pageToGo: string): void {
    this.navCtrl.push(pageToGo);
  }

}
