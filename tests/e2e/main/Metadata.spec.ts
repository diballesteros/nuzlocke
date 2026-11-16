// Each route's own title, description, canonical link and share tags (src/routes/RouteMeta.tsx),
// hoisted into <head> by React 19. index.html's static copies of the home page's tags are there for
// crawlers that run no JavaScript, and go before the app renders, so a browser (and Google's
// renderer) sees one of each.
import { expect, type Page, test } from '../../fixtures';
import { byTestId, navigate } from '../helpers';
import DE from '../../../src/locale/de/meta.json' with { type: 'json' };
import EN from '../../../src/locale/en/meta.json' with { type: 'json' };
import { ROUTE_META_KEYS } from '../../../src/routes/metadata';
import { SITE_URL, SITEMAP_ROUTES } from '../../../src/routes/sitemap';

type Key = keyof typeof EN;

const head = (page: Page) =>
  page.evaluate(() => {
    const all = (selector: string) =>
      [...document.head.querySelectorAll(selector)].map(
        (node) => node.getAttribute('content') ?? node.getAttribute('href')
      );
    return {
      title: [...document.head.querySelectorAll('title')].map((node) => node.textContent),
      documentTitle: document.title,
      description: all('meta[name="description"]'),
      canonical: all('link[rel="canonical"]'),
      robots: all('meta[name="robots"]'),
      ogTitle: all('meta[property="og:title"]'),
      ogDescription: all('meta[property="og:description"]'),
      ogUrl: all('meta[property="og:url"]'),
      ogLocale: all('meta[property="og:locale"]'),
      ogImage: all('meta[property="og:image"]'),
      twitterTitle: all('meta[name="twitter:title"]'),
      twitterDescription: all('meta[name="twitter:description"]'),
      jsonLd: document.head.querySelectorAll('script[type="application/ld+json"]').length,
    };
  });

const expected = (route: string, texts: typeof EN = EN, locale = 'en_US') => {
  const { title, description } = texts[ROUTE_META_KEYS[route] as Key];
  return {
    title: [title],
    documentTitle: title,
    description: [description],
    canonical: [`${SITE_URL}${route}`],
    robots: [] as string[],
    ogTitle: [title],
    ogDescription: [description],
    ogUrl: [`${SITE_URL}${route}`],
    ogLocale: [locale],
    ogImage: [`${SITE_URL}/og-image.png`],
    twitterTitle: [title],
    twitterDescription: [description],
    jsonLd: 1,
  };
};

for (const route of SITEMAP_ROUTES) {
  test(`${route} has its own title, description and canonical link, once each`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page).toHaveTitle(EN[ROUTE_META_KEYS[route] as Key].title);
    expect(await head(page)).toEqual(expected(route));
  });
}

test('a page that is not in the sitemap is noindex, without a canonical link', async ({ page }) => {
  await page.goto('/settings');
  await expect(page).toHaveTitle(EN.settings.title);
  expect(await head(page)).toMatchObject({
    title: [EN.settings.title],
    description: [EN.settings.description],
    canonical: [],
    robots: ['noindex'],
    ogUrl: [],
  });
});

test('the tags follow in-app navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Rules' }).click();
  await expect(page).toHaveTitle(EN.rules.title);
  expect(await head(page)).toEqual(expected('/rules'));
  await navigate(page, 'about');
  await expect(page).toHaveTitle(EN.about.title);
  expect(await head(page)).toEqual(expected('/about'));
});

test('the tags follow the chosen language', async ({ page }) => {
  await page.goto('/settings');
  await byTestId(page, 'settings-language').click();
  await page.getByRole('option', { name: 'Deutsch' }).click();
  await expect(page).toHaveTitle(DE.settings.title);
  await page.getByRole('navigation').getByRole('link', { name: 'Builder' }).click();
  await expect(page).toHaveTitle(DE.builder.title);
  expect(await head(page)).toEqual(expected('/builder', DE, 'de_DE'));
  // The language is saved, so a reload starts in German
  await page.reload();
  await expect(page).toHaveTitle(DE.builder.title);
  expect(await head(page)).toEqual(expected('/builder', DE, 'de_DE'));
});

test('a crawler that runs no JavaScript reads the home page’s tags, once each', async ({
  page,
}) => {
  // The Report form's hidden copy has a description field too, hence the <meta
  const html = await (await page.request.get('/rules')).text();
  const count = (pattern: RegExp) => html.match(pattern)?.length ?? 0;
  expect(count(/<title[ >]/g)).toBe(1);
  expect(count(/<meta\s[^>]*name="description"/g)).toBe(1);
  expect(count(/<link\s[^>]*rel="canonical"/g)).toBe(1);
  expect(count(/<meta\s[^>]*property="og:title"/g)).toBe(1);
  expect(html).toContain(`<title data-static-meta>${EN.tracker.title}</title>`);
  expect(html).toContain(`href="${SITE_URL}/"`);
});
