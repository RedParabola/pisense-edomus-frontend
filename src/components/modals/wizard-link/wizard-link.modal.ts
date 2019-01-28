// Basic
import { Component, ViewChild } from '@angular/core';
import { ViewController, Slides, NavParams, LoadingController } from 'ionic-angular';

// Services
import { RoomStore } from '../../../providers/stores/room.store';
import { ThingStore } from '../../../providers/stores/thing.store';
import { ToastService } from '../../../providers/services/toast.service';

// Models
import { RoomModel } from '../../../core/model/room.model';
import { ThingModel } from '../../../core/model/thing.model';

/**
 * Component for the wizard link modal in the builder menu.
 */
@Component({ selector: 'wizard-link-modal', templateUrl: 'wizard-link.modal.html' })
export class WizardLinkModal {

  @ViewChild(Slides) slides: Slides;

  /**
   * Current slide number.
   */
  private currentSlide: number;

  /**
   * List of existing rooms.
   */
  public roomList: RoomModel[];

  /**
   * Thing that will be linked.
   */
  public linkingThing: ThingModel;

  /**
   * Selected type for the thing.
   */
  public selectedRoom: RoomModel;

  /**
   * Sum up of the configuration.
   */
  public finalConfiguration: any;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param loadingController Controller to generate a loading dialog.
   * @param viewCtrl Controller to handle the current shown modal.
   * @param navParams navigation parameters.
   * @param roomStore Store for handling rooms.
   * @param thingStore Store for handling things.
   * @param toastService Controller to generate & present light notifications.
   */
  constructor(private loadingController: LoadingController, public viewCtrl: ViewController, public navParams: NavParams, private roomStore: RoomStore, private thingStore: ThingStore, private toastService: ToastService) {
    this.currentSlide = 0;
    this.linkingThing = this.navParams.get('linkingThing');
    this.roomList = [];
    this.finalConfiguration = {};
    this.roomStore.roomsChange().subscribe(
      (storeRooms: RoomModel[]) => this.roomList = Object.assign([], storeRooms));
  }

  /**
   * Slide action fixed but not started yet.
   * Previous index is the starting one.
   * Active is the final one.
   */
  public slideWillChange() {
    // Leaving previous slide...
    if (this.slides.getPreviousIndex() === 0) {
      if (this.selectedRoom !== this.finalConfiguration.room) {
        this.finalConfiguration.room = this.selectedRoom;
      }
    }
    // ...towards active slide
  }

  public slideChanged() {
    this.currentSlide = this.slides.getActiveIndex();
  }

  public next() {
    if (this.currentSlide === 1) {
      this.closeAndFinish();
    } else {
      this.slides.slideNext(250);
    }
  }

  public back() {
    if (this.currentSlide === 0) {
      this.closeAndDiscard();
    } else {
      this.slides.slidePrev(250);
    }
  }

  public canSlideNext() {
    let canSlide: boolean = false;
    switch (this.currentSlide) {
      case 0:
        if (this.selectedRoom) { canSlide = true; }
        break;
      case 1:
        canSlide = true;
        break;
      default:
        break;
    }
    this.slides.lockSwipeToNext(!canSlide);
    return canSlide;
  }

  private closeAndDiscard() {
    this.viewCtrl.dismiss();
  }

  private closeAndFinish() {
    const loading = this.loadingController.create({
      content: 'Linking...'
    });
    loading.present();
    this.thingStore.linkRoom(this.linkingThing, this.finalConfiguration.room.id).then(
      () => {
        this.toastService.showToast({ message: `'${this.linkingThing.customName}' successfully linked to '${this.finalConfiguration.room.customName}'.` });
        loading.dismiss();
      },
      error => {
        this.toastService.showToast({ message: error });
        loading.dismiss();
      }
    );
    this.viewCtrl.dismiss();
  }

}
