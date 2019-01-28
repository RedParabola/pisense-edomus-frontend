// Basic
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ItemSliding } from 'ionic-angular';

// Models
import { RoomModel } from '../../core/model/room.model';

// Constants
import { ROOM_CONSTANTS } from '../../core/constants/room.constants';

/**
 * Block for each room in the builder menu.
 */
@Component({ selector: 'room-block', templateUrl: 'room-block.component.html' })
export class RoomBlockComponent {

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
   * Event generated when the user selects open things option.
   */
  @Output() private readonly thingsEvent: EventEmitter<{}>;
  /**
   * Updates the room info.
   */
  @Input() set roomInfo(room: RoomModel) {
    this.room = room;
    this.updateDisplayedInfo();
  };
  /**
   * The info for the represented room.
   */
  public room: RoomModel;
  /**
   * icon to designate the type of room.
   */
  public roomTypeIcon: string;

  /**
   * Constructor to declare all the necesary to initialize the class.
   */
  constructor() {
    this.deleteEvent = new EventEmitter();
    this.moreEvent = new EventEmitter();
    this.renameEvent = new EventEmitter();
    this.thingsEvent = new EventEmitter();
  }

  /**
   * Updates displated room info as the default one if it has no custom name.
   */
  private updateDisplayedInfo(): void {
    this.roomTypeIcon = ROOM_CONSTANTS.ICON[this.room.type];
  }

  /**
   * Emit the room that has to be deleted.
   */
  public delete(slidingItem: ItemSliding) {
    slidingItem.close();
    this.deleteEvent.emit(this.room);
  }

  /**
   * Emit the room for which connect has to launch the more action.
   */
  public more(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.moreEvent.emit(this.room);
  }

  /**
   * Emit the room that has to be renamed.
   */
  public rename(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.renameEvent.emit(this.room);
  }

  /**
   * Emit the room that has to be renamed.
   */
  public openThings(slidingItem: ItemSliding): void {
    slidingItem.close();
    this.thingsEvent.emit(this.room);
  }

}
