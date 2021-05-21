import { SkyAppConfig } from '@skyux/config';
import { Observable } from 'rxjs';

import { AppRoute } from './types/app-route';

export interface SkyHrefResolverInterface {
  protocols: string[];

  init(config: SkyAppConfig): Promise<void>;

  resolveHref$(url: string): Observable<AppRoute>;
}
