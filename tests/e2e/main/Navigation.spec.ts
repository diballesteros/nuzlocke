// The page nav is shown at every width: a column from 1148px, a row above the page down to 571px
// and a tab bar at the bottom of the screen below that. The visual baselines cover the column
// (desktop) and the tab bar (mobile); these pin that each form is shown and navigates.
import { expect, type Page, test } from '../../fixtures';

const nav = (page: Page) => page.getByRole('navigation');

for (const { name, width, layout } of [
  { name: 'column', width: 1280, layout: 'column' },
  { name: 'row', width: 800, layout: 'row' },
  { name: 'tab bar', width: 375, layout: 'row' },
]) {
  test(`the page nav as a ${name} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    await expect(nav(page)).toBeVisible();
    await expect(nav(page)).toHaveCSS('flex-direction', layout);
    await expect(nav(page).getByRole('link')).toHaveCount(5);
    await nav(page).getByRole('link', { name: 'Rules' }).click();
    await expect(page).toHaveURL(/\/rules$/);
    await expect(nav(page).getByRole('link', { name: 'Rules' })).toHaveAttribute(
      'aria-current',
      'page'
    );
  });
}

test('the tab bar sits at the bottom of the screen, below the page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const bar = await nav(page).boundingBox();
  expect(bar?.y && bar.y + bar.height).toBe(800);
  const content = await page.locator('main > div').boundingBox();
  expect(content && content.y + content.height).toBe(bar?.y);
});
