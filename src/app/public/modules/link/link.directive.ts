import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit
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

import {
  SkyAppLinkQueryParams
} from './link-query-params';

@Directive({
  selector: '[skyAppLink]'
})
export class SkyAppLinkDirective extends RouterLinkWithHref implements OnInit, OnDestroy {

  @Input()
  set skyAppLink(commands: any[] | string) {
    this.routerLink = commands;
  }

  private observer: MutationObserver;

  constructor(
    router: Router,
    route: ActivatedRoute,
    locationStrategy: LocationStrategy,
    private skyAppConfig: SkyAppConfig,
    private elementRef: ElementRef
  ) {
    super(router, route, locationStrategy);
  }

  public ngOnInit(): void {
    this.updateDirective();
    this.listenQueryParamsAttributeChange();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.observer.disconnect();
  }

  private updateDirective(): void {
    this.queryParams = this.mergeQueryParams();
    // Trigger change detection with router link.
    // See: https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts#L362-L365
    super.ngOnChanges(undefined);
  }

  private mergeQueryParams(): SkyAppLinkQueryParams {
    return Object.assign(
      {},
      this.queryParams,
      this.skyAppConfig.runtime.params.getAll(true)
    );
  }

  /**
   * Watch for attribute changes to the anchor element so we can extend the query params afterwards.
   * A MutationObserver is needed because the extended class owns the `queryParams` property, as well as the `ngOnChanges` lifecycle hook. Overwriting the `queryParams` property with an accessor (get/set) causes a TypeScript compilation error, and overwriting the `ngOnChanges` method may cause unknown problems, so to extend the `queryParams`, we must do it after Angular's router link updates the query params attribute on the anchor tag.
   */
  private listenQueryParamsAttributeChange(): void {
    this.observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.attributeName === 'ng-reflect-query-params') {
          this.updateDirective();
        }
      }
    });

    this.observer.observe(this.elementRef.nativeElement, {
      attributes: true
    });
  }

}
