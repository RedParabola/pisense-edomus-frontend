//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services
import { NavigationService } from '../../providers/services/navigation.service';

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
   * @param navigationService Navigation service to navigate through the app.

   */
  constructor(private navigationService: NavigationService) {
  }

  /**
   * 
   */
  public goToOption(pageToGo: string): void {
    this.navigationService.goTo(pageToGo);
  }

}
