// Read by vite.config.ts, which writes sitemap.xml into the build. Not imported by the app, so it
// uses no path aliases

export const SITE_URL = 'https://nuzlocke.netlify.app';

// Every route in AppRouter.tsx is listed here or in UNINDEXED_ROUTES; sitemap.test.ts checks it
export const SITEMAP_ROUTES = [
  '/',
  '/rules',
  '/stats',
  '/builder',
  '/calculator',
  '/changelog',
  '/about',
];

// Routes left out of the sitemap, and why
export const UNINDEXED_ROUTES: Record<string, string> = {
  '/settings': 'per-device preferences, nothing to search for',
  '/report': 'a feedback form',
  '/import': 'a file upload for the user’s own saves',
  '/delete': 'a notice that accounts were discontinued, kept for old links',
  '/badgedetail/:game/:badge': 'redirects to / unless the visitor’s own run has that game selected',
};

// lastmod is a W3C date (YYYY-MM-DD)
export function buildSitemap(lastmod: string): string {
  const urls = SITEMAP_ROUTES.map(
    (route) =>
      `  <url>\n    <loc>${SITE_URL}${route}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
  );
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
