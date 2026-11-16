import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import i18n from '@/i18n';
import indexHtml from '../../index.html?raw';
import routerSource from './AppRouter.tsx?raw';
import { canonicalUrl, OG_LOCALES, removeStaticMetadata, ROUTE_META_KEYS } from './metadata';
import RouteMeta from './RouteMeta';
import { SITE_URL, SITEMAP_ROUTES } from './sitemap';
import DE from 'locale/de/meta.json';
import EN from 'locale/en/meta.json';
import ES from 'locale/es/meta.json';

const LOCALES: Record<string, Record<string, { title: string; description: string }>> = {
  en: EN,
  es: ES,
  de: DE,
};
const routerPaths = [...routerSource.matchAll(/\bpath="([^"]+)"/g)].map((match) => match[1]);

const head = () => ({
  title: document.title,
  titles: document.head.querySelectorAll('title').length,
  description: document.head.querySelector('meta[name="description"]')?.getAttribute('content'),
  descriptions: document.head.querySelectorAll('meta[name="description"]').length,
  canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href'),
  canonicals: document.head.querySelectorAll('link[rel="canonical"]').length,
  robots: document.head.querySelector('meta[name="robots"]')?.getAttribute('content'),
  og: Object.fromEntries(
    [...document.head.querySelectorAll('meta[property^="og:"]')].map((node) => [
      node.getAttribute('property'),
      node.getAttribute('content'),
    ])
  ),
  twitter: Object.fromEntries(
    [...document.head.querySelectorAll('meta[name^="twitter:"]')].map((node) => [
      node.getAttribute('name'),
      node.getAttribute('content'),
    ])
  ),
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <RouteMeta />
    </MemoryRouter>
  );

describe('route metadata', () => {
  afterEach(async () => {
    await act(() => i18n.changeLanguage('en'));
  });

  it('has a key for every route in AppRouter', () => {
    expect(routerPaths.length).toBeGreaterThan(10);
    expect(Object.keys(ROUTE_META_KEYS).sort()).toEqual([...routerPaths].sort());
  });

  it.each(Object.keys(LOCALES))('%s has a title and description for every key', (language) => {
    const keys = [...new Set(Object.values(ROUTE_META_KEYS))].sort();
    expect(Object.keys(LOCALES[language]).sort()).toEqual(keys);
    const titles = new Set<string>();
    for (const key of keys) {
      const { title, description } = LOCALES[language][key];
      expect(title).toMatch(/Nuzlocke Tracker/);
      // Search results cut titles at about 60 characters and descriptions at about 160
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeGreaterThanOrEqual(50);
      expect(description.length).toBeLessThanOrEqual(180);
      titles.add(title);
    }
    expect(titles.size).toBe(keys.length);
  });

  it('gives each sitemap route its sitemap url as the canonical link', () => {
    for (const route of SITEMAP_ROUTES) expect(canonicalUrl(route)).toBe(`${SITE_URL}${route}`);
    expect(canonicalUrl('/settings')).toBeUndefined();
    expect(canonicalUrl(undefined)).toBeUndefined();
  });

  it.each(SITEMAP_ROUTES)('sets %s’s title, description, canonical and share tags', (route) => {
    renderAt(route);
    const { title, description } = EN[ROUTE_META_KEYS[route] as keyof typeof EN];
    expect(head()).toEqual({
      title,
      titles: 1,
      description,
      descriptions: 1,
      canonical: `${SITE_URL}${route}`,
      canonicals: 1,
      robots: undefined,
      og: {
        'og:title': title,
        'og:description': description,
        'og:url': `${SITE_URL}${route}`,
        'og:locale': 'en_US',
      },
      twitter: { 'twitter:title': title, 'twitter:description': description },
    });
  });

  it.each(['/settings', '/report', '/import', '/delete', '/badgedetail/13/1'])(
    'keeps %s out of the index',
    (path) => {
      renderAt(path);
      const { canonical, canonicals, robots, og, title } = head();
      expect({ canonical, canonicals, robots, url: og['og:url'] }).toEqual({
        canonical: undefined,
        canonicals: 0,
        robots: 'noindex',
        url: undefined,
      });
      expect(title).not.toBe(EN.tracker.title);
    }
  );

  it('keeps the home texts on an unknown url, without a canonical link', () => {
    renderAt('/no-such-page');
    expect(head()).toMatchObject({
      title: EN.tracker.title,
      canonicals: 0,
      robots: 'noindex',
    });
  });

  it('matches a trailing slash to its route', () => {
    renderAt('/rules/');
    expect(head().canonical).toBe(`${SITE_URL}/rules`);
  });

  it('follows the active language', async () => {
    renderAt('/calculator');
    await act(() => i18n.changeLanguage('de'));
    expect(head()).toMatchObject({
      title: DE.calculator.title,
      description: DE.calculator.description,
      og: { 'og:locale': OG_LOCALES.de, 'og:title': DE.calculator.title },
      twitter: { 'twitter:description': DE.calculator.description },
    });
    await act(() => i18n.changeLanguage('es'));
    expect(head()).toMatchObject({ title: ES.calculator.title, og: { 'og:locale': 'es_ES' } });
  });

  it('replaces the route’s tags on navigation', () => {
    const { unmount } = renderAt('/rules');
    unmount();
    expect(head()).toMatchObject({ titles: 0, descriptions: 0, canonicals: 0 });
  });
});

describe('index.html defaults', () => {
  const parsed = new DOMParser().parseFromString(indexHtml, 'text/html');
  const content = (selector: string) =>
    parsed.head.querySelector(selector)?.getAttribute('content');

  it('are the home page’s English tags, for crawlers that run no JavaScript', () => {
    expect(parsed.title).toBe(EN.tracker.title);
    expect(content('meta[name="description"]')).toBe(EN.tracker.description);
    expect(content('meta[property="og:title"]')).toBe(EN.tracker.title);
    expect(content('meta[property="og:description"]')).toBe(EN.tracker.description);
    expect(content('meta[property="og:url"]')).toBe(`${SITE_URL}/`);
    expect(content('meta[property="og:locale"]')).toBe(OG_LOCALES.en);
    expect(content('meta[name="twitter:title"]')).toBe(EN.tracker.title);
    expect(content('meta[name="twitter:description"]')).toBe(EN.tracker.description);
    expect(parsed.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE_URL}/`
    );
  });

  it('are all removed before the app renders its own, and nothing else is', () => {
    const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
    const before = doc.head.children.length;
    removeStaticMetadata(doc);
    // title, description, canonical, og:title, og:description, og:url, og:locale and twitter's two
    expect(before - doc.head.children.length).toBe(9);
    expect(doc.title).toBe('');
    for (const selector of [
      'meta[name="description"]',
      'link[rel="canonical"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:url"]',
      'meta[property="og:locale"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
    ])
      expect(doc.head.querySelector(selector)).toBeNull();
    // The share image, site name, card type and JSON-LD stay
    expect(doc.head.querySelector('meta[property="og:image"]')).not.toBeNull();
    expect(doc.head.querySelector('meta[property="og:site_name"]')).not.toBeNull();
    expect(doc.head.querySelector('meta[name="twitter:card"]')).not.toBeNull();
    expect(doc.head.querySelector('script[type="application/ld+json"]')).not.toBeNull();
  });
});
