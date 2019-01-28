// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { AccountPage } from './account';

@NgModule({
  imports: [
    IonicPageModule.forChild(AccountPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [AccountPage],
  entryComponents: [AccountPage],
  providers: [
  ]
})
export class AccountPageModule { }