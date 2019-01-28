// Basic
import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';

// Services
import { RoomStore } from '../../providers/stores/room.store';
import { ThingStore } from '../../providers/stores/thing.store';

// Models
import { RoomModel } from '../../core/model/room.model';
import { ThingModel } from '../../core/model/thing.model';

/**
 * Home page.
 */
@IonicPage({ name: 'page-home', segment: 'home' })
@Component({ selector: 'page-home', templateUrl: 'home.html' })
export class HomePage {

  /**
   * Set of rooms to be shown on the list.
   */
  public shownRooms: RoomModel[];

  /**
   * Set of existing rooms.
   */
  private retrievedRooms: RoomModel[];

  /**
   * Set of existing things.
   */
  private retrievedThings: ThingModel[];

  /**
   * Home page constructor.
   * @param loadingController Controller to generate a loading dialog.
   * @param roomStore Store for handling rooms
   * @param thingStore Store for handling things.
   */
  constructor(private loadingController: LoadingController, private roomStore: RoomStore, private thingStore: ThingStore) {
    this.shownRooms = [];
    this.retrievedRooms = [];
    this.retrievedThings = [];
    const loading = this.loadingController.create({
      content: 'Loading rooms...'
    });
    loading.present();
    this.roomStore.roomsChange().subscribe(
      (storeRooms: RoomModel[]) => {
        this.retrievedRooms = storeRooms;
        this.indexThingsInRooms();
      });
    this.thingStore.thingsChange().subscribe(
      (storeThings: ThingModel[]) => {
        this.retrievedThings = storeThings;
        this.indexThingsInRooms();
      });
    this.roomStore.roomsChange().filter(array => !!array.length).first().subscribe(() => loading.dismiss());
  }

  private indexThingsInRooms(): void {
    let roomThingsMap = {};
    const roomsToShow: RoomModel[] = [];
    this.retrievedThings.forEach((thing: ThingModel) => {
      if (thing.linkedRoomId) {
        if (!roomThingsMap[thing.linkedRoomId]) {
          roomThingsMap[thing.linkedRoomId] = [];
        }
        roomThingsMap[thing.linkedRoomId].push(thing);
      }
    });
    this.retrievedRooms.forEach((room: RoomModel, index: number) => {
      let roomToPush = Object.assign({} as RoomModel, room);
      if (roomThingsMap[room.id]) {
        roomToPush.things = roomThingsMap[room.id];
      }
      roomsToShow.push(roomToPush);
    });
    this.shownRooms = roomsToShow;
  }

}
