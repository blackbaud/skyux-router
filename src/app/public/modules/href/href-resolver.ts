import { AppRoute } from './types/app-route';

export interface SkyHrefResolver {
  resolveHref(url: string): Promise<AppRoute>;
}
