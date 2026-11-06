// The redesigned tracker rows (5m): the list fills the page, the row menu is a keyboard menu, Reset
// asks first, rows are named by their location, and compact rows keep every action in the menu.
import { expect, type Page, test } from '../../fixtures';
import {
  byTestId,
  dropdownText,
  importFile,
  modalDialog,
  navigate,
  pickOption,
  pressEscape,
  selectGame,
} from '../helpers';

const pickScorbunny = async (page: Page) => {
  await byTestId(page, 'pokemon-0').click();
  await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
};

test.describe('Tracker rows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
  });

  test('The list fills the page down to the Go to bar', async ({ page }) => {
    for (const height of [660, 900]) {
      await page.setViewportSize({ width: 1000, height });
      const list = await byTestId(page, 'encounters-list').boundingBox();
      const bar = await byTestId(page, 'open-notes').locator('..').boundingBox();
      // The list ends where the bar's gap begins (8px), whatever the window's height
      expect(Math.round(bar.y - (list.y + list.height))).toBe(8);
    }
  });

  test('Rows are named by their location', async ({ page }) => {
    await expect(page.getByRole('listitem', { name: 'Starter' })).toBeVisible();
  });

  test('The row menu works from the keyboard', async ({ page }) => {
    await pickScorbunny(page);
    await byTestId(page, 'encounter-options-0').press('Enter');
    const menu = page.getByRole('menu');
    await expect(menu).toBeVisible();
    // Opened from the keyboard, the menu focuses its first item
    await expect(byTestId(page, 'level-up-0')).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(byTestId(page, 'move-down-0')).toBeFocused();
    await pressEscape(page);
    await expect(menu).toHaveCount(0);
    await expect(byTestId(page, 'encounter-options-0')).toBeFocused();
  });

  // 5n: rows are keyed by their place, so focus used to stay where the row was, on its neighbour
  test('Moving a row from the keyboard keeps focus on it', async ({ page }) => {
    const location = (index: number) =>
      byTestId(page, `encounter-${index}`).locator('[id^="encounter-location-"]');
    const moved = await location(1).textContent();

    await byTestId(page, 'encounter-options-1').press('Enter');
    await expect(byTestId(page, 'move-up-1')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(location(0)).toHaveText(moved);
    await expect(byTestId(page, 'encounter-options-0')).toBeFocused();

    await byTestId(page, 'encounter-options-0').press('Enter');
    await expect(byTestId(page, 'move-down-0')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('menu')).toHaveCount(0);
    await expect(location(1)).toHaveText(moved);
    await expect(byTestId(page, 'encounter-options-1')).toBeFocused();
  });

  test('Cancelling Reset leaves the row as it was', async ({ page }) => {
    await pickScorbunny(page);
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'reset-encounter-0').click();
    await expect(page.getByRole('dialog')).toContainText('Starter');
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(byTestId(page, 'pokemon-0')).toContainText('Scorbunny');
  });

  test('Compact rows on a phone keep every action in the menu', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await pickScorbunny(page);
    await pickOption(page, 'status-0', 'Captured');
    await expect(byTestId(page, 'level-up-button-0')).toHaveCount(0);
    await expect(byTestId(page, 'swap-0')).toHaveCount(0);

    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'level-up-0').click();
    await byTestId(page, 'encounter-options-0').click();
    await expect(byTestId(page, 'level-up-0')).toContainText('(1)');
    await byTestId(page, 'menu-team-0').click();
    await expect(dropdownText(page, 'status-0')).toHaveText('Team');

    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'menu-nature-0').click();
    await page.getByRole('menuitemradio', { name: 'Bold' }).click();
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'menu-evolve-0').click();
    await expect(page.getByRole('dialog')).toContainText('Raboot');
    await pressEscape(page);
    await expect(modalDialog(page)).toHaveCount(0);

    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'menu-edit-0').click();
    await expect(byTestId(page, 'nature')).toContainText('Bold');
  });

  test('Wide compact rows keep the level, status and Team inline', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await byTestId(page, 'settings-nickname').click();
    await navigate(page, 'tracker');
    await pickScorbunny(page);
    await pickOption(page, 'status-0', 'Captured');
    await expect(byTestId(page, 'nickname-0')).toBeVisible();
    await expect(byTestId(page, 'evolve-0}')).toHaveCount(0);
    await byTestId(page, 'swap-0').click();
    await expect(dropdownText(page, 'status-0')).toHaveText('Team');
    await expect(byTestId(page, 'swap-0')).toHaveAccessibleName('Box');

    // The menu holds what the row has no room for, and the natures open inside it
    await byTestId(page, 'encounter-options-0').click();
    await expect(byTestId(page, 'menu-team-0')).toHaveCount(0);
    await expect(byTestId(page, 'menu-evolve-0')).toBeVisible();
    await byTestId(page, 'menu-nature-0').click();
    await expect(byTestId(page, 'menu-nature-back-0')).toBeFocused();
    await byTestId(page, 'menu-nature-back-0').click();
    await expect(byTestId(page, 'menu-edit-0')).toBeVisible();
    await pressEscape(page);
  });

  test('Wide compact rows line up their nickname fields', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await byTestId(page, 'settings-nickname').click();
    await navigate(page, 'tracker');
    await pickScorbunny(page);
    await byTestId(page, 'pokemon-1').click();
    await byTestId(page, 'poke-Weezing (Galarian)').dispatchEvent('click');
    const short = await byTestId(page, 'nickname-0').boundingBox();
    const long = await byTestId(page, 'nickname-1').boundingBox();
    expect(long.x).toBe(short.x);
  });

  test('Phone rows stack the level and actions under the Pokémon', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-nickname').click();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await pickScorbunny(page);
    await pickOption(page, 'status-0', 'Captured');
    for (const id of ['level-up-button-0', 'swap-0', 'evolve-0}', 'nature-0', 'edit-encounter-0']) {
      await expect(byTestId(page, id)).toBeVisible();
    }
    await byTestId(page, 'level-up-button-0').click();
    await expect(byTestId(page, 'encounter-0').locator('output')).toContainText('1');
    // A randomized nickname shows in the field: the row mounts afresh when its encounter changes
    await byTestId(page, 'nickname-0').locator('> .ui').click();
    await expect(byTestId(page, 'nickname-0').locator('input')).not.toHaveValue('');

    // Compact, the nickname keeps its own line
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await page.goto('/');
    await expect(byTestId(page, 'nickname-0')).toBeVisible();
    await expect(byTestId(page, 'level-up-button-0')).toHaveCount(0);
  });

  test('With a full team, Team in the menu opens the team picker', async ({ page }) => {
    await importFile(page, 'over6.json');
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    // Seven on the team: one goes back to the box, which leaves a full team of six
    await pickOption(page, 'status-0', 'Captured');
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'menu-team-0').click();
    await expect(modalDialog(page)).toBeVisible();
    await byTestId(page, 'poke-Magikarp').click();
    await expect(dropdownText(page, 'status-0')).toHaveText('Team');
    await expect(dropdownText(page, 'status-1')).toHaveText('Captured');
  });

  test('The level stepper keeps focus while it steps', async ({ page }) => {
    await pickScorbunny(page);
    const up = byTestId(page, 'level-up-button-0');
    await up.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await expect(up).toBeFocused();
    await expect(byTestId(page, 'encounter-0').locator('output')).toContainText('2');
  });

  test('Focus comes back to the menu button after the dialogs it opens', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-compact').click();
    await navigate(page, 'tracker');
    await pickScorbunny(page);
    const options = byTestId(page, 'encounter-options-0');
    for (const item of ['menu-evolve-0', 'menu-edit-0', 'reset-encounter-0']) {
      await options.click();
      await byTestId(page, item).click();
      await expect(modalDialog(page)).toBeVisible();
      await page.getByRole('button', { name: 'Cancel' }).click();
      await expect(modalDialog(page)).toHaveCount(0);
      await expect(options).toBeFocused();
    }
  });
});
