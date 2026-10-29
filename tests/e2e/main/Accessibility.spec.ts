import { expect, test } from '../../fixtures';
import { byTestId, navigate, selectGame, text } from '../helpers';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
  });

  test('Keyboard Navigation', async ({ page }) => {
    const pressEnter = async (id: string) => {
      const element = byTestId(page, id).first();
      await expect(element).toBeVisible();
      await element.focus();
      await element.press('Enter');
    };

    await pressEnter('badge-detail-0');
    await text(page, 'Back').click();

    await pressEnter('pokemon-selector');
    await text(page, 'Cancel').click();

    await navigate(page, 'calculator');

    await pressEnter('expand-moves');
    await pressEnter('attacker-result-2');
    await pressEnter('defender-result-3');

    await page.setViewportSize({ width: 414, height: 736 });

    await pressEnter('pokemon2-tab');
    await pressEnter('pokemon1-tab');
  });

  test('Row menu and location list by keyboard', async ({ page }) => {
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');

    // The row menu's items are menuitems that Enter and Space act on. Leveling re-renders the row,
    // which closes its menu (as a click does), so it's opened again each time
    const levelUp = page.getByRole('menuitem', { name: 'level up encounter' });
    for (const [key, level] of [
      ['Enter', '(1)'],
      [' ', '(2)'],
    ]) {
      await byTestId(page, 'encounter-options-0').click();
      await levelUp.focus();
      await levelUp.press(key);
      await byTestId(page, 'encounter-options-0').click();
      await expect(levelUp).toContainText(level);
      await byTestId(page, 'encounter-options-0').click();
      await expect(levelUp).toHaveCount(0);
    }

    // Each location in the list is a button; Enter scrolls to it and closes the list
    await byTestId(page, 'open-scroll-list').click();
    const location = byTestId(page, 'scroll-to-encounter-5').getByRole('button').first();
    await location.focus();
    await location.press('Enter');
    await expect(byTestId(page, 'scroll-to-encounter-5')).toHaveCount(0);
  });
});
