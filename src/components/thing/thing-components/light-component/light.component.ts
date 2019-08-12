// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';
import { LightModel } from '../../../../core/model/thing.model';

/**
 * Light component for light type things.
 */
@Component({ selector: 'light', templateUrl: './light.component.html' })
export class LightComponent extends ThingComponentAbstract implements OnInit {

  /**
   * 
   */
  private properties: LightModel;

  /**
   * LightComponent constructor.
   * @param sanitizer Controller to bypass the url for background images.
   */
  constructor(public sanitizer: DomSanitizer) {
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
        break;
      case 'rgbled':
        
        break;
      default:
        break;
    }
  }

}
