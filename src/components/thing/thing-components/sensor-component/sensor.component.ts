// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

/**
 * Sensor component for sensor type things.
 */
@Component({ selector: 'sensor', templateUrl: './sensor.component.html' })
export class SensorComponent extends ThingComponentAbstract implements OnInit {

  /**
   * SensorComponent constructor.
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
