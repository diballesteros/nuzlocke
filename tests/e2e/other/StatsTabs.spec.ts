// The Stats tabs on a phone (5v): five equal columns that fit at 375px in every language. German's
// long names ("In Ohnmacht gefallen") wrap inside their column rather than widen it, which would
// turn the tab list into a sideways scroller
import { expect, test } from '../../fixtures';
import { byTestId, navigate, selectGame, tabMenu } from '../helpers';

test.use({ viewport: { width: 375, height: 812 } });

for (const language of ['Deutsch', 'Español', 'English']) {
  test(`all five tabs fit on a phone in ${language}`, async ({ page }) => {
    await page.goto('/settings');
    await byTestId(page, 'settings-language').click();
    await page.getByRole('option', { name: language }).click();
    await navigate(page, 'stats');
    const tabs = tabMenu(page, 'secondary');
    await expect(tabs).toHaveCount(5);
    const list = page.locator('[data-slot="tabs-list"]').first();
    const { clientWidth, scrollWidth } = await list.evaluate((el) => ({
      clientWidth: el.clientWidth,
      scrollWidth: el.scrollWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
}

// The Settings panel (5v) is a popover under its button: it starts at the button's left edge, stays
// on screen, and closes on Escape with focus back on the button
test('the Settings panel opens under its button and closes on Escape', async ({ page }) => {
  await page.goto('/');
  // The toolbar shows once a game is chosen
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'stats');
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
  const button = byTestId(page, 'display-settings');
  await button.click();
  const panel = page.locator('[data-slot="popover-content"]');
  await expect(panel).toBeVisible();
  const [b, p] = await Promise.all([button.boundingBox(), panel.boundingBox()]);
  expect(p.y).toBeGreaterThanOrEqual(b.y + b.height);
  expect(p.x).toBeGreaterThanOrEqual(0);
  expect(p.x + p.width).toBeLessThanOrEqual(375);
  await page.keyboard.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(button).toBeFocused();
});
