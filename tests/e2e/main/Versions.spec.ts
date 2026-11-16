import { expect, test } from '../../fixtures';
import { byTestId, dropdownText, field, pickOption, selectGame, text, typeInto } from '../helpers';

// Version-exclusive encounters (Phase 6): a combined game's run can pick its version, and each
// location's Pokémon selector then offers only that version's encounters
test.describe('Versions', () => {
  test('a version narrows the encounter tables and is kept', async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Red, Blue and Yellow');
    await expect(dropdownText(page, 'version')).toHaveText('All versions');

    // Viridian Forest, every version: Red and Blue's Weedle and Yellow's Pidgey
    await byTestId(page, 'pokemon-6').click();
    await expect(byTestId(page, 'poke-Weedle')).toBeVisible();
    await expect(byTestId(page, 'poke-Pidgey')).toBeVisible();
    await text(page, 'Cancel').click();

    await pickOption(page, 'version', 'Yellow');
    await expect(dropdownText(page, 'version')).toHaveText('Yellow');
    await byTestId(page, 'pokemon-6').click();
    await expect(byTestId(page, 'poke-Pidgey')).toBeVisible();
    await expect(byTestId(page, 'poke-Weedle')).toHaveCount(0);
    await text(page, 'Cancel').click();

    // Each game keeps its own
    await page.reload();
    await expect(dropdownText(page, 'version')).toHaveText('Yellow');
    await selectGame(page, 'Brilliant Diamond and Shining Pearl');
    await expect(dropdownText(page, 'version')).toHaveText('All versions');
    await selectGame(page, 'Sword and Shield');
    await expect(dropdownText(page, 'version')).toHaveText('All versions');
    await pickOption(page, 'version', 'Shield');
    await expect(dropdownText(page, 'version')).toHaveText('Shield');
    await selectGame(page, 'Ruby, Sapphire and Emerald');
    await expect(dropdownText(page, 'version')).toHaveText('All versions');

    await selectGame(page, 'Red, Blue and Yellow');
    await pickOption(page, 'version', 'All versions');
    await byTestId(page, 'pokemon-6').click();
    await expect(byTestId(page, 'poke-Weedle')).toBeVisible();
  });

  test('a custom game has no version, even from a template', async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Red, Blue and Yellow');
    await expect(byTestId(page, 'version')).toBeVisible();
    await byTestId(page, 'add-game').click();
    await typeInto(field(page, 'add-game-input'), 'Yellow Kaizo');
    await pickOption(page, 'encounter-template', 'Red, Blue and Yellow');
    await text(page, 'Save').click();
    await expect(byTestId(page, 'game-select')).toContainText('Yellow Kaizo');
    await expect(byTestId(page, 'pokemon-6')).toBeVisible();
    await expect(byTestId(page, 'version')).toHaveCount(0);
  });
});
