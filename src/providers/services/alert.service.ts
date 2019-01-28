//Basic
import { Injectable } from '@angular/core';
import { Alert, AlertController, AlertOptions } from 'ionic-angular';

/**
 * Service to create generic alerts.
 */
@Injectable()
export class AlertService {

  /**
   * Alert service constructor.
   * @param alertController Instance of alert controller.
   */
  constructor(private alertController: AlertController) { }

  /**
   * Shows an alert with options.
   * @param options Alert options from @link https://ionicframework.com/docs/api/components/alert/AlertController/#advanced
   * @returns Alert item to be able to manipulate it.
   */
  public showAlert(options: AlertOptions): Alert {
    let alert = this.alertController.create(options);
    alert.present();
    return alert;
  }
}