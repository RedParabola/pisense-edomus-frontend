//Basic
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Class for the Base Tabs Page.
 */
@IonicPage({ name: 'page-base-tabs', segment: 'base-tabs' })
@Component({ selector: 'page-base-tabs', templateUrl: 'base-tabs.html' })
export class BaseTabsPage {

  /**
   * The 3 root pages for the tabs
   */
  tab1Root = 'page-log';
  tab2Root = 'page-home';
  tab3Root = 'page-menu';
  startingIndex: string = '1';

  /**
   * 
   * @param navCtrl navigation controller.
   * @param navParams navigation parameters.
   */
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BaseTabsPage');
  }

}
