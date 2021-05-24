import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Directive, HostBinding, Input, NgZone, OnDestroy, OnInit, Optional } from '@angular/core';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { Subscription } from 'rxjs';

import { SkyHrefQueryParams } from './href-query-params';

import { SkyHrefResolverAggregateService } from './href-resolver-aggregate.service';

@Directive({
  selector: '[skyHref]'
})
export class SkyHrefDirective implements OnDestroy, OnInit {

  @HostBinding('href')
  public get href(): string {
    return this._href || '';
  }

  public set href(value: string) {
    this._href = value;
  }

  @Input()
  public set queryParams(value: SkyHrefQueryParams) {
    this._queryParams = value;
    this.updateTargetUrlAndHref();
  }

  @Input()
  set skyHref(skyHref: string) {
    this._skyHref = skyHref;
    this.checkRouteAccess();
  }
  get skyHref(): string {
    return this._skyHref;
  }

  @HostBinding('style.display')
  public styleDisplay = 'none';

  private _resolverSubscription: Subscription;

  private _routeUrl = '';

  private _userHasAccess = false;

  private _href: string;

  private _queryParams: Object = {};

  private _skyHref = '';

  constructor(
    private changeDetection: ChangeDetectorRef,
    private zone: NgZone,
    @Optional() private skyAppConfig?: SkyAppConfig,
    @Optional() private paramsProvider?: SkyAppRuntimeConfigParamsProvider,
    @Optional() private hrefResolver?: SkyHrefResolverAggregateService
  ) {
  }

  /** @nodoc */
  public ngOnDestroy(): void {
    this._resolverSubscription?.unsubscribe();
  }

  public ngOnInit(): void {
    if (this.hrefResolver && this.skyAppConfig) {
      setTimeout(async () => await this.hrefResolver.init(this.skyAppConfig));
    }
  }

  private updateTargetUrlAndHref(): void {
    if (!this._routeUrl || !this._userHasAccess) {
      this.href = '';
      return;
    }
    let queryParams: SkyHrefQueryParams = {};
    let [baseUrl, searchFragment] = this._routeUrl.split('?', 2);
    let search, fragment;
    if (searchFragment) {
      [search, fragment] = searchFragment.split('#', 2);
    } else {
      [search, fragment] = ['', ''];
    }
    let searchParams = new HttpParams({fromString: search});
    if (search) {
      searchParams.keys().forEach((key) => {
        queryParams[key] = searchParams.get(key);
      });
    }
    const queryParamsMerged = new HttpParams({
      fromObject: Object.assign(
        {},
        this.getSkyuxParams() || {},
        queryParams || {},
        this._queryParams || {}
      )
    });
    this.href = baseUrl +
      (queryParamsMerged.keys().length > 0 ? '?' + queryParamsMerged.toString() : '') +
      (fragment ? `#${fragment}` : '');
  }

  private getSkyuxParams(): SkyHrefQueryParams {
    return typeof this.skyAppConfig.runtime?.params?.getAll === 'function'
      ? this.skyAppConfig.runtime?.params?.getAll(true)
      : this.paramsProvider.params?.getAll(true);
  }

  private checkRouteAccess() {
    this.zone.runOutsideAngular(() => {
      this._userHasAccess = false;
      /* istanbul ignore else */
      if (this.hrefResolver && this._skyHref) {
        if (this._resolverSubscription) {
          this._resolverSubscription.unsubscribe();
        }
        this._routeUrl = '';
        try {
          this._resolverSubscription = this.hrefResolver
            .resolveHref$(this._skyHref)
            .subscribe((route) => {
              if (route.userHasAccess) {
                this.zone.run(() => {
                  this._userHasAccess = true;
                  if (this._routeUrl !== route.url) {
                    this._routeUrl = route.url;
                    this.updateTargetUrlAndHref();
                  }
                  this.updateView();
                });
              } else {
                this.updateTargetUrlAndHref();
                this.updateView();
              }
            });
        } catch (e) {
          this.updateView();
          this.changeDetection.markForCheck();
        }
      }
    });
  }

  private updateView(): void {
    this.styleDisplay = this._userHasAccess ? '' : 'none';
  }
}
