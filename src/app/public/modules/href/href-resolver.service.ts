import { Injectable } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyHrefResolverInterface } from './href-resolver-interface';
import { AppRoute } from './types/app-route';

/**
 * For http(s) links, return the link as-is.
 */
@Injectable()
export class SkyHrefResolverService implements SkyHrefResolverInterface {
  public protocols = ['https', 'http'];

  public init(config: SkyAppConfig): Promise<void> {
    return Promise.resolve(undefined);
  }

  public resolveHref$(url: string): Observable<AppRoute> {
    return new BehaviorSubject<AppRoute>({
      url,
      userHasAccess: true
    });
  }
}
