// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Stores
import { ThingStore } from '../../../../providers/stores/thing.store';

// Services
import { ToastService } from '../../../../providers/services/toast.service';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';
import { LightModel } from '../../../../core/model/thing.model';

/**
 * Light component for light type things.
 */
@Component({ selector: 'light', templateUrl: './light.component.html' })
export class LightComponent extends ThingComponentAbstract implements OnInit {

  /**
   * Flag for when the light is actually on (value from input room is ON).
   */
  public actuallyIlluminated: boolean;

  /**
   * Flag for disabling user interaction during back operations.
   */
  public interactionDisabled: boolean;

  /**
   * Flag for the light toggle.
   */
  public isLit: boolean;

  /**
   * 
   */
  private properties: LightModel;

  /**
   * LightComponent constructor.
   * @param sanitizer Controller to bypass the url for background images.
   * @param thingStore Store for handling things.
   * @param toastService Service used to show toasts.
   */
  constructor(public sanitizer: DomSanitizer,  private thingStore: ThingStore, private toastService: ToastService) {
    super(sanitizer);

  }

  /**
   * Init event.
   */
  public ngOnInit() {
    this.displayThingTypeIconAndImage();
    this.prepareDisplayByModel();
  }

  private prepareDisplayByModel() {
    this.properties = this.thing.typeProperties as LightModel;
    switch (this.thing.model) {
      case 'led':
        this.interactionDisabled = true;
        this.actuallyIlluminated = this.thing.typeProperties.powerStatus === LightModel.ON;
        this.isLit = this.actuallyIlluminated;
        break;
      case 'rgbled':
        
        break;
      default:
        break;
    }
  }

  /**
   * Requests light power changes depending on the manual toggle of the light button.
   * @param event 
   */
  public toggleLight(event: any) {
    this.interactionDisabled = true;
    if (this.isLit) {
      this.thingStore.turnOn(this.thing).then(
        () => {
          this.actuallyIlluminated = true;
          this.interactionDisabled = false;
        }, (error) => {
          this.toastService.showToast({message: 'Failed to turn ON light'});
          this.isLit = false;
          this.interactionDisabled = false;
        });
    } else {
      this.thingStore.turnOff(this.thing).then(
        () => {
          this.actuallyIlluminated = false;
          this.interactionDisabled = false;
        }, (error) => {
          this.toastService.showToast({message: 'Failed to turn OFF light'});
          this.isLit = true;
          this.interactionDisabled = false;
        });
    }
  }

}
