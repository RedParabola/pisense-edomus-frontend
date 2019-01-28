//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavParams, LoadingController } from 'ionic-angular';

// Components
import { WizardThingModal } from '../../components/modals/wizard-thing/wizard-thing.modal';
import { WizardLinkModal } from '../../components/modals/wizard-link/wizard-link.modal';

// Services
import { RoomStore } from '../../providers/stores/room.store';
import { ThingStore } from '../../providers/stores/thing.store';
import { AlertService } from '../../providers/services/alert.service';
import { ToastService } from '../../providers/services/toast.service';
import { ModalService } from '../../providers/services/modal.service';

// Models
import { RoomModel } from '../../core/model/room.model';
import { ThingModel, ThingDraftModel } from '../../core/model/thing.model';

/**
 * Connect page.
 */
@IonicPage({ name: 'page-connect', segment: 'connect/:customSearch/:customSearchInput' })
@Component({ selector: 'page-connect', templateUrl: 'connect.html' })
export class ConnectPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Search query input.
   */
  public searchQuery: string;

  /**
   * Search query input for search field.
   */
  public searchQueryInput: string;

  /**
   * Set of things to be shown on the list.
   */
  public listedThings: ThingModel[];

  /**
   * Set of retrieved things.
   */
  private retrievedThings: ThingModel[];

  /**
   * List of existing rooms.
   */
  public existingRooms: RoomModel[];

  /**
   * Connect page constructor.
   * @param loadingController Controller to generate a loading dialog.
   * @param navParams navigation parameters.
   * @param roomStore Store for handling rooms.
   * @param thingStore Store for handling things.
   * @param alertService Service to generate a dialog that presents users with information.
   * @param toastService Service to generate & present light notifications.
   * @param modalService Service to generate & present a modal.
   */
  constructor(private loadingController: LoadingController, public navParams: NavParams, private roomStore: RoomStore, private thingStore: ThingStore, private alertService: AlertService, private toastService: ToastService, private modalService: ModalService) {
    const loading = this.loadingController.create({
      content: 'Loading things...'
    });
    loading.present();
    this.searchQuery = this.navParams.get('customSearch');
    this.searchQueryInput = this.navParams.get('customSearchInput');
    this.listedThings = [];
    this.existingRooms = [];
    this.roomStore.roomsChange().filter(array => !!array.length).first().subscribe(
      (storeRooms: RoomModel[]) => this.existingRooms = Object.assign([], storeRooms));
    this.thingStore.thingsChange().filter(array => !!array.length).subscribe(
      (storeThings: ThingModel[]) => {
        this.retrievedThings = Object.assign([], storeThings);
        this.extendRetrievedThings();
        if (this.searchQuery) {
          this.launchSearch(this.searchQuery);
        } else {
          this.initializeList();
        }
      }
    );
    this.thingStore.thingsChange().filter(array => !!array.length).first().subscribe(() => loading.dismiss());
  }

  private extendRetrievedThings(): void {
    if (this.existingRooms.length) {
      this.retrievedThings.forEach((thing: ThingModel) => {
        if (thing.linkedRoomId) {
          const linkedRoom: RoomModel = this.existingRooms.find((room: RoomModel) => {
            return room.id === thing.linkedRoomId;
          });
          thing.linkedRoomName = linkedRoom.customName;
          thing.flaggedAsMain = (thing.flaggedAsMain === undefined) ? linkedRoom.mainThingsId[thing.type] === thing.id : thing.flaggedAsMain;
        }
      });
    }
  }

  private initializeList(): void {
    this.listedThings = Object.assign([], this.retrievedThings);
  }

  private launchSearch(customSearch: string): void {
    const target = { value: customSearch };
    this.onSearchInput({ target }, true);
  }

  public onSearchInput(event: any, isHiddenInput?: boolean) {
    if (!isHiddenInput) {
      this.searchQuery = undefined;
    }
    // Reset items back to all of the items
    this.initializeList();
    // set val to the value of the searchbar
    const val = event.target.value;
    // if the value is an empty string don't filter the items
    if (val) {
      if (val.trim() != '') {
        this.listedThings = this.listedThings.filter((item: ThingModel) => {
          const thingTypePresent: boolean = item.type.toLowerCase().indexOf(val.toLowerCase()) > -1;
          const thingNamePresent: boolean = item.customName.toLowerCase().indexOf(val.toLowerCase()) > -1;
          const thingModelPresent: boolean = item.model.toLowerCase().indexOf(val.toLowerCase()) > -1;
          const roomIdPresent: boolean = this.navParams.get('customSearch') && item.linkedRoomId ? item.linkedRoomId.toLowerCase().indexOf(val.toLowerCase()) > -1 : false;
          const roomNamePresent: boolean = item.linkedRoomName ? item.linkedRoomName.toLowerCase().indexOf(val.toLowerCase()) > -1 : false;
          return (thingTypePresent || thingNamePresent || thingModelPresent || roomIdPresent || roomNamePresent);
        })
      } else {
        this.searchQuery = undefined;
      }
    }
  }

  public onSearchCancel(event: any): void {
    this.searchQuery = undefined;
    this.searchQueryInput = undefined;
  }

  public openNewThingWizard(): void {
    const newThingModal = this.modalService.showModal(WizardThingModal, {}, {});
    newThingModal.onDidDismiss(data => {
      if (data) {
        this.addNewThing(data);
      } else {
        this.toastService.showToast({ message: 'New thing discarded.' });
      }
    });
  }

  private addNewThing(thingDraft: ThingDraftModel): void {
    this.thingStore.addNewThing(thingDraft).then(
      () => this.toastService.showToast({ message: `Thing '${thingDraft.customName}' successfully added.` }),
      error => this.toastService.showToast({ message: error })
    );
  }

  public deleteThing(thing: ThingModel): void {
    if (thing.linkedRoomId) {
      this.toastService.showToast({ message: `You need to first unlink it from its room before deleting it.` });
    } else {
      const thingName: string = thing.customName;
      this.alertService.showAlert({
        title: 'Delete thing',
        message: `Are you sure you want to delete '${thingName}'?`,
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.thingStore.deleteThing(thing.id).then(
                () => this.toastService.showToast({ message: `Thing '${thingName}' successfully removed.` }),
                error => this.toastService.showToast({ message: error })
              );
            }
          }
        ]
      });
    }
  }

  public openMore(thing: ThingModel): void {

  }

  public renameThing(thing: ThingModel): void {
    this.alertService.showAlert({
      title: 'Rename the thing',
      message: `Give the thing '${thing.customName}' a new name:`,
      inputs: [
        {
          id: 'name',
          name: 'name',
          placeholder: 'New thing name',
          value: thing.customName
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Rename',
          handler: data => {
            const oldName: string = thing.customName;
            const newName: string = data['name'];
            if (newName !== '' && newName !== thing.customName) {
              this.thingStore.renameThing(thing, newName).then(
                () => this.toastService.showToast({ message: `'${oldName}' successfully renamed to '${newName}'.` }),
                error => this.toastService.showToast({ message: error })
              );
            }
          }
        }
      ]
    });
  }

  public flagThingAsMain(thing: ThingModel): void {
    if (thing.flaggedAsMain) {
      this.toastService.showToast({ message: `'${thing.customName}' is already main thing in room '${thing.linkedRoomName}'.` });
    } else {
      const linkedRoom: RoomModel = this.existingRooms.find((room: RoomModel) => {
        return room.id === thing.linkedRoomId;
      });
      const oldMainThingId: string = linkedRoom.mainThingsId[thing.type];
      this.thingStore.flagAsMainThing(thing, oldMainThingId).then(
        () => this.toastService.showToast({ message: `'${thing.customName}' successfully flagged as main in room '${thing.linkedRoomName}'.` }),
        error => this.toastService.showToast({ message: error })
      );
    }
  }

  public linkThing(thing: ThingModel): void {
    const linkModal = this.modalService.showModal(WizardLinkModal, { linkingThing: thing }, {});
    linkModal.onDidDismiss(data => {
      // TODO:?
    });
  }

  public unlinkThing(thing: ThingModel): void {
      const thingName: string = thing.customName;
      const roomName: string = thing.linkedRoomName;
      this.alertService.showAlert({
        title: 'Unlink from its room',
        message: `Are you sure you want to unlink '${thingName}' from '${roomName}'?`,
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Unlink',
            handler: () => {
              this.thingStore.unlinkRoom(thing).then(
                () => this.toastService.showToast({ message: `Thing '${thingName}' successfully unlinked from ''${roomName}'.` }),
                error => this.toastService.showToast({ message: error })
              );
            }
          }
        ]
      });
  }

}
