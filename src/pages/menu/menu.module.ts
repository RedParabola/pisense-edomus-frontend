// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { MenuPage } from './menu';

@NgModule({
  imports: [
    IonicPageModule.forChild(MenuPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [MenuPage],
  entryComponents: [MenuPage],
  providers: [
  ]
})
export class MenuPageModule { }