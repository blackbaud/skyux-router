import { Injectable } from '@angular/core';

import { SkyHrefResolver } from './href-resolver';
import { AppRoute } from './types/app-route';

/**
 * Return the link as-is.
 */
@Injectable()
export class SkyHrefResolverService implements SkyHrefResolver {
  public resolveHref(url: string): Promise<AppRoute> {
    return Promise.resolve<AppRoute>({
      url,
      userHasAccess: true
    });
  }
}
