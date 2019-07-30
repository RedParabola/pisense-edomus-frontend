// Basic
import { Component, ViewChild } from '@angular/core';
import { ViewController, Slides, NavParams } from 'ionic-angular';
import { Subscription } from 'rxjs';

// Services
import { RoomStore } from '../../../providers/stores/room.store';
import { ThingStore } from '../../../providers/stores/thing.store';
import { BoardStore } from '../../../providers/stores/board.store';
import { LoadingService } from '../../../providers/services/loading.service';
import { ToastService } from '../../../providers/services/toast.service';

// Models
import { RoomModel } from '../../../core/model/room.model';
import { BoardModel } from '../../../core/model/board.model';
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
   * Selected room to which thing will be linked.
   */
  public selectedRoom: RoomModel;

  /**
   * Sum up of the configuration.
   */
  public finalConfiguration: any;

  /**
   * Subscription to board detection.
   */
  private _boardDetection: Subscription;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param viewCtrl Controller to handle the current shown modal.
   * @param navParams navigation parameters.
   * @param roomStore Store for handling rooms.
   * @param boardStore Store for handling boards.
   * @param thingStore Store for handling things.
   * @param loadingService Service used to generate a loading dialog
   * @param toastService Service used to show toasts.
   */
  constructor(public viewCtrl: ViewController, public navParams: NavParams, private roomStore: RoomStore, private boardStore: BoardStore, private thingStore: ThingStore, private loadingService: LoadingService, private toastService: ToastService) {
    this.currentSlide = 0;
    this.linkingThing = this.navParams.get('linkingThing');
    this.roomList = [];
    this.finalConfiguration = {};
    this._boardDetection = null;
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
    } else if (this.slides.getPreviousIndex() === 2) {
      if (this.finalConfiguration.detectedBoard) {
        this.finalConfiguration.detectedBoard = null;
      }
      this.stopPollingUsbBoard();
    } 
    // ...towards active slide
    if (this.slides.getActiveIndex() === 2) {
      this.boardStore.startPollingUsbBoard();
      this._boardDetection = this.boardStore.detectedBoardObserver().subscribe(
        (board: BoardModel) => this.finalConfiguration.detectedBoard = board);
    }
  }

  public slideChanged() {
    this.currentSlide = this.slides.getActiveIndex();
  }

  public next() {
    if (this.currentSlide === 2) {
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
        if (this.finalConfiguration.assignedPin) { canSlide = true; }
        break;
      case 2:
        if (this.finalConfiguration.detectedBoard && this.finalConfiguration.detectedBoard.serialNumber) {
          canSlide = true;
        }
        break;
      default:
        break;
    }
    this.slides.lockSwipeToNext(!canSlide);
    return canSlide;
  }

  private stopPollingUsbBoard() {
    if (this._boardDetection) {
      this._boardDetection.unsubscribe();
      this.boardStore.stopPollingUsbBoard();
    }
  }

  private closeAndDiscard() {
    this.stopPollingUsbBoard();
    this.viewCtrl.dismiss();
  }

  private closeAndFinish() {
    this.stopPollingUsbBoard();
    this.loadingService.show({
      content: 'Linking... Be patient. Compilation and flash could take a couple minutes.'
    });
    this.thingStore.linkRoom(
      this.linkingThing,
      this.finalConfiguration.room.id,
      this.finalConfiguration.detectedBoard.serialNumber,
      this.finalConfiguration.assignedPin).then(
      () => {
        this.toastService.showToast({ message:
          `'${this.linkingThing.customName}' successfully linked to '${this.finalConfiguration.room.customName}' on board '${this.finalConfiguration.detectedBoard.id}' through pin '${this.finalConfiguration.assignedPin}'.` });
        this.loadingService.dismiss();
      },
      error => {
        this.toastService.showToast({ message: error });
        this.loadingService.dismiss();
      }
    );
    this.viewCtrl.dismiss();
  }

}
