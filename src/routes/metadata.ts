// Each route's title and description, read by RouteMeta. Like sitemap.ts it uses no path aliases,
// so a build step (pre-rendering) can read it with the locale files
import { SITE_URL, SITEMAP_ROUTES } from './sitemap';

// The `meta` locale namespace's key for each route in AppRouter.tsx; metadata.test.ts checks it
export const ROUTE_META_KEYS: Record<string, string> = {
  '/': 'tracker',
  '/rules': 'rules',
  '/stats': 'stats',
  '/builder': 'builder',
  '/calculator': 'calculator',
  '/settings': 'settings',
  '/report': 'report',
  '/changelog': 'changelog',
  '/about': 'about',
  '/import': 'import',
  '/badgedetail/:game/:badge': 'badge',
  '/delete': 'delete',
};

// og:locale for each language the app has
export const OG_LOCALES: Record<string, string> = { en: 'en_US', es: 'es_ES', de: 'de_DE' };

// The sitemap's routes are canonical at their sitemap url. The rest (and unknown urls) aren't
// indexed, so they get robots noindex instead of a canonical link
export function canonicalUrl(route: string | undefined): string | undefined {
  return route && SITEMAP_ROUTES.includes(route) ? `${SITE_URL}${route}` : undefined;
}

// index.html carries the home page's tags for crawlers that don't run JavaScript. RouteMeta
// renders each route's own, which React hoists into <head> without replacing the static ones, so
// the static ones go before the first render (otherwise the first <title> would win)
export function removeStaticMetadata(doc: Document = document): void {
  doc.head.querySelectorAll('[data-static-meta]').forEach((node) => node.remove());
}
