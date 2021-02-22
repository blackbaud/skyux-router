import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  PathLocationStrategy,
  PlatformLocation
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLinkWithHref
} from '@angular/router';

import {
  SkyAppConfig
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLinkExternal]'
})
export class SkyAppLinkExternalDirective extends RouterLinkWithHref implements OnChanges {

  @Input()
  set skyAppLinkExternal(commands: any[] | string) {
    this.routerLink = commands;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    platformLocation: PlatformLocation,
    private skyAppConfig: SkyAppConfig,
    private window: SkyAppWindowRef
  ) {
    super(router, route, new PathLocationStrategy(platformLocation, skyAppConfig.skyux.host.url));
    if (this.window.nativeWindow.window.name && this.window.nativeWindow.window.name !== '') {
      this.target = this.window.nativeWindow.window.name;
    } else {
      this.target = '_top';
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.queryParams = this.mergeQueryParams(changes.queryParams?.currentValue);
    super.ngOnChanges(changes);
  }

  private mergeQueryParams(queryParams: SkyAppLinkQueryParams): SkyAppLinkQueryParams {
    return Object.assign(
      {},
      this.queryParams,
      queryParams,
      this.skyAppConfig.runtime.params.getAll(true)
    );
  }
}
