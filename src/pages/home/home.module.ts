// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { HomePage } from './home';

//Components
import { RoomPreviewComponent } from '../../components/room-preview/room-preview.component';

@NgModule({
  imports: [
    IonicPageModule.forChild(HomePage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [
    HomePage,
    RoomPreviewComponent
  ],
  entryComponents: [
    HomePage,
    RoomPreviewComponent
  ],
  providers: [
  ]
})
export class HomePageModule { }