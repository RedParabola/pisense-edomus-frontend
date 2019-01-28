// Basic
import { Component, ViewChild } from '@angular/core';
import { ViewController, Slides } from 'ionic-angular';

// Models
import { RoomModel, RoomDraftModel } from '../../../core/model/room.model';

// Constants
import { ROOM_CONSTANTS } from '../../../core/constants/room.constants';

/**
 * Component for the wizard room modal in the builder menu.
 */
@Component({ selector: 'wizard-room-modal', templateUrl: 'wizard-room.modal.html' })
export class WizardRoomModal {

  @ViewChild(Slides) slides: Slides;

  /**
   * Current slide number.
   */
  private currentSlide: number;

  /**
   * List of types.
   */
  public types: string[];

  /**
   * Selected type for the thing.
   */
  public selectedType: RoomModel.RoomType;

  /**
   * Final parameters for the new room draft.
   */
  private finalConfiguration: RoomDraftModel;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param viewCtrl Controller to handle the current shown modal.
   */
  constructor(public viewCtrl: ViewController) {
    this.currentSlide = 0;
    this.types = [];
    this.finalConfiguration = {} as RoomDraftModel;
    Object.keys(ROOM_CONSTANTS.NAME).forEach(type => {
      this.types.push(ROOM_CONSTANTS.NAME[type]);
    });
  }
  
  /**
   * Slide action fixed but not started yet.
   * Previous index is the starting one.
   * Active is the final one.
   */
  public slideWillChange() {
    // Leaving previous slide...
    if (this.slides.getPreviousIndex() === 0) {
      if (this.selectedType !== this.finalConfiguration.type) {
        this.finalConfiguration.type = this.selectedType;
      }
    }
    // ...towards active slide
    if (this.slides.getActiveIndex() === 1) {
      this.finalConfiguration.customName = 'My ' + this.finalConfiguration.type.toLowerCase();
    }
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
        if (this.selectedType) { canSlide = true; }
        break;
      case 1:
        if (this.finalConfiguration.customName) { canSlide = true; }
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
    this.viewCtrl.dismiss(this.finalConfiguration);
  }

}
