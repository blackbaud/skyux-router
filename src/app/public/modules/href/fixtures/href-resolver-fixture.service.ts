import { Injectable } from '@angular/core';
import { SkyHrefResolver } from '../href-resolver';
import { AppRoute } from '../types/app-route';

@Injectable()
export class HrefResolverFixtureService implements SkyHrefResolver {
  public resolveHref(url: string): Promise<AppRoute> {
    if (url.startsWith('test://')) {
      return Promise.resolve<AppRoute>({
        url: url.replace(/^test:\/\/[^\/]+/, 'https://success'),
        userHasAccess: true,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('1bb-nav://')) {
      return Promise.resolve<AppRoute>({
        url: url
          .replace(/[^:]+:\/\/[^\/]*/, 'https://example.com')
          .replace(/$/, '?query=param'),
        userHasAccess: true,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('nope://')) {
      return Promise.resolve<AppRoute>({
        url,
        userHasAccess: false,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('error://')) {
      throw new Error(`Error while resolving ${url}`);
    } else {
      return Promise.resolve<AppRoute>({
        url,
        userHasAccess: true
      });
    }
  }

}
