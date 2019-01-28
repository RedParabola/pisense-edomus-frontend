// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { BuilderPage } from './builder';

//Components
import { RoomBlockComponent } from '../../components/room-block/room-block.component';

@NgModule({
  imports: [
    IonicPageModule.forChild(BuilderPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [
    BuilderPage,
    RoomBlockComponent
  ],
  entryComponents: [
    BuilderPage,
    RoomBlockComponent
  ],
  providers: [
  ]
})
export class BuilderPageModule { }