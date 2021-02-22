import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import {
  LocationStrategy
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLinkWithHref
} from '@angular/router';

import {
  SkyAppConfig
} from '@skyux/config';

import { SkyAppLinkQueryParams } from './link-query-params';

@Directive({
  selector: '[skyAppLink]'
})
export class SkyAppLinkDirective extends RouterLinkWithHref implements OnChanges {

  @Input()
  set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    private skyAppConfig: SkyAppConfig
  ) {
    super(router, route, locationStrategy);
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
