//Basic
import { Component, ViewChild } from '@angular/core';
import { IonicPage, Navbar, NavController, LoadingController } from 'ionic-angular';

// Components
import { WizardRoomModal } from '../../components/modals/wizard-room/wizard-room.modal';

// Services
import { RoomStore } from '../../providers/stores/room.store';
import { AlertService } from '../../providers/services/alert.service';
import { ToastService } from '../../providers/services/toast.service';
import { ModalService } from '../../providers/services/modal.service';

// Models
import { RoomModel, RoomDraftModel } from '../../core/model/room.model';

/**
 * Builder page.
 */
@IonicPage({ name: 'page-builder', segment: 'builder' })
@Component({ selector: 'page-builder', templateUrl: 'builder.html' })
export class BuilderPage {

  /**
   * Child navbar in our view can be accessed from our parent component easily.
   */
  @ViewChild(Navbar) navBar: Navbar;

  /**
   * Search query input.
   */
  public searchQuery: string;

  /**
   * Set of rooms to be shown on the list.
   */
  public listedRooms: RoomModel[];

  /**
   * Set of retrieved rooms.
   */
  private retrievedRooms: RoomModel[];

  /**
   * Builder page constructor.
   * @param loadingController Controller to generate a loading dialog.
   * @param navCtrl Navigation controller to navigate to the options pages.
   * @param roomStore Store for handling rooms.
   * @param alertService Service to generate a dialog that presents users with information.
   * @param toastService Controller to generate & present light notifications.
   * @param modalService Service to generate & present a modal.
   */
  constructor(private loadingController: LoadingController, private navCtrl: NavController, private roomStore: RoomStore, private alertService: AlertService, private toastService: ToastService, private modalService: ModalService) {
    const loading = this.loadingController.create({
      content: 'Loading rooms...'
    });
    loading.present();
    this.listedRooms = [];
    this.roomStore.roomsChange().subscribe(
      (storeRooms: RoomModel[]) => {
        this.listedRooms = Object.assign([], storeRooms);
        this.retrievedRooms = Object.assign([], storeRooms);
        this.initializeList();
      }
    );
    this.roomStore.roomsChange().filter(array => !!array.length).first().subscribe(() => loading.dismiss());
  }

  private initializeList(): void {
    this.listedRooms = Object.assign([], this.retrievedRooms);
  }

  public onSearchInput(event: any) {
    // Reset items back to all of the items
    this.initializeList();
    // set val to the value of the searchbar
    const val = event.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listedRooms = this.listedRooms.filter((item: RoomModel) => {
        const roomTypePresent = item.type.toLowerCase().indexOf(val.toLowerCase()) > -1;
        const roomNamePresent = item.customName.toLowerCase().indexOf(val.toLowerCase()) > -1;
        return (roomTypePresent || roomNamePresent);
      })
    }
  }

  public onSearchCancel(event: any): void {

  }

  public openNewRoomWizard(): void {
    const newRoomModal = this.modalService.showModal(WizardRoomModal, {}, {});
    newRoomModal.onDidDismiss(data => {
      if (data) {
        this.addNewRoom(data);
      } else {
        this.toastService.showToast({ message: 'New room discarded.' });
      }
    });
  }

  private addNewRoom(roomDraft: RoomDraftModel): void {
    this.roomStore.createNewRoom(roomDraft).then(
      () => this.toastService.showToast({ message: `Room '${roomDraft.customName}' successfully created.` }),
      error => this.toastService.showToast({ message: error })
    );
  }

  public deleteRoom(room: RoomModel): void {
    if (room.things.length) {
      this.toastService.showToast({ message: `You need to first unlink all its things zºbefore deleting it.` });
    } else {
      const roomName: string = room.customName;
      this.alertService.showAlert({
        title: 'Delete room',
        message: `Are you sure you want to delete '${roomName}'?`,
        buttons: [
          {
            text: 'Cancel'
          },
          {
            text: 'Delete',
            handler: () => {
              this.roomStore.deleteRoom(room.id).then(
                () => this.toastService.showToast({ message: `Room '${roomName}' successfully removed.` }),
                error => this.toastService.showToast({ message: error })
              );
            }
          }
        ]
      });
    }
  }

  public openMore(room: RoomModel): void {

  }

  public renameRoom(room: RoomModel): void {
    this.alertService.showAlert({
      title: 'Rename the room',
      message: `Give the room '${room.customName}' a new name:`,
      inputs: [
        {
          id: 'name',
          name: 'name',
          placeholder: 'New room name',
          value: room.customName
        },
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Rename',
          handler: data => {
            const oldName: string = room.customName;
            const newName: string = data['name'];
            if (newName !== '' && newName !== room.customName) {
              this.roomStore.renameRoom(room, newName).then(
                () => this.toastService.showToast({ message: `'${oldName}' successfully renamed to '${newName}'.` }),
                error => this.toastService.showToast({ message: error })
              );
            }
          }
        }
      ]
    });
  }

  public openThings(room: RoomModel): void {
    this.navCtrl.push('page-connect', { customSearchInput: room.customName, customSearch: room.id });
  }

}
