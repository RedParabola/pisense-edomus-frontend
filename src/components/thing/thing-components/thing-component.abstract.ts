// Basic
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// Models
import { ThingModel } from '../../../core/model/thing.model';

// Constants
import { THING_CONSTANTS } from '../../../core/constants/thing.constants';

/**
 * Thing component abstract class that every specific thing component attribute class must extend
 */
export abstract class ThingComponentAbstract {

  /**
   * The info for the represented thing.
   */
  public thing: ThingModel;

  /**
   * icon to designate the type of thing.
   */
  protected thingTypeIcon: string;

  /**
   * image as background to designate the type of thing.
   */
  protected thingTypeImage: SafeStyle;

  /**
   * ThingComponent constructor.
   * @param sanitizer Controller to bypass the url for background images.
   */
  constructor(public sanitizer: DomSanitizer) {
  }

  protected displayThingTypeIconAndImage(): void {
    this.thingTypeIcon = THING_CONSTANTS.ICON[this.thing.type];
    this.thingTypeImage = this.sanitizer.bypassSecurityTrustStyle(`url('assets/imgs/${this.thing.type.toLowerCase()}.jpg')`);
  }
}
