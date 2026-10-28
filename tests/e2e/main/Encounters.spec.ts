import { expect, test } from '../../fixtures';
import {
  byTestId,
  clickOutside,
  dropdownText,
  encounterRows,
  field,
  helpIcon,
  importFile,
  navigate,
  pickOption,
  radio,
  selectGame,
  stepTo,
  tab,
  text,
  typeInto,
} from '../helpers';

test.describe('Encounters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
  });

  test('Filter', async ({ page }) => {
    await typeInto(field(page, 'filter'), 'Slumbering Weald');
    await expect(field(page, 'filter')).toHaveValue('Slumbering Weald');
    await byTestId(page, 'pokemon-1').click();
    await byTestId(page, 'remove-tooltip').click();
    await byTestId(page, 'poke-Butterfree').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'filter-gen-1').click();
    await byTestId(page, 'filter-gen-1').click();
    await byTestId(page, 'filter-type-BUG').click();
    await byTestId(page, 'filter-type-BUG').click();
    await byTestId(page, 'filter-button').click();
    await expect(encounterRows(page)).toHaveCount(1);
    await helpIcon(page, 'filter').dispatchEvent('click');
    await expect(text(page, 'Search by Pokémon, location, or status')).toBeVisible();
  });

  test('Edit base encounter', async ({ page }) => {
    await byTestId(page, 'pokemon-0').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'pokemon-0').click();
    await page.locator('.st0Fire').first().dispatchEvent('click');
    await expect(text(page, 'Super effective against')).toBeAttached();
    await tab(page, 'tabular', 3).click();
    await page.locator('.st0Steel').first().dispatchEvent('click');
    await byTestId(page, 'effect-close').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await expect(text(page, 'Scorbunny')).toBeAttached();

    await byTestId(page, 'edit-encounter-0').click();
    await text(page, 'Cancel').click();
    await pickOption(page, 'status-0', 1);
    await pickOption(page, 'status-0', 1);
    await expect(dropdownText(page, 'status-0')).toHaveText('Fainted');
    await byTestId(page, 'edit-encounter-0').click();
    await typeInto(byTestId(page, 'cause of fainting'), 'Died to crit');
    await expect(byTestId(page, 'cause of fainting')).toHaveValue('Died to crit');
    await byTestId(page, 'nature-info').click();
    await expect(text(page, 'Increased stat')).toBeAttached();
    await expect(text(page, 'Hardy')).toBeAttached();
    await byTestId(page, 'nature-close').click();
    await byTestId(page, 'nature-info').click();
    await clickOutside(page);

    await byTestId(page, 'ability-info').click();
    await typeInto(field(page, 'ability-search'), 'Aftermath');
    await byTestId(page, 'ability-close').click();
    await byTestId(page, 'ability-info').click();
    await clickOutside(page);

    await byTestId(page, 'stats-summary').click();
    const ivhp = byTestId(page, 'input-ivhp');
    await typeInto(ivhp, '10');
    await expect(ivhp).toHaveValue('10');
    await ivhp.press('Backspace');
    await ivhp.press('Backspace');
    await expect(ivhp).toHaveValue('0');
    for (const stat of ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed']) {
      await stepTo(byTestId(page, `ev${stat}`), 1);
      await stepTo(byTestId(page, `iv${stat}`), 1);
    }

    await byTestId(page, 'ivhp-substract').click();
    await byTestId(page, 'ivhp-add').click();
    await byTestId(page, 'evhp-add').click();

    await text(page, 'Save').click();

    await byTestId(page, 'evolve-0}').click();
    await radio(page, 'Cinderace').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'evolve-0}').click();
    await radio(page, 'Raboot').click();
    await text(page, 'Save').click();
    await expect(text(page, 'Raboot')).toBeAttached();
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'reset-encounter-0').click();
    await expect(byTestId(page, 'encounter-empty-0')).toBeAttached();
    await expect(dropdownText(page, 'status-0')).toHaveText('Status...');
  });

  test('Cancelling the detail drops IV and EV edits', async ({ page }) => {
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await byTestId(page, 'edit-encounter-0').click();
    await byTestId(page, 'stats-summary').click();
    await typeInto(byTestId(page, 'input-ivhp'), '10');
    await typeInto(byTestId(page, 'input-evhp'), '20');
    await expect(byTestId(page, 'input-ivhp')).toHaveValue('10');
    await text(page, 'Cancel').click();

    await byTestId(page, 'edit-encounter-0').click();
    await expect(byTestId(page, 'input-ivhp')).toHaveValue('0');
    await expect(byTestId(page, 'input-evhp')).toHaveValue('0');
  });

  test('Reset all encounters', async ({ page }) => {
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await byTestId(page, 'reset-all').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'reset-all').click();
    await clickOutside(page);
    await byTestId(page, 'reset-all').click();
    await text(page, 'Save').click();
    await expect(dropdownText(page, 'status-0')).toHaveText('Status...');
  });

  test('Delete encounter', async ({ page }) => {
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'delete-encounter-0').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'encounter-options-0').click();
    await byTestId(page, 'delete-encounter-0').click();
    await text(page, 'OK').click();
    await typeInto(field(page, 'filter'), 'Starter');
    await expect(encounterRows(page)).toHaveCount(0);
  });

  test('Add encounter', async ({ page }) => {
    await byTestId(page, 'add-encounter').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'add-encounter').click();
    await typeInto(field(page, 'add-encounter-input'), 'Test');
    await expect(field(page, 'add-encounter-input')).toHaveValue('Test');
    await text(page, 'Save').click();
    await typeInto(field(page, 'filter'), 'Test');
    await expect(encounterRows(page)).toHaveCount(1);
  });

  test('Export to another game', async ({ page }) => {
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await byTestId(page, 'edit-encounter-0').click();
    await pickOption(page, 'export-to-game', 1);
    await selectGame(page, 'Gold, Silver and Crystal');
    await expect(text(page, 'From Sword and Shield')).toBeAttached();
    await expect(text(page, 'Scorbunny')).toBeAttached();
  });

  test('Direct leveling', async ({ page }) => {
    const option = async (id: string) => {
      await byTestId(page, 'encounter-options-0').click();
      await byTestId(page, id).click();
    };
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await option('level-up-0');
    await option('level-up-0');
    await option('level-down-0');
    await option('reset-encounter-0');
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await byTestId(page, 'edit-encounter-0').click();
    await typeInto(field(page, 'metlevel'), '5');
    await expect(field(page, 'metlevel')).toHaveValue('5');
    await text(page, 'Save').click();
    await option('level-up-0');
    await byTestId(page, 'level-up-button-0').click();
    await byTestId(page, 'level-down-button-0').click();
  });

  test('Swap & Scroll & Nature & Notes', async ({ page }) => {
    await importFile(page, 'over6.json');
    await navigate(page, 'tracker');
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'skip-encounter-7').click();
    await byTestId(page, 'skip-encounter-7').click();
    await byTestId(page, 'skip-encounter-8').click();
    await byTestId(page, 'skip-encounter-8').click();
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'scroll-to-last-encounter-7').dispatchEvent('click');
    await byTestId(page, 'pokemon-7').click();
    await expect(text(page, 'DUPE')).toBeAttached();
    await byTestId(page, 'poke-Growlithe').dispatchEvent('click');
    await pickOption(page, 'status-7', 2);
    await byTestId(page, 'swap-7').click();
    await byTestId(page, 'poke-Magikarp').dispatchEvent('click');
    await byTestId(page, 'swap-7').click();
    await byTestId(page, 'swap-6').click();
    await pickOption(page, 'status-6', 2);
    await byTestId(page, 'swap-6').click();
    await byTestId(page, 'swap-6').click();
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'close-scroll-list').click();
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'scroll-to-encounter-0').click();
    await expect(text(page, 'Starter')).toBeVisible();
    await pickOption(page, 'nature-0', 1, { covered: true });
    await pickOption(page, 'nature-0', 2, { covered: true });
    await byTestId(page, 'open-notes').click();
    await typeInto(byTestId(page, 'game-notes'), 'These are notes');
    await expect(byTestId(page, 'game-notes')).toHaveValue('These are notes');
  });

  test.describe('Small screens', () => {
    test.use({ viewport: { width: 414, height: 736 } });

    test.beforeEach(async ({ page }) => {
      await byTestId(page, 'fab-tracker').locator(':scope > .ui').click();
    });

    test('Add encounter - Small', async ({ page }) => {
      await page.locator('[data-testid=fab-add-encounter] > [data-testid=add-encounter]').click();
      await typeInto(field(page, 'add-encounter-input'), 'Test');
      await expect(field(page, 'add-encounter-input')).toHaveValue('Test');
      await text(page, 'Save').click();
      await typeInto(field(page, 'filter'), 'Test');
      await expect(encounterRows(page)).toHaveCount(1);
    });

    test('Reset all encounters - Small', async ({ page }) => {
      await byTestId(page, 'pokemon-0').click();
      await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
      await page.locator('[data-testid=fab-reset-encounters] > [data-testid=reset-all]').click();
      await text(page, 'Save').click();
      await expect(dropdownText(page, 'status-0')).toHaveText('Status...');
    });
  });
});
