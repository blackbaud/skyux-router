import { Inject, Injectable } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';

import { BehaviorSubject, Observable } from 'rxjs';

import { SkyHrefResolverInterface } from './href-resolver-interface';
import { SKY_HREF_RESOLVER } from './href-resolver-token';
import { AppRoute } from './types/app-route';

@Injectable()
export class SkyHrefResolverAggregateService {
  constructor(
    @Inject(SKY_HREF_RESOLVER) private hrefResolvers: SkyHrefResolverInterface[]
  ) {
  }

  private static getProtocol(url: string): string | false {
    const separator = '://';
    if (url.indexOf(separator) > 0) {
      return url.split(separator, 2).shift();
    }
    return false;
  }

  public async init(config: SkyAppConfig): Promise<void> {
    let initQueue: any[] = [];
    for (const hrefResolver of this.hrefResolvers) {
      initQueue.push(hrefResolver.init(config));
    }
    return Promise.all<void>(initQueue).then(() => {});
  }

  public resolveHref$(href: string): Observable<AppRoute> {
    const protocol = SkyHrefResolverAggregateService.getProtocol(href);
    if (protocol) {
      for (const hrefResolver of this.hrefResolvers) {
        if (hrefResolver.protocols.includes(protocol)) {
          return hrefResolver.resolveHref$(href);
        }
      }
    }
    // no handler, emit the href as-is
    return new BehaviorSubject<AppRoute>({
      url: href,
      userHasAccess: true
    });
  }
}
