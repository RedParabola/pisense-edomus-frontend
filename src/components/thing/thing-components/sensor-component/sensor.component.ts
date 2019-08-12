// Basic
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

// Machine attribute class to extend
import { ThingComponentAbstract } from '../thing-component.abstract';

// Model
import { SensorModel } from '../../../../core/model/thing.model';

// Constants
import { AVAILABLE_MODELS_BY_THING } from '../../../../core/constants/thing.constants';

/**
 * Sensor component for sensor type things.
 */
@Component({ selector: 'sensor', templateUrl: './sensor.component.html' })
export class SensorComponent extends ThingComponentAbstract implements OnInit {

  /**
   * 
   */
  public sensorMeasures: any;

  /**
   * 
   */
  public hasAirQualityMeasure: boolean;

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
    this.prepareDisplayByModel();
  }

  private prepareDisplayByModel() {
    const properties: SensorModel= this.thing.typeProperties as SensorModel;
    this.sensorMeasures = properties.sensorMeasures;
    switch (this.thing.model) {
      case 'dht11':
        // if (this.sensorMeasures) {
        //   this.hasAirQualityMeasure = this.sensorMeasures.airQuality;
        // }
        break;
      case 'mq135':
        if (this.sensorMeasures) {
          this.hasAirQualityMeasure = this.sensorMeasures.airQuality !== undefined;
        }
        break;
      default:
        break;
    }
  }

}
