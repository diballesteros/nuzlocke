import { expect, type Page, test } from '../../fixtures';
import { navigate } from '../helpers';

const SITE = 'https://nuzlocke.netlify.app';

// Firefox and WebKit don't show a beacon to page.route, so read what the app hands to the browser
const recordBeacons = () => {
  const bodies: Promise<string>[] = [];
  (window as unknown as { beacons: () => Promise<string[]> }).beacons = () => Promise.all(bodies);
  navigator.sendBeacon = (_url, body) => {
    bodies.push((body as Blob).text());
    return true;
  };
};

const beaconPaths = (page: Page) =>
  page.evaluate(async () => {
    const { beacons } = window as unknown as { beacons: () => Promise<string[]> };
    return (await beacons()).map((body) => (JSON.parse(body) as { p: string }).p);
  });

test.describe('Analytics', () => {
  test('a route change sends one beacon', async ({ page, baseURL }) => {
    await page.addInitScript(recordBeacons);
    // The dev server under the production host, the only one that counts
    await page.route(
      (url) => url.origin === SITE,
      async (route) => {
        const { pathname, search } = new URL(route.request().url());
        await route.fulfill({
          response: await route.fetch({
            url: `${baseURL}${pathname}${search}`,
            // Firefox keeps the original Host, which Vite rejects
            headers: { ...route.request().headers(), host: new URL(baseURL).host },
          }),
        });
      }
    );
    await page.goto(`${SITE}/`);
    // Every module goes through page.route, which is slow on a first load
    await expect.poll(() => beaconPaths(page), { timeout: 45_000 }).toEqual(['/']);

    await navigate(page, 'rules');
    await expect.poll(() => beaconPaths(page)).toEqual(['/', '/rules']);
    // Nothing else follows it
    await page.waitForTimeout(500);
    expect(await beaconPaths(page)).toEqual(['/', '/rules']);
  });

  test('localhost sends none', async ({ page }) => {
    const beacons: string[] = [];
    page.on('request', (request) => {
      if (request.url().includes('/api/event')) beacons.push(request.url());
    });
    await page.goto('/');
    await navigate(page, 'rules');
    await expect(page.getByTestId('rules')).toBeHidden();
    expect(beacons).toEqual([]);
  });
});
