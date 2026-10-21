import { expect, type Page, test } from '../../fixtures';
import {
  byTestId,
  field,
  importFile,
  navigate,
  pickOption,
  pokemonDetail,
  selectGame,
  tab,
  text,
  typeInto,
} from '../helpers';

// Bulbasaur's four move slots, numbered from 1 (after its nature, ability and item)
const moveSlot = (page: Page, n: number) =>
  page.getByTestId('team-details-Bulbasaur').locator(`:scope > :nth-child(${n + 3})`);

test.describe('Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Build Team', async ({ page }) => {
    await navigate(page, 'builder');
    await expect(text(page, 'Please select a game')).toBeAttached();
    await text(page, 'Coverage').click();
    await selectGame(page, 'Sword and Shield');
    await tab(page, 'secondary', 1).click();
    await byTestId(page, 'builder-add').click();
    await byTestId(page, 'filter-button').click();
    await text(page, 'GRASS').click();
    await text(page, 'GRASS').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'poke-Bulbasaur').click();
    await byTestId(page, 'expand-Bulbasaur').click();
    await typeInto(byTestId(page, 'team-nature-Bulbasaur').locator('input.search'), 'Bold');
    await pickOption(page, 'team-ability-Bulbasaur', 1);
    await expect(text(page, 'Arena Trap')).toBeAttached();
    await pickOption(page, 'team-item-Bulbasaur', 1);
    await expect(text(page, 'Black Belt')).toBeAttached();
    await moveSlot(page, 1).locator('b').click();
    await text(page, 'Cancel').click();
    await moveSlot(page, 1).locator('b').click();
    await byTestId(page, 'move-Pound').click();
    await moveSlot(page, 2).locator('b').click();
    await field(page, 'filter').pressSequentially('punch');
    await expect(field(page, 'filter')).toHaveValue('PUNCH');
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'filter-gen-1').click();
    await byTestId(page, 'filter-gen-2').click();
    await byTestId(page, 'filter-gen-2').click();
    await text(page, 'NORMAL').click();
    await text(page, 'NORMAL').click();
    await text(page, 'ICE').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'move-Ice Punch').click();
    await moveSlot(page, 3).locator('b').click();
    await byTestId(page, 'move-Pound').click();
    await moveSlot(page, 3).locator('.trash').click();
    await moveSlot(page, 3).locator('b').click();
    await byTestId(page, 'move-Pound').click();
    await moveSlot(page, 4).locator('b').click();
    await byTestId(page, 'move-Pound').click();
    await byTestId(page, 'delete-team-0').click();
    await expect(text(page, 'Bulbasaur')).toHaveCount(0);
    for (const name of [
      'Bulbasaur',
      'Ivysaur',
      'Charmander',
      'Charmeleon',
      'Charizard',
      'Bulbasaur',
    ]) {
      await byTestId(page, 'builder-add').click();
      await byTestId(page, `poke-${name}`).dispatchEvent('click');
    }
    await expect(byTestId(page, 'builder-add')).toBeDisabled();
  });

  test('Coverage', async ({ page }) => {
    await navigate(page, 'builder');
    await text(page, 'Coverage').click();
    await importFile(page, 'Coverage.json');
    await navigate(page, 'builder');
    await tab(page, 'secondary', 2).click();
    await expect(text(page, 'ICE 4')).toBeAttached();
    await expect(text(page, 'WATER 1')).toBeAttached();
    await selectGame(page, 'Ruby, Sapphire and Emerald');
    await tab(page, 'secondary', 1).click();
    await byTestId(page, 'builder-add').click();
    await typeInto(field(page, 'filter'), 'Snub');
    await byTestId(page, 'poke-Snubbull').click();
    await expect(text(page, 'NORMAL')).toBeAttached();
    await text(page, 'Coverage').click();
    await expect(text(page, 'FIGHTING 1')).toBeAttached();
    await selectGame(page, 'Red, Blue and Yellow');
  });

  test.describe('Export to builder', () => {
    test.afterEach(async ({ page }) => {
      await byTestId(page, 'pokemon-0').click();
      await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
      await byTestId(page, 'edit-encounter-0').click();
      await pokemonDetail(page);
      await text(page, 'Export to Builder').click();
      await expect(text(page, 'Pokémon successfully exported')).toBeAttached();
      await text(page, 'Cancel').dispatchEvent('click');
      await navigate(page, 'builder');
      await byTestId(page, 'expand-Scorbunny').click();
      for (const value of [
        'Scorbunny',
        'Arena Trap',
        'Black Belt',
        'Pound',
        'Karate Chop',
        'Surf',
        'Bold',
      ]) {
        await expect(text(page, value)).toBeAttached();
      }
    });

    test('No team beforehand', async ({ page }) => {
      await selectGame(page, 'Sword and Shield');
    });

    test('With team beforehand', async ({ page }) => {
      await selectGame(page, 'Sword and Shield');
      await navigate(page, 'builder');
      await byTestId(page, 'builder-add').click();
      await byTestId(page, 'poke-Bulbasaur').click();
      await navigate(page, 'tracker');
    });
  });
});
