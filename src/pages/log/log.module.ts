// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { LogPage } from './log';

@NgModule({
  imports: [
    IonicPageModule.forChild(LogPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [LogPage],
  entryComponents: [LogPage],
  providers: [
  ]
})
export class LogPageModule { }