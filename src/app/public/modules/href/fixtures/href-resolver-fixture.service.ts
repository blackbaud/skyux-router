import { Injectable } from '@angular/core';
import { SkyAppConfig } from '@skyux/config';
import { BehaviorSubject, Observable } from 'rxjs';
import { SkyHrefResolverInterface } from '../href-resolver-interface';
import { AppRoute } from '../types/app-route';

@Injectable()
export class HrefResolverFixtureService implements SkyHrefResolverInterface {
  public protocols: string[] = ['test', '1bb-nav', 'nope', 'error'];

  public init(config: SkyAppConfig): Promise<void> {
    return Promise.resolve(undefined);
  }

  public resolveHref$(url: string): Observable<AppRoute> {
    if (url.startsWith('test://')) {
      return new BehaviorSubject<AppRoute>({
        url: url.replace(/^test:\/\/[^\/]+/, 'https://success'),
        userHasAccess: true,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('1bb-nav://')) {
      return new BehaviorSubject<AppRoute>({
        url: url
          .replace(/[^:]+:\/\/[^\/]*/, 'https://example.com')
          .replace(/$/, '?query=param'),
        userHasAccess: true,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('nope://')) {
      return new BehaviorSubject<AppRoute>({
        url,
        userHasAccess: false,
        route: '/test',
        app: 'test'
      });
    } else if (url.startsWith('error://')) {
      throw new Error(`Error while resolving ${url}`);
    }
  }

}
