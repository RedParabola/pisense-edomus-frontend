// Basic
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResponsiveModule } from 'ng2-responsive';
import { SharedModule } from '../../shared/shared.module';

//Page
import { LoginPage } from './login';

@NgModule({
  imports: [
    IonicPageModule.forChild(LoginPage),
    ResponsiveModule,
    SharedModule
  ],
  declarations: [
    LoginPage,
  ],
  entryComponents: [
    LoginPage,
  ],
  providers: [
  ]
})
export class LoginPageModule { }