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
});
