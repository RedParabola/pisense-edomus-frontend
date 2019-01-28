import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HideDirective } from './directives/hide.directive';
import { HideXsDirective } from './directives/hide-xs.directive';
import { HideGtXsDirective } from './directives/hide-gt-xs.directive';
import { HideMdDirective } from './directives/hide-md.directive';
import { HideGtMdDirective } from './directives/hide-gt-md.directive';
import { HideLgDirective } from './directives/hide-lg.directive';
import { ShowDirective } from './directives/show.directive';
import { ShowXsDirective } from './directives/show-xs.directive';
import { ShowGtXsDirective } from './directives/show-gt-xs.directive';
import { ShowMdDirective } from './directives/show-md.directive';
import { ShowGtMdDirective } from './directives/show-gt-md.directive';
import { ShowLgDirective } from './directives/show-lg.directive';

/**
 * Array with all imported directives related with show/hide content depending on screen size.
 */
let directives = [
  HideDirective,
  HideXsDirective,
  HideGtXsDirective,
  HideMdDirective,
  HideGtMdDirective,
  HideLgDirective,
  ShowDirective,
  ShowXsDirective,
  ShowGtXsDirective,
  ShowMdDirective,
  ShowGtMdDirective,
  ShowLgDirective
];

/**
 * Module to export all directives related with show/hide content depending on screen size.
 */
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: directives,
  exports: directives,
  providers: []
})
export class ResponsiveModule { }
