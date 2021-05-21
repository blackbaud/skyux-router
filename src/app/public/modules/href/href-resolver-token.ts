import { InjectionToken } from '@angular/core';
import { SkyHrefResolverInterface } from './href-resolver-interface';

export const SKY_HREF_RESOLVER = new InjectionToken<SkyHrefResolverInterface[]>(
  'Sky HREF URL Resolver'
);
