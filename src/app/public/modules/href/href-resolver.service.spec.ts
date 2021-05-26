import { SkyHrefResolverService } from './href-resolver.service';

describe('HREF Resolver Service', () => {
  it('should resolve an https href', async () => {
    const fixtureService = new SkyHrefResolverService();

    let resolved = false;
    return fixtureService.resolveHref({url: 'https://example.com/page'}).then((route) => {
      resolved = true;
      expect(route.userHasAccess).toBeTrue();
    }).finally(() => {
      expect(resolved).toBeTrue();
    });
  });
});
