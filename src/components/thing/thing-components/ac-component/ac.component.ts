// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

/**
 * Air Conditioner component for AC type things.
 */
@Component({ selector: 'ac', templateUrl: './ac.component.html' })
export class AirConditionerComponent extends ThingComponentAbstract implements OnInit {

  /**
   * AirConditionerComponent constructor.
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
  }

}
