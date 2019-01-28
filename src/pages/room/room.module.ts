// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { RoomPage } from './room';

//Components
import { ThingComponentsModule } from '../../components/thing/thing-components.module';

@NgModule({
  imports: [
    IonicPageModule.forChild(RoomPage),
    ResponsiveModule,
    SharedModule,
    ThingComponentsModule
  ],
  declarations: [
    RoomPage
    
  ],
  entryComponents: [
    RoomPage
  ],
  providers: [
  ]
})
export class RoomPageModule { }