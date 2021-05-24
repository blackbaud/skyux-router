import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

import { SkyHrefResolverAggregateService } from './href-resolver-aggregate.service';
import { SKY_HREF_RESOLVER } from './href-resolver-token';
import { SkyHrefResolverService } from './href-resolver.service';
import { SkyHrefDirective } from './href.directive';

@NgModule({
  declarations: [SkyHrefDirective],
  exports: [SkyHrefDirective],
  imports: [
    CommonModule
  ],
  providers: [
    SkyAppWindowRef,
    {
      provide: SKY_HREF_RESOLVER,
      useClass: SkyHrefResolverService,
      multi: true
    },
    {
      provide: SkyHrefResolverAggregateService,
      useClass: SkyHrefResolverAggregateService,
      deps: [
        SKY_HREF_RESOLVER
      ]
    }
  ]
})
export class SkyHrefModule {
}
