// The Stats tabs on a phone (5v): five equal columns that fit at 375px in every language. German's
// long names ("In Ohnmacht gefallen") wrap inside their column rather than widen it, which would
// turn the tab list into a sideways scroller
import { expect, test } from '../../fixtures';
import { byTestId, navigate, tabMenu } from '../helpers';

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
