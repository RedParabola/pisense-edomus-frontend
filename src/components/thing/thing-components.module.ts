// Basic
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

// Thing component
import { ThingComponent } from './thing.component';

// Thing components by thing type
import { LightComponent } from './thing-components/light-component/light.component';
import { AirConditionerComponent } from './thing-components/ac-component/ac.component';
import { HumidifierComponent } from './thing-components/humidifier-component/humidifier.component';

/**
 * Module to import and export all the components for the machine page.
 */
@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    ResponsiveModule
  ],
  declarations: [
    ThingComponent,
    LightComponent,
    AirConditionerComponent,
    HumidifierComponent
  ],
  exports: [
    ThingComponent,
    LightComponent,
    AirConditionerComponent,
    HumidifierComponent
  ],
  entryComponents: [
    ThingComponent,
    LightComponent,
    AirConditionerComponent,
    HumidifierComponent
  ],
  providers: [
  ]
})
export class ThingComponentsModule { }
