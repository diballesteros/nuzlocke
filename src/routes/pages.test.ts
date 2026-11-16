import routerSource from './AppRouter.tsx?raw';
import { preloadRoute, ROUTE_PAGES } from './pages';

const routerPaths = [...routerSource.matchAll(/\bpath="([^"]+)"/g)].map((match) => match[1]);

describe('route pages', () => {
  it('has a page for every route in AppRouter', () => {
    expect(Object.keys(ROUTE_PAGES).sort()).toEqual([...routerPaths].sort());
  });

  it('gives every page its own loader', () => {
    expect(new Set(Object.values(ROUTE_PAGES)).size).toBe(Object.keys(ROUTE_PAGES).length);
  });

  it.each([
    ['/', '/'],
    ['/rules', '/rules'],
    ['/badgedetail/4/2', '/badgedetail/:game/:badge'],
  ])('preloads the page %s renders', async (pathname, route) => {
    const page = ROUTE_PAGES[route];
    const preload = vi.spyOn(page, 'preload').mockResolvedValue(() => null);
    await preloadRoute(pathname);
    expect(preload).toHaveBeenCalledTimes(1);
    preload.mockRestore();
  });

  it('resolves for a path no route matches', async () => {
    const spies = Object.values(ROUTE_PAGES).map((page) => vi.spyOn(page, 'preload'));
    await expect(preloadRoute('/nowhere')).resolves.toBeUndefined();
    spies.forEach((spy) => {
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  it('resolves when a page fails to load', async () => {
    const preload = vi
      .spyOn(ROUTE_PAGES['/about'], 'preload')
      .mockRejectedValue(new Error('offline'));
    await expect(preloadRoute('/about')).resolves.toBeUndefined();
    preload.mockRestore();
  });
});
