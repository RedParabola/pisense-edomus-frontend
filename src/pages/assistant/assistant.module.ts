// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { AssistantPage } from './assistant';

@NgModule({
  imports: [
    IonicPageModule.forChild(AssistantPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [AssistantPage],
  entryComponents: [AssistantPage],
  providers: [
  ]
})
export class AssistantPageModule { }