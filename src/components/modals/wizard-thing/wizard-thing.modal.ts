// Basic
import { Component, ViewChild } from '@angular/core';
import { ViewController, Slides } from 'ionic-angular';
import { TitleCasePipe } from '@angular/common';

// Models
import { ThingDraftModel, ThingModel } from '../../../core/model/thing.model';

// Constants
import { THING_CONSTANTS, AVAILABLE_MODELS_BY_THING } from '../../../core/constants/thing.constants';

/**
 * Component for the wizard thing modal in the connect menu.
 */
@Component({ selector: 'wizard-thing-modal', templateUrl: 'wizard-thing.modal.html' })
export class WizardThingModal {

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
   * List of models.
   */
  public models: string[];

  /**
   * Selected type for the thing.
   */
  public selectedType: ThingModel.ThingType;

  /**
   * Selected model for the thing.
   */
  public selectedModel: string;

  /**
   * Final parameters for the new thing draft.
   */
  private finalConfiguration: ThingDraftModel;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param viewCtrl Controller to handle the current shown modal.
   * @param titleCasePipe Pipe for applying titlecase to strings.
   */
  constructor(public viewCtrl: ViewController, private titleCasePipe: TitleCasePipe) {
    this.currentSlide = 0;
    this.types = [];
    this.models = [];
    this.finalConfiguration = {} as ThingDraftModel;
    Object.keys(THING_CONSTANTS.NAME).forEach(type => {
      this.types.push(THING_CONSTANTS.NAME[type]);
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
        this.selectedModel = undefined;
        this.loadModels();
      }
    } else if(this.slides.getPreviousIndex() === 1) {
      if (this.selectedModel !== this.finalConfiguration.model) {
        this.finalConfiguration.model = this.selectedModel;
      }
    }
    // ...towards active slide
    if (this.slides.getActiveIndex() === 2) {
      this.finalConfiguration.customName = this.titleCasePipe.transform(this.finalConfiguration.type + ' ' + this.finalConfiguration.model);
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
        if (this.selectedType) { canSlide = true; }
        break;
      case 1:
        if (this.selectedModel) { canSlide = true; }
        break;
      case 2:
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

  private loadModels() {
    this.models = AVAILABLE_MODELS_BY_THING[this.finalConfiguration.type];
  }

}
