import fs from 'node:fs';
import { expect, test } from '../../fixtures';
import { byTestId, fixture, navigate, selectGame, text, toggle, typeInto } from '../helpers';

test.describe('Import', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'import');
  });

  test('Import - Success', async ({ page }) => {
    await byTestId(page, 'import-file-input').setInputFiles(fixture('PokemonList.json'));
    await byTestId(page, 'apply-import').click();
    await navigate(page, 'tracker');
    await expect(text(page, 'Emerald Kaizo')).toBeAttached();
    await expect(text(page, 'Super Secret Place')).toBeAttached();
    await expect(text(page, 'Bulbasaur')).toBeAttached();
    await expect(text(page, 'Team')).toBeAttached();
    await navigate(page, 'rules');
    await expect(text(page, 'Have fun!')).toBeAttached();
    await navigate(page, 'stats');
    await expect(byTestId(page, 'image-header-true').locator('b')).toHaveText('Ongoing ');
    await navigate(page, 'builder');
    await expect(byTestId(page, 'team-poke-Venusaur')).toBeAttached();
    await navigate(page, 'calculator');
    await expect(text(page, 'Bulbasaur')).toBeAttached();
  });

  test('Import - Failure', async ({ page }) => {
    await byTestId(page, 'import-file-input').setInputFiles(fixture('Invalid.json'));
    await byTestId(page, 'apply-import').click();
    await expect(text(page, 'Invalid file')).toBeAttached();
  });

  test.describe('PkHeX Imports', () => {
    test.beforeEach(async ({ page }) => {
      await selectGame(page, 'HeartGold and SoulSilver');
    });

    test('Import Game by Table', async ({ page }) => {
      const data = fs.readFileSync(fixture('table.txt'), 'utf8');
      await typeInto(byTestId(page, 'table-import-textarea'), data);
      await toggle(page, 'table-import-option');
      await byTestId(page, 'apply-import').click();
      await expect(text(page, 'Successfully imported game encounters')).toBeAttached();
      await navigate(page, 'tracker');
      await expect(text(page, 'Bayleef')).toBeAttached();
    });

    test('Import Game by Table - Failure', async ({ page }) => {
      await typeInto(byTestId(page, 'table-import-textarea'), 'Invalid text');
      await toggle(page, 'table-import-option');
      await byTestId(page, 'apply-import').click();
      await expect(text(page, 'Invalid text')).toBeAttached();
      await toggle(page, 'all-import-option');
    });
  });
});
