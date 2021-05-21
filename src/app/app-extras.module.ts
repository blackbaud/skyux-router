import {
  NgModule
} from '@angular/core';

import {
  SkyAppConfigHost
} from '@skyux/config';

import {
  SkyAppLinkModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAppLinkModule
  ],
  providers: [
    {
      provide: SkyAppConfigHost,
      useValue: { host: {} }
    }
  ]
})
export class AppExtrasModule { }
