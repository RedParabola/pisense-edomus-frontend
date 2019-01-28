// Basic
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemSliding } from 'ionic-angular';

// Models
import { ThingModel } from '../../core/model/thing.model';

// Constants
import { THING_CONSTANTS } from '../../core/constants/thing.constants';

/**
 * Block for each thing in the connect menu.
 */
@Component({ selector: 'thing-block', templateUrl: 'thing-block.component.html' })
export class ThingBlockComponent {

  /**
   * Event generated when the user selects delete option.
   */
  @Output() private readonly deleteEvent: EventEmitter<{}>;
  /**
   * Event generated when the user selects more option.
   */
  @Output() private readonly moreEvent: EventEmitter<{}>;
  /**
   * Event generated when the user selects rename option.
   */
  @Output() private readonly renameEvent: EventEmitter<{}>;
  /**
   * Event generated when the user selects flag option.
   */
  @Output() private readonly flagMainEvent: EventEmitter<{}>;
  /**
   * Event generated when the user selects link option.
   */
  @Output() private readonly linkEvent: EventEmitter<{}>;
  /**
   * Event generated when the user selects unlink option.
   */
  @Output() private readonly unlinkEvent: EventEmitter<{}>;
  /**
   * Updates the thing info.
   */
  @Input() set thingInfo(thing: ThingModel) {
    this.thing = thing;
    this.updateDisplayedInfo();
  };
  /**
   * The info for the represented thing.
   */
  public thing: ThingModel;
  /**
   * icon to designate the type of thing.
   */
  public thingTypeIcon: string;

  /**
   * Constructor to declare all the necesary to initialize the class.
   */
  constructor() {
    this.deleteEvent = new EventEmitter();
    this.moreEvent = new EventEmitter();
    this.renameEvent = new EventEmitter();
    this.flagMainEvent = new EventEmitter();
    this.linkEvent = new EventEmitter();
    this.unlinkEvent = new EventEmitter();
  }

  /**
   * Updates displated thing info as the default one if it has no custom name.
   */
  private updateDisplayedInfo(): void {
    this.thingTypeIcon = THING_CONSTANTS.ICON[this.thing.type];
  }

  /**
   * Emit the thing that has to be deleted.
   */
  public delete(slidingItem: ItemSliding) {
    slidingItem.close();
    this.deleteEvent.emit(this.thing);
  }

  /**
   * Emit the thing for which connect has to launch the more action.
   */
  public more(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.moreEvent.emit(this.thing);
  }

  /**
   * Emit the thing that has to be renamed.
   */
  public rename(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.renameEvent.emit(this.thing);
  }

  /**
   * Emit the thing that has to be flagged as main thing.
   */
  public flagAsMain(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.flagMainEvent.emit(this.thing);
  }

  /**
   * Emit the thing that has to be unlinked.
   */
  public unlink(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.unlinkEvent.emit(this.thing);
  }

  /**
   * Emit the thing that has to be linked.
   */
  public link(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.linkEvent.emit(this.thing);
  }

  /*
  public clicked(slider: ItemSliding): void {
    slider.moveSliding(50);
  }

  public logDrag(item): void {
    let percent = item.getSlidingPercent();
    if (percent > 0) {
      // positive
      console.log('right side');
    } else {
      // negative
      console.log('left side');
    }
    if (Math.abs(percent) > 1) {
      console.log('overscroll');
    }
  }
  */
}
