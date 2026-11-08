// On phones the Calculator's result card and Pokémon switch stick to the top of the page. A field
// reached with the keyboard must scroll clear of them, not land underneath (the scroller's padding
// follows the stuck block's measured height).
import { expect, type Locator, type Page, test } from '../../fixtures';
import { byTestId, navigate, selectGame } from '../helpers';

// Whether the element at the centre of the focused control is that control, inside it, or its
// label (a native radio's label surrounds it)
const focusedIsOnTop = (page: Page) =>
  page.evaluate(() => {
    const el = document.activeElement as HTMLButtonElement;
    const box = el.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const labels = Array.from(el.labels ?? []);
    return (
      !!hit &&
      (hit === el || el.contains(hit) || hit.contains(el) || labels.some((l) => l.contains(hit)))
    );
  });

// From the end of the form, Shift+Tab up to the target, checking every stop on the way. It starts
// at the last side-condition toggle, already in view: WebKit on Linux doesn't scroll an off-screen
// element into view on a programmatic focus(), where keyboard focus does. Not at the Spikes radios:
// in Firefox, Shift+Tab out of a Radix radio group comes straight back to it. Each stop is polled:
// WebKit finishes scrolling to the focused field a moment after the key
const shiftTabTo = async (page: Page, target: Locator) => {
  await page.locator('#calculator').evaluate((el) => el.scrollTo(0, el.scrollHeight));
  await byTestId(page, 'isSwitching1').focus();
  await expect.poll(() => focusedIsOnTop(page)).toBe(true);
  for (let i = 0; i < 60; i += 1) {
    if (await target.evaluate((el) => el.contains(document.activeElement))) return;
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => focusedIsOnTop(page)).toBe(true);
  }
  throw new Error('The target was never focused');
};

test.describe('Calculator on a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('A field reached with the keyboard is not hidden under the stuck result', async ({
    page,
  }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
    await navigate(page, 'calculator');
    await expect(byTestId(page, 'pokemon1-tab')).toBeVisible();
    // The sidebar stays mounted for its slide-out and would cover the page
    await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);

    await shiftTabTo(page, byTestId(page, 'item1'));

    // With the results list open the stuck block is taller, and a field still clears it
    await byTestId(page, 'expand-moves').click();
    await shiftTabTo(page, byTestId(page, 'item1'));
  });
});
