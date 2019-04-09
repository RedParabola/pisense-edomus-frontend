// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

/**
 * Light component for light type things.
 */
@Component({ selector: 'light', templateUrl: './light.component.html' })
export class LightComponent extends ThingComponentAbstract implements OnInit {

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
  }

}
