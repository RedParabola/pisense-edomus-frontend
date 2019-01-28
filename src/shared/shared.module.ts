//Basic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';

//Components to share
import { ResponsiveModule } from './responsive/responsive.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ResponsiveModule
  ],
  providers: [ ]
})
export class SharedModule { }

export * from './media-service/media.service';
export * from './custom-validators.service';
export * from './offline-reminder/offline-reminder.service';
