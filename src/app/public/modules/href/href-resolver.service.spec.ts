import { TestBed } from '@angular/core/testing';
import { HrefResolverFixtureService } from './fixtures/href-resolver-fixture.service';
import { SkyHrefResolverAggregateService } from './href-resolver-aggregate.service';
import { SKY_HREF_RESOLVER } from './href-resolver-token';
import { SkyHrefResolverService } from './href-resolver.service';

describe('HREF Resolver Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyHrefResolverAggregateService,
          useClass: SkyHrefResolverAggregateService,
          deps: [
            SKY_HREF_RESOLVER
          ]
        },
        {
          provide: SKY_HREF_RESOLVER,
          useClass: SkyHrefResolverService,
          multi: true
        },
        {
          provide: SKY_HREF_RESOLVER,
          useClass: HrefResolverFixtureService,
          multi: true
        }
      ]
    });
  });

  it('should resolve an href through fixture', () => {
    const fixtureService = new HrefResolverFixtureService();
    let resolved = false;
    const subscription = fixtureService.resolveHref$('nope://example.com/page').subscribe((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeFalse();
    });
    expect(resolved).toBeTrue();
    subscription.unsubscribe();
    expect(subscription.closed).toBeTrue();
  });

  it('should resolve an https href', () => {
    const fixtureService = new SkyHrefResolverService();
    let resolved = false;
    const subscription = fixtureService.resolveHref$('https://example.com/page').subscribe((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeTrue();
    });
    expect(resolved).toBeTrue();
    subscription.unsubscribe();
    expect(subscription.closed).toBeTrue();
  });

  it('should resolve using multiple resolvers', () => {
    const fixtureService = TestBed.inject(SkyHrefResolverAggregateService);
    let resolved = false;
    const noAccessSubscription = fixtureService.resolveHref$('nope://example.com/page').subscribe((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeFalse();
    });
    expect(resolved).toBeTrue();
    resolved = false;
    const httpsSubscription = fixtureService.resolveHref$('https://example.com/page').subscribe((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeTrue();
    });
    expect(resolved).toBeTrue();
    httpsSubscription.unsubscribe();
    noAccessSubscription.unsubscribe();
    expect(httpsSubscription.closed).toBeTrue();
    expect(noAccessSubscription.closed).toBeTrue();
  });
});
