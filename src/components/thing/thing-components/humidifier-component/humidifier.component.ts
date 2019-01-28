// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

// Stores
import { ThingStore } from '../../../../providers/stores/thing.store';

// Services
import { LoggerService } from '../../../../providers/services/logger.service';

// Models
import { HumidifierModel } from '../../../../core/model/thing.model';

/**
 * Humidifier component for humidifier type things.
 */
@Component({ selector: 'humidifier', templateUrl: './humidifier.component.html' })
export class HumidifierComponent extends ThingComponentAbstract implements OnInit {

  /**
   * HumidifierComponent constructor.
   * @param sanitizer Controller to bypass the url for background images.
   * @param thingStore Store for handling things.
   * @param loggerService logger service
   */
  constructor(public sanitizer: DomSanitizer, private thingStore: ThingStore, private loggerService: LoggerService) {
    super(sanitizer);
  }
  
  /**
   * Init event.
   */
  public ngOnInit() {
    this.displayThingTypeIconAndImage();
  }

}
