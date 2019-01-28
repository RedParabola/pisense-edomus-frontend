// Basic
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

// Stores
import { ThingStore } from '../../providers/stores/thing.store';

// Services
import { ToastService } from '../../providers/services/toast.service';

// Models
import { RoomModel } from '../../core/model/room.model';
import { ThingModel, AirConditionerModel, LightModel, HumidifierModel } from '../../core/model/thing.model';

// Constants
import { ROOM_CONSTANTS } from '../../core/constants/room.constants';

/**
 * Preview for each room in the main menu that shows the core options of the room.
 */
@Component({ selector: 'room-preview', templateUrl: 'room-preview.component.html' })
export class RoomPreviewComponent {

  /**
   * The info for the represented room.
   */
  @Input() set roomInfo(room: RoomModel) {
    this.interactionDisabled = true;
    this.room = room;
    this.updateDisplayedInfo();
    if(this.thingStore.isThingModelArray(this.room.things)){
      this.updateLightStatus();
      this.updateAirConditionerStatus();
      this.updateHumidifierStatus();
    }
    this.interactionDisabled = false;
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
   * image as background of room. Must be sanitized.
   */
  public roomTypeImage: SafeStyle;
  /**
   * Main light of the room.
   */
  public mainLight: ThingModel;
  /**
   * Flag for when the light is actually on (value from input room is ON).
   */
  public actuallyIlluminated: boolean;
  /**
   * Flag for disabling user interaction during back operations.
   */
  public interactionDisabled: boolean;
  /**
   * Flag for the main light toggle.
   */
  public mainLightOn: boolean;
  /**
   * Flag for the air conditioner icon.
   */
  public mainACOn: boolean;
  /**
   * Flag for the humidifier icon.
   */
  public mainHumidifierOn: boolean;

  /**
   * Constructor to declare all the necesary to initialize the class.
   * @param sanitizer Controller to bypass the url for background images.
   * @param navCtrl Navigation controller to navigate to the options pages.
   * @param thingStore Store for handling things.
   * @param toastService Service used to show toasts.
   */
  constructor(private navCtrl: NavController, private sanitizer: DomSanitizer, private thingStore: ThingStore, private toastService: ToastService) {
  }

  /**
   * Updates displated room info as the default one if it has no custom name.
   */
  private updateDisplayedInfo(): void {
    this.roomTypeIcon = ROOM_CONSTANTS.ICON[this.room.type];
    this.roomTypeImage = this.sanitizer.bypassSecurityTrustStyle(`url('assets/imgs/${this.room.type.toLowerCase()}.jpg')`);
  }

  /**
   * Detects main light and updates its status depending on the value from input room.
   */
  private updateLightStatus(): void {
    this.mainLight = this.room.things.find((thing: ThingModel) => {
      return thing.id === this.room.mainThingsId.LIGHT;
    }) as ThingModel;
    if (this.mainLight) {
      this.actuallyIlluminated = this.mainLight.typeProperties.powerStatus === LightModel.ON;
      this.mainLightOn = this.actuallyIlluminated;
    }
  }

  /**
   * Detects main AC and updates its icon status.
   */
  private updateAirConditionerStatus(): void {
    const mainACThing: string | ThingModel = this.room.things.find((thing: ThingModel) => {
      return (thing.id === this.room.mainThingsId.AC);
    }) as ThingModel;
    if (mainACThing && mainACThing.typeProperties.powerStatus === AirConditionerModel.ON) {
      this.mainACOn = true;
    }
  }

  /**
   * Detects a powered humidifier and updates its icon status.
   */
  private updateHumidifierStatus(): void {
    const mainHumidifierThing: string | ThingModel = this.room.things.find((thing: ThingModel) => {
      return (thing.id === this.room.mainThingsId.HUMIDIFIER);
    }) as ThingModel;
    if (mainHumidifierThing && mainHumidifierThing.typeProperties.powerStatus === HumidifierModel.ON) {
      this.mainHumidifierOn = true;
    }
  }

  /**
   * Requests light power changes depending on the manual toggle of the main light button.
   * @param event 
   */
  public toggleMainLight(event: any) {
    this.interactionDisabled = true;
    if (this.mainLightOn) {
      this.thingStore.turnOn(this.mainLight).then(
        () => {
          this.actuallyIlluminated = true;
          this.interactionDisabled = false;
        }, (error) => {
          this.toastService.showToast({message: 'Failed to turn ON main light'});
          this.mainLightOn = false;
          this.interactionDisabled = false;
        });
    } else {
      this.thingStore.turnOff(this.mainLight).then(
        () => {
          this.actuallyIlluminated = false;
          this.interactionDisabled = false;
        }, (error) => {
          this.toastService.showToast({message: 'Failed to turn OFF main light'});
          this.mainLightOn = true;
          this.interactionDisabled = false;
        });
    }
  }

  public goToRoom(): void {
    if (!this.interactionDisabled) {
      this.navCtrl.push('page-room', { roomId: this.room.id });
    }
  }
}
