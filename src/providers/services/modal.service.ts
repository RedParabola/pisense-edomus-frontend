// Basic
import { Injectable } from '@angular/core';
import { ModalController, ModalOptions, Modal } from 'ionic-angular';

/**
 * Service to create generic modals.
 */
@Injectable()
export class ModalService {

  /**
   * Modal service constructor.
   * @param modalController Instance of modal controller.
   */
  constructor(public modalController: ModalController) { }

  /**
   * Shows a modal with options.
   * @param component Component to be shown as modal.
   * @param data Parameters to be sent to the modal.
   * @param options Modal options.
   * @returns Modal item to be able to manipulate it.
   */
  showModal(component: any, data: any, options: ModalOptions): Modal {
    options.enableBackdropDismiss = false;
    let modal = this.modalController.create(component, data, options);
    modal.present();
    return modal;
  }

}