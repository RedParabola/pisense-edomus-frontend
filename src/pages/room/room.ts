//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavParams } from 'ionic-angular';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// Services
import { RoomStore } from '../../providers/stores/room.store';
import { ThingStore } from '../../providers/stores/thing.store';
import { LoadingService } from '../../providers/services/loading.service';

// Models
import { RoomModel } from '../../core/model/room.model';
import { ThingModel } from '../../core/model/thing.model';

/**
 * Room page.
 */
@IonicPage({ name: 'page-room', segment: 'room/:roomId' })
@Component({ selector: 'page-room', templateUrl: 'room.html' })
export class RoomPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Room info.
   */
  public room: RoomModel;
  /**
   * image as background of room. Must be sanitized.
   */
  public roomTypeImage: SafeStyle;
  /**
   * Set of things linked to the room.
   */
  public roomThings: ThingModel[];

  /**
   * Room page constructor.
   * @param loadingController Controller to generate a loading dialog.
   * @param navParams navigation parameters.
   * @param sanitizer Controller to bypass the url for background images.
   * @param roomStore Store for handling rooms.
   * @param thingStore Store for handling things.
   * @param loadingService Service used to generate a loading dialog
   */
  constructor(public navParams: NavParams, private sanitizer: DomSanitizer, private roomStore: RoomStore, private thingStore: ThingStore, private loadingService: LoadingService) {
    this.loadingService.show({
      content: 'Loading room...'
    });
    this.roomThings = [];
    const roomId: string = this.navParams.get('roomId');
    this.room = Object.assign({}, this.roomStore.getCurrentRoomById(roomId));
    this.roomTypeImage = this.sanitizer.bypassSecurityTrustStyle(`url('assets/imgs/${this.room.type.toLowerCase()}.jpg')`);
    this.thingStore.thingsChange().filter(array => !!array.length).subscribe(
      (storeThings: ThingModel[]) => {
        this.roomThings = storeThings.filter(thing => thing.linkedRoomId === this.room.id);
        this.loadingService.dismiss();
      }
    );
  }

}
