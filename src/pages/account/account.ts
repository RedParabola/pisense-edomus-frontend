//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar } from 'ionic-angular';

//Services
import { UserStore } from '../../providers/stores/user.store';
import { ToastService } from '../../providers/services/toast.service';

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
   * Current logged account.
   */
  public account: any;

  /**
   * Account page constructor.
   * @param userStore Store to handle user info.
   * @param toastService Controller to generate & present light notifications.
   */
  constructor(private userStore: UserStore, private toastService: ToastService) {
    this.account = this.userStore.getCurrentUser();
  }

  public logoutAccount(): void {
    this.userStore.logoutUser();
  }
}
