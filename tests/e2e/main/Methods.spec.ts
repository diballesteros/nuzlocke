import { expect, test } from '../../fixtures';
import { byTestId, selectGame, text } from '../helpers';

// Encounter methods: a location's selector labels the Pokémon met there other than in the wild
// (constants/methods, from Bulbapedia's location pages)
test.describe('Methods', () => {
  test('the selector labels special encounters, not wild Pokémon', async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Red, Blue and Yellow');

    // Pallet Town: Yellow's Pikachu, from Professor Oak
    await byTestId(page, 'pokemon-1').click();
    await expect(byTestId(page, 'method-Pikachu')).toHaveText('Special');
    await text(page, 'Cancel').click();

    // Viridian City: only fishing and surfing, so no labels
    await byTestId(page, 'pokemon-3').click();
    await expect(byTestId(page, 'poke-Poliwag')).toBeVisible();
    await expect(page.locator('[data-testid^="method-"]')).toHaveCount(0);
    await text(page, 'Cancel').click();
  });
});
