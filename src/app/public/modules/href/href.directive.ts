import { HttpParams } from '@angular/common/http';
import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2
} from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { SkyAppConfig, SkyAppRuntimeConfigParamsProvider } from '@skyux/config';

import { Subscription } from 'rxjs';

import { SkyHrefQueryParams } from './href-query-params';

import { SkyHrefResolverAggregateService } from './href-resolver-aggregate.service';
import { AppRoute } from './types/app-route';

@Directive({
  selector: '[skyHref]'
})
export class SkyHrefDirective implements OnDestroy, OnInit {

  @HostBinding('style.display')
  public styleDisplay = 'none';

  @Input()
  public skipLocationChange = false;

  @Input()
  public replaceUrl = false;

  @Input()
  public state?: {[k: string]: any};

  @HostBinding('href')
  public get href(): string {
    return this._href || '';
  }

  public set href(value: string) {
    this._href = value.toLowerCase();
  }

  @Input()
  public set queryParams(value: SkyHrefQueryParams) {
    this._queryParams = value;
    this.updateTargetUrlAndView();
  }

  @Input()
  public set skyHref(skyHref: string) {
    this._skyHref = skyHref;
    this.checkRouteAccess();
  }

  @Input()
  public set skyHrefElse(value: 'hide' | 'unlink') {
    this._skyHrefElse = value;
    this.updateTargetUrlAndView();
  }

  @HostBinding('target')
  public target: string | undefined;

  private _resolverSubscription: Subscription;

  private _route: AppRoute | false = false;

  private _userHasAccess = false;

  private _href: string;

  private _queryParams: Object = {};

  private _skyHref = '';

  private _skyHrefElse: 'hide' | 'unlink' = 'hide';

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private element: ElementRef,
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
    /* istanbul ignore else */
    if (this.hrefResolver && this.skyAppConfig) {
      setTimeout(() => this.hrefResolver.init(this.skyAppConfig));
    }
  }

  /* istanbul ignore next */
  @HostListener(
    'click',
    ['$event.button', '$event.ctrlKey', '$event.shiftKey', '$event.altKey', '$event.metaKey'])
  public onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean):
    boolean {
    if (!this._userHasAccess) {
      return false;
    }

    if (button !== 0 || ctrlKey || shiftKey || altKey || metaKey) {
      return true;
    }

    if (typeof this.target === 'string' && this.target !== '_self') {
      return true;
    }

    const urlTree = this.getUrlTree();
    if (urlTree) {
      const extras = {
        skipLocationChange: attrBoolValue(this.skipLocationChange),
        replaceUrl: attrBoolValue(this.replaceUrl),
        state: this.state
      };
      this.router.navigateByUrl(urlTree, extras);
      return false;
    }
    return true;
  }

  private checkRouteAccess() {
    this._userHasAccess = false;
    /* istanbul ignore else */
    if (this.hrefResolver && this._skyHref) {
      if (this._resolverSubscription) {
        this._resolverSubscription.unsubscribe();
      }
      this._route = false;
      try {
        this._resolverSubscription = this.hrefResolver
          .resolveHref$(this._skyHref)
          .subscribe((route) => {
            this._route = {...route};
            this._userHasAccess = route.userHasAccess;
            this.updateTargetUrlAndView();
          });
      } catch (e) {
        this.updateTargetUrlAndView();
      }
    }
  }

  private getSkyuxParams(): SkyHrefQueryParams {
    return typeof this.skyAppConfig.runtime?.params?.getAll === 'function'
      ? this.skyAppConfig.runtime?.params?.getAll(true)
      : this.paramsProvider.params?.getAll(true);
  }

  /* istanbul ignore next */
  private getUrlTree(): UrlTree | false {
    if (!this._href || !this.skyAppConfig.skyux.host?.url || !this.skyAppConfig.runtime.app?.base) {
      return false;
    }
    const baseUrl = (
      this.skyAppConfig.skyux.host.url +
      this.skyAppConfig.runtime.app.base.substr(0, this.skyAppConfig.runtime.app.base.length - 1)
    ).toLowerCase();

    if (
      this._href === baseUrl ||
      // Make sure the base URL is not simply a partial match of the base URL plus additional
      // characters after the base URL that are not "terminating" characters
      this._href.indexOf(baseUrl + '/') === 0 ||
      this._href.indexOf(baseUrl + '?') === 0
    ) {
      const routePath = this._href.substring(baseUrl.length);
      return this.router.parseUrl(routePath);
    }

    return false;
  }

  private updateTargetUrlAndView(): void {
    if (!this._route || !this._userHasAccess) {
      this.href = '';
      this.renderer.removeAttribute(this.element.nativeElement, 'href');
      if (this._skyHrefElse === 'hide') {
        this.styleDisplay = 'none';
      } else {
        this.styleDisplay = '';
      }
      return;
    }
    let queryParams: SkyHrefQueryParams = {};
    let [baseUrl, searchFragment] = this._route.url.split('?', 2);
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
    this.styleDisplay = '';
  }
}

/* istanbul ignore next */
function attrBoolValue(s: any): boolean {
  return s === '' || !!s;
}
