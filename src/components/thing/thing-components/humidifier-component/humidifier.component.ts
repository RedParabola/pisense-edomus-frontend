// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

/**
 * Humidifier component for humidifier type things.
 */
@Component({ selector: 'humidifier', templateUrl: './humidifier.component.html' })
export class HumidifierComponent extends ThingComponentAbstract implements OnInit {

  /**
   * HumidifierComponent constructor.
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
