import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

import 'web-animations-js/web-animations.min';

/**
 * Bootstrap the Appmodule at the start of the application.
 */
platformBrowserDynamic().bootstrapModule(AppModule);
