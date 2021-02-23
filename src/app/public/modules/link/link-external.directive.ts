import {
  Directive,
  Input,
  OnChanges,
  Optional,
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
  SkyAppConfig,
  SkyAppRuntimeConfigParamsProvider
} from '@skyux/config';

import {
  SkyAppWindowRef
} from '@skyux/core';

import { SkyAppLinkQueryParams } from './link-query-params';

/**
 * @deprecated
 */
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
    private window: SkyAppWindowRef,
    @Optional() private skyAppConfig?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider
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
    const skyuxParams = (this.skyAppConfig)
      ? this.skyAppConfig.runtime.params.getAll(true)
      : this.paramsProvider.params.getAll(true);

    return Object.assign(
      {},
      this.queryParams,
      queryParams,
      skyuxParams
    );
  }
}
