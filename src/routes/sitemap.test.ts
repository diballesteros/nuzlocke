import routerSource from './AppRouter.tsx?raw';
import { buildSitemap, SITE_URL, SITEMAP_ROUTES, UNINDEXED_ROUTES } from './sitemap';

const routerPaths = [...routerSource.matchAll(/\bpath="([^"]+)"/g)].map((match) => match[1]);

describe('sitemap', () => {
  it('reads the routes from AppRouter', () => {
    expect(routerPaths).toContain('/');
    expect(routerPaths).toContain('/delete');
  });

  it('lists or deliberately leaves out every route', () => {
    const unindexed = Object.keys(UNINDEXED_ROUTES);
    expect([...SITEMAP_ROUTES, ...unindexed].sort()).toEqual([...routerPaths].sort());
    expect(SITEMAP_ROUTES.filter((route) => unindexed.includes(route))).toEqual([]);
  });

  it('has a url for each listed route', () => {
    const xml = buildSitemap('2026-10-28');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toEqual(SITEMAP_ROUTES.map((route) => `${SITE_URL}${route}`));
    expect(xml.match(/<lastmod>2026-10-28<\/lastmod>/g)).toHaveLength(SITEMAP_ROUTES.length);
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<urlset /);
  });

  it('is linked from robots.txt', async () => {
    const { default: robots } = await import('../../public/robots.txt?raw');
    expect(robots).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });
});
