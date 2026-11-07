// On phones the Calculator's result card and Pokémon switch stick to the top of the page. A field
// reached with Tab must scroll clear of them, not land underneath (the scroller's padding follows
// the stuck block's measured height).
import { expect, type Locator, type Page, test } from '../../fixtures';
import { byTestId, navigate, selectGame } from '../helpers';

// Whether the element at the centre of the focused control is that control (or inside it)
const focusedIsOnTop = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const box = el.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return !!hit && (hit === el || el.contains(hit) || hit.contains(el));
  });

const tabTo = async (page: Page, target: Locator) => {
  for (let i = 0; i < 12; i += 1) {
    if (await target.evaluate((el) => el.contains(document.activeElement))) return;
    await page.keyboard.press('Tab');
    expect(await focusedIsOnTop(page)).toBe(true);
  }
  throw new Error('The target was never focused');
};

test.describe('Calculator on a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('A field reached with Tab is not hidden under the stuck result', async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
    await navigate(page, 'calculator');
    await expect(byTestId(page, 'pokemon1-tab')).toBeVisible();

    // Stuck: scroll the form to its end, then Tab from the level field up to the item field
    await page.locator('#calculator').evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await byTestId(page, 'level-input1').focus();
    expect(await focusedIsOnTop(page)).toBe(true);
    await tabTo(page, byTestId(page, 'item1'));

    // With the results list open the stuck block is taller, and a field still clears it
    await byTestId(page, 'expand-moves').click();
    await page.locator('#calculator').evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await byTestId(page, 'level-input1').focus();
    expect(await focusedIsOnTop(page)).toBe(true);
  });
});
