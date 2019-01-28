//Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

//Pages
import { BaseTabsPage } from './base-tabs';

@NgModule({
  declarations: [
    BaseTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(BaseTabsPage),
  ],
})
export class BaseTabsPageModule {}
