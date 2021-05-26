import { TestBed } from '@angular/core/testing';
import { HrefResolverFixtureService } from './fixtures/href-resolver-fixture.service';
import { SkyHrefResolverService } from './href-resolver.service';

describe('HREF Resolver Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyHrefResolverService,
          useClass: HrefResolverFixtureService
        }
      ]
    });
  });

  it('should resolve an href through fixture', () => {
    const fixtureService = new HrefResolverFixtureService();

    let resolved = false;
    fixtureService.resolveHref('nope://example.com/page').then((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeFalse();
    }).finally(() => {
      expect(resolved).toBeTrue();
    });
  });

  it('should resolve an https href', () => {
    const fixtureService = new SkyHrefResolverService();

    let resolved = false;
    fixtureService.resolveHref('https://example.com/page').then((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeTrue();
    }).finally(() => {
      expect(resolved).toBeTrue();
    });
  });
});
