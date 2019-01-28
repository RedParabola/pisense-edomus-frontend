// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { ConnectPage } from './connect';

//Components
import { ThingBlockComponent } from '../../components/thing-block/thing-block.component';

@NgModule({
  imports: [
    IonicPageModule.forChild(ConnectPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [
    ConnectPage,
    ThingBlockComponent
  ],
  entryComponents: [
    ConnectPage,
    ThingBlockComponent
  ],
  providers: [
  ]
})
export class ConnectPageModule { }