// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { SettingsPage } from './settings';

@NgModule({
  imports: [
    IonicPageModule.forChild(SettingsPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [SettingsPage],
  entryComponents: [SettingsPage],
  providers: [
  ]
})
export class SettingsPageModule { }