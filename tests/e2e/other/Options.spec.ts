import fs from 'node:fs';
import { expect, test } from '../../fixtures';
import {
  byTestId,
  field,
  importFile,
  navigate,
  openOptions,
  pickOption,
  selectGame,
  text,
  toggle,
  typeInto,
} from '../helpers';

test.describe('Options', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Settings', async ({ page }) => {
    await navigate(page, 'settings');
    await expect(text(page, 'Settings')).toBeAttached();
    for (const id of [
      'settings-dupes',
      'settings-nickname',
      'settings-missing',
      'settings-showall',
    ]) {
      await toggle(page, id);
    }
    await text(page, 'Back').click();
    await selectGame(page, 'Sword and Shield');
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Bulbasaur').dispatchEvent('click');
    await typeInto(field(page, 'nickname-0'), 'Bulbadude');
    await expect(field(page, 'nickname-0')).toHaveValue('Bulbadude');
    await field(page, 'filter').click();
    await byTestId(page, 'pokemon-1').click();
    await byTestId(page, 'poke-Bulbasaur').dispatchEvent('click');
    await byTestId(page, 'alert-0').click();
    await expect(text(page, 'DUPE')).toBeAttached();
    await expect(text(page, 'Duplicate pokémon are not allowed')).toBeAttached();
    await expect(text(page, 'Starter')).toBeAttached();
    await pickOption(page, 'status-0', 1);
    await expect(text(page, 'Starter')).toHaveCount(0);
    await byTestId(page, 'nickname-1').locator(':scope > .ui').click();
    await expect(field(page, 'nickname-1')).not.toHaveCount(0);
    await byTestId(page, 'search-options').click();
    await expect(text(page, 'Settings')).toBeAttached();
  });

  test('About and Changelog', async ({ page }) => {
    await expect(text(page, '!')).toBeAttached();
    await navigate(page, 'about');
    await expect(text(page, 'About')).toBeAttached();
    await text(page, 'Back').click();
    await navigate(page, 'changelog');
    await expect(text(page, 'Changelog')).toBeAttached();
    await expect(byTestId(page, 'changelog-list').locator('h4')).toHaveCount(3);
    await byTestId(page, 'see-more').click();
    expect(await byTestId(page, 'changelog-list').locator('h4').count()).toBeGreaterThan(3);
    await text(page, 'Back').click();
    await expect(text(page, '!')).toHaveCount(0);
  });

  test('Export', async ({ page }) => {
    const download = page.waitForEvent('download');
    await navigate(page, 'export');
    expect((await download).suggestedFilename()).toBe('PokemonList.json');
    const data = JSON.parse(fs.readFileSync(await (await download).path(), 'utf8'));
    expect(data).toHaveProperty('badges');
    expect(data).toHaveProperty('games');
    expect(data).toHaveProperty('gamesList');
  });

  test('Report', async ({ page }) => {
    await navigate(page, 'report');
    const select = async (id: string, label: string, value: string) => {
      await byTestId(page, id).selectOption({ label });
      await expect(byTestId(page, id)).toHaveValue(value);
    };
    await select('report-type', 'Suggestion', 'suggestion');
    await select('report-device', 'Mobile', 'mobile');
    await select('report-os', 'Android', 'android');
    await select('report-browser', 'Firefox', 'firefox');
    await typeInto(byTestId(page, 'report-selectedgame'), 'Emerald Kaizo');
    await expect(byTestId(page, 'report-selectedgame')).toHaveValue('Emerald Kaizo');
    await typeInto(byTestId(page, 'report-description'), 'Please implement new feature');
    await expect(byTestId(page, 'report-description')).toHaveValue('Please implement new feature');
  });

  test('Suggestions', async ({ page }) => {
    await importFile(page, 'Suggestions.json');
    await navigate(page, 'tracker');
    const expectSuggested = async (suggested: boolean) => {
      await byTestId(page, 'pokemon-1').click();
      if (suggested) await expect(text(page, 'SUGGESTED')).toBeAttached();
      else await expect(text(page, 'SUGGESTED')).toHaveCount(0);
    };
    await expectSuggested(true);
    await text(page, 'Cancel').click();
    await pickOption(page, 'game-select', 0);
    await expectSuggested(true);
    await text(page, 'Cancel').click();
    await selectGame(page, 'Sword and Shield');
    await expectSuggested(true);
    await text(page, 'Cancel').click();
    await byTestId(page, 'search-options').click();
    await toggle(page, 'settings-suggestions');
    await text(page, 'Back').click();
    await expectSuggested(false);
  });

  test.describe('Light system theme', () => {
    test.use({ colorScheme: 'light' });

    test('Dark mode', async ({ page }) => {
      await openOptions(page);
      await expect(byTestId(page, 'app')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await byTestId(page, 'settings').click();
      await byTestId(page, 'settings-darkmode').click();
      await expect(byTestId(page, 'app')).toHaveCSS('background-color', 'rgb(33, 33, 33)');
    });
  });

  test('Language', async ({ page }) => {
    await navigate(page, 'settings');
    await byTestId(page, 'settings-language').click();
    await text(page, 'Español').click();
    await expect(text(page, 'Ajustes')).toBeAttached();
    await byTestId(page, 'settings-language').click();
    await text(page, 'Deutsch').click();
    await expect(text(page, 'Optionen')).toBeAttached();
  });

  test.describe('Narrow', () => {
    test.use({ viewport: { width: 550, height: 660 } });

    test('Custom Status', async ({ page }) => {
      await navigate(page, 'settings');
      await byTestId(page, 'edit-custom-statuses').click();
      await typeInto(field(page, 'custom-status-input'), 'Foobar');
      await expect(field(page, 'custom-status-input')).toHaveValue('Foobar');
      await byTestId(page, 'add-status').click();
      await expect(text(page, 'Foobar')).toBeAttached();
      await text(page, 'Cancel').click();
      await navigate(page, 'tracker');
      await selectGame(page, 'Sword and Shield');
      await byTestId(page, 'pokemon-0').click();
      await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
      await pickOption(page, 'status-0', 6);
      await pickOption(page, 'status-0', 6);
      await expect(text(page, 'Foobar')).toBeAttached();
      await navigate(page, 'settings');
      await byTestId(page, 'edit-custom-statuses').click();
      await byTestId(page, 'remove-custom-status-0').click();
      await text(page, 'Cancel').click();
      await navigate(page, 'tracker');
      await expect(text(page, 'Foobar')).toHaveCount(0);
    });
  });

  test('Soul Link', async ({ page }) => {
    await navigate(page, 'settings');
    await toggle(page, 'settings-soulink');
    await navigate(page, 'tracker');
    await selectGame(page, 'Sword and Shield');
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await pickOption(page, 'status-0', 1);
    await byTestId(page, 'edit-encounter-0').click();
    await byTestId(page, 'soullink-0').click();
    await byTestId(page, 'poke-Bulbasaur').dispatchEvent('click');
    await byTestId(page, 'delete-soullink-0').click();
    await byTestId(page, 'soullink-0').click();
    await byTestId(page, 'poke-Bulbasaur').dispatchEvent('click');
    await text(page, 'Save').click();
  });

  test('Delete', async ({ page }) => {
    await page.goto('/delete');
    await expect(text(page, 'Account Deletion')).toBeAttached();
  });
});
