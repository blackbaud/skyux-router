import { Injectable } from '@angular/core';

import { SkyHrefResolver } from './href-resolver';
import { SkyHref } from './types/href';

/**
 * Return the link as-is.
 */
@Injectable()
export class SkyHrefResolverService implements SkyHrefResolver {
  public resolveHref(param: {url: string}): Promise<SkyHref> {
    return Promise.resolve<SkyHref>({
      url: param.url,
      userHasAccess: true
    });
  }
}
