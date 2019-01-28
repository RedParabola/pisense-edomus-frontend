// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { EfficiencyPage } from './efficiency';

@NgModule({
  imports: [
    IonicPageModule.forChild(EfficiencyPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [EfficiencyPage],
  entryComponents: [EfficiencyPage],
  providers: [
  ]
})
export class EfficiencyPageModule { }