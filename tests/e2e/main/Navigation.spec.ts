// The page nav is shown at every width: a column from 1148px, a row above the page down to 571px
// and a tab bar at the bottom of the screen below that. The visual baselines cover the column
// (desktop) and the tab bar (mobile); these pin that each form is shown and navigates.
import { expect, type Page, test } from '../../fixtures';
import { selectGame } from '../helpers';

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

// The tab bar's names wrap rather than being cut: German "Taschenrechner" (Calculator, with a soft
// hyphen) is wider than a fifth of a 375px screen, and was shown as "Taschenr…"
const CALCULATOR = { Deutsch: 'Taschen', Español: 'Calculadora', English: 'Calculator' };
for (const language of ['Deutsch', 'Español', 'English'] as const) {
  test(`every tab's name shows whole on a phone in ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/settings');
    await page.getByTestId('settings-language').click();
    await page.getByRole('option', { name: language }).click();
    // Measured once the names are in the new language
    await expect(nav(page)).toContainText(CALCULATOR[language]);
    const names = nav(page).locator('a > span');
    await expect(names).toHaveCount(5);
    const bar = await nav(page).boundingBox();
    for (const name of await names.all()) {
      const fits = await name.evaluate((el) => el.scrollWidth <= el.clientWidth);
      expect(fits, await name.textContent()).toBe(true);
      const box = await name.boundingBox();
      expect(box.y).toBeGreaterThanOrEqual(bar.y);
      expect(box.y + box.height).toBeLessThanOrEqual(bar.y + bar.height);
    }
  });
}

// The header (5x): the menu button says when there's a new version, the menu marks the current
// page and is reached with Tab, and the game's buttons are named and shown on phones too
test('the header and its menu on a phone', async ({ page, browserName }) => {
  // macOS WebKit moves Tab between text fields only
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/rules');
  const menu = page.getByTestId('options');
  await expect(menu).toHaveAccessibleName('Menu, new version');
  await menu.focus();
  await page.keyboard.press('Enter');
  const sheet = page.getByRole('dialog', { name: 'Menu' });
  await expect(sheet).toBeVisible();
  // The menu doesn't take focus
  await expect(menu).toBeFocused();
  const box = await sheet.boundingBox();
  expect(box.width).toBeCloseTo(260, 1);
  await expect(sheet.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(sheet.getByTestId('rules')).toHaveAttribute('aria-current', 'page');
  await expect(sheet.getByTestId('changelog')).toHaveAccessibleName('Changelog, new version');
  // Tab goes on past the game's controls into the menu
  const builder = sheet.getByTestId('builder');
  for (let i = 0; i < 10 && !(await builder.evaluate((el) => el === document.activeElement)); i++)
    await page.keyboard.press(tab);
  await expect(builder).toBeFocused();
  // Enter goes to the page, and focus goes back to the menu button
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/builder$/);
  await expect(sheet).toHaveCount(0);
  await expect(menu).toBeFocused();
  await selectGame(page, 'Sword and Shield');
  await expect(page.getByTestId('game-select')).toHaveAccessibleName('Game');
  await expect(page.getByRole('button', { name: 'Add game' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit level caps' })).toBeVisible();
  // The changelog clears the new-version mark from the button's name
  await page.goto('/changelog');
  await expect(menu).toHaveAccessibleName('Menu');
});

// A custom game's trash is named in words, though specs still find it by its old aria-label
test('the custom game trash is named Delete game', async ({ page }) => {
  await page.goto('/');
  const trash = page.locator('[aria-label="deletegame"]');
  await expect(trash).toHaveCount(0);
  await page.getByRole('button', { name: 'Add game' }).click();
  await page.getByTestId('add-game-input').fill('My run');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(trash).toHaveAccessibleName('Delete game');
});

// Only a keyboard choice moves focus back to the menu button: after a click it stays put, so a
// popover the next page opens isn't closed by focus moving away (Rules.spec's Over 6 alert)
test('choosing a menu item with the mouse leaves focus alone', async ({ page }) => {
  await page.goto('/rules');
  await page.getByTestId('options').click();
  await page.getByTestId('builder').click();
  await expect(page).toHaveURL(/\/builder$/);
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
  await expect(page.getByTestId('options')).not.toBeFocused();
});
