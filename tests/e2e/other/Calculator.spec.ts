import { expect, type Page, test } from '../../fixtures';
import {
  byTestId,
  field,
  navigate,
  pickOption,
  pokemonDetail,
  selectGame,
  stepTo,
  text,
  toggle,
  typeInDropdown,
  typeInto,
} from '../helpers';

// Search a dropdown and pick the first match
const search = async (page: Page, id: string, value: string) => {
  await typeInDropdown(page, id, value);
  await pickOption(page, id, 0);
};

const pickPokemon = async (page: Page, slot: 1 | 2, name: string, filter?: string) => {
  await byTestId(page, `pokecontroller-pokemon${slot}`).click();
  if (filter) await typeInto(field(page, 'filter'), filter);
  await byTestId(page, `poke-${name}`).dispatchEvent('click');
};

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'calculator');
  });

  test('Base Calculations', async ({ page }) => {
    await expect(text(page, 'Please select a game')).toBeAttached();
    await selectGame(page, 'Sword and Shield');
    await byTestId(page, 'minus-level1').click();
    await expect(byTestId(page, 'level-input1')).toHaveValue('99');
    await byTestId(page, 'plus-level1').click();
    await expect(byTestId(page, 'level-input1')).toHaveValue('100');
    await byTestId(page, 'level-input1').clear();
    await typeInto(byTestId(page, 'level-input1'), '10');
    await expect(byTestId(page, 'level-input1')).toHaveValue('10');
    await pickOption(page, 'gender1', 1);
    await search(page, 'nature1', 'Bold');
    await byTestId(page, 'ability1').locator('input.search').click();
    await search(page, 'ability1', 'Overgrow');
    await search(page, 'item1', 'Silver Powder');
    await search(page, 'item1', 'Miracle Seed');
    await expect(
      text(page, 'Lvl 10 0- Atk Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 1-2 (0.4 - 0.8%)')
    ).toBeAttached();
    await search(page, 'status1', 'Burned');
    await expect(
      text(
        page,
        'Lvl 10 0- Atk burned Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 1-1 (0.4 - 0.4%)'
      )
    ).toBeAttached();
    await byTestId(page, 'move1_crit1').click();
    await expect(
      text(
        page,
        'Lvl 10 0- Atk burned Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur on a critical hit: 1-1 (0.4 - 0.4%)'
      )
    ).toBeAttached();
    await byTestId(page, 'move2_1').locator(':scope > div').click();
    await typeInto(field(page, 'filter'), 'Razor leaf');
    await byTestId(page, 'move-Razor Leaf').click();
    await byTestId(page, 'move2_z1').click();
    await byTestId(page, 'hp1-detail').click();
    await stepTo(byTestId(page, 'evhp1'), 65);
    await expect(byTestId(page, 'evhp1')).toHaveValue('65');
    await stepTo(byTestId(page, 'evhp1'), 0);
    await byTestId(page, 'currenthp1').clear();
    await typeInto(byTestId(page, 'currenthp1'), '50');
    await byTestId(page, 'atk1-detail').click();
    await byTestId(page, 'minus-modatk1').click();
    await expect(byTestId(page, 'modatk1')).toContainText('-1');
    await byTestId(page, 'plus-modatk1').click();
    await expect(byTestId(page, 'modatk1')).toContainText('0');
    await byTestId(page, 'isDynamaxed1').click();
    await expect(
      text(
        page,
        'Lvl 10 0- Atk burned Bulbasaur Max Strike (90 BP) vs. 0 HP / 0 Def Bulbasaur on a critical hit: 1-2 (0.4 - 0.8%)'
      )
    ).toBeAttached();
    await toggle(page, 'spike-3-1');
    await byTestId(page, 'expand-moves').click();
    await byTestId(page, 'attacker-result-2').click();
    await expect(byTestId(page, 'primary-damage')).toHaveText(
      'Lvl 10 0- Atk Miracle Seed burned Bulbasaur Max Overgrowth (110 BP) vs. 0 HP / 0 Def Bulbasaur: 1-1 (0.4 - 0.4%)'
    );
    await byTestId(page, 'defender-result-1').click();
    await expect(byTestId(page, 'primary-damage')).toHaveText(
      '0 Atk Bulbasaur Pound vs. Lvl 10 0 HP / 0+ Def Dynamax Bulbasaur: 214-252 (334.3 - 393.7%) -- guaranteed OHKO'
    );
    await byTestId(page, 'isSwitching1').click();
    await byTestId(page, 'field-settings').click();
    await toggle(page, 'gameType-doubles');
    await toggle(page, 'gameType-singles');
    await toggle(page, 'terrain-Grassy');
    await toggle(page, 'weather-Rain');
    await byTestId(page, 'isGravity').click();
    await byTestId(page, 'field-settings').click();
    await byTestId(page, 'reset-calculator').click();
    await expect(
      text(
        page,
        '0 Atk Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 29-35 (12.5 - 15.1%) -- possible 7HKO'
      )
    ).toBeAttached();
  });

  test('Switching pokemon', async ({ page }) => {
    await selectGame(page, 'Sword and Shield');
    await pickPokemon(page, 2, 'Giratina', 'Giratina');
    await toggle(page, 'show-all-pokemon2');
    await pickOption(page, 'gym-filter', 0);
    await byTestId(page, 'pokecontroller-pokemon2').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'pokecontroller-pokemon2').click();
    await expect(text(page, 'Gossifleur')).toBeAttached();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'filter-type-GRASS').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'poke-Eldegoss').dispatchEvent('click');
    await expect(byTestId(page, 'level-input2')).toHaveValue('20');
    await expect(text(page, 'Regenerator')).toBeAttached();
    await navigate(page, 'tracker');
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await pickOption(page, 'status-0', 0);
    await byTestId(page, 'edit-encounter-0').click();
    await pokemonDetail(page);
    await text(page, 'Save').click();
    await navigate(page, 'calculator');
    await byTestId(page, 'pokecontroller-pokemon1').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'pokecontroller-pokemon1').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'filter-type-FIRE').click();
    await byTestId(page, 'filter-button').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    for (const value of ['Bold', 'Arena Trap', 'Black Belt', 'Surf']) {
      await expect(text(page, value)).toBeAttached();
    }
    await expect(
      text(
        page,
        'Lvl 15 0- Atk 0 IVs Scorbunny Pound vs. Lvl 20 0 HP / 0 Def Eldegoss: 4-5 (6.6 - 8.3%)'
      )
    ).toBeAttached();
  });

  test.describe('Mobile', () => {
    test.use({ viewport: { width: 414, height: 736 } });

    test('Mobile & Custom game', async ({ page }) => {
      await byTestId(page, 'add-game').click();
      await typeInto(field(page, 'add-game-input'), 'Emerald Kaizo');
      await text(page, 'Save').click();
      await byTestId(page, 'pokemon2-tab').click();
      await byTestId(page, 'pokemon1-tab').click();
      await byTestId(page, 'pokemon2-tab').click();
      await pickOption(page, 'gen-selector', 0);
      await pickOption(page, 'gen-selector', 1);
      await expect(
        text(page, 'Bulbasaur Pound vs. Bulbasaur: 29-35 (9.8 - 11.9%) -- possible 9HKO')
      ).toBeAttached();
      await toggle(page, 'spike-1-2');
      // @smogon/calc 0.11+ counts Spikes here but no longer appends "after Spikes" to "possible nHKO"
      await expect(
        text(page, 'Bulbasaur Pound vs. Bulbasaur: 29-35 (9.8 - 11.9%) -- possible 8HKO')
      ).toBeAttached();
    });
  });

  test('Smogon names & Forbidden items', async ({ page }) => {
    await selectGame(page, 'Sword and Shield');
    await toggle(page, 'show-all-pokemon1');
    await pickPokemon(page, 1, 'Meowth (Galarian)', 'Galarian');
    await pickPokemon(page, 2, 'Rattata (Alolan)', 'Alolan');
    await expect(text(page, 'Rattata (Alolan)')).toBeAttached();
    await expect(text(page, 'Meowth (Galarian)')).toBeAttached();
    await pickPokemon(page, 1, 'Nidoran♀', 'Nidoran');
    await pickPokemon(page, 2, 'Nidoran♂', 'Nidoran♂');
    await expect(text(page, 'Nidoran♀')).toBeAttached();
    await expect(text(page, 'Nidoran♂')).toBeAttached();
    await selectGame(page, 'Ruby, Sapphire and Emerald');
    await search(page, 'item1', 'Charizard');
    await search(page, 'item2', 'Charizard');
  });
});
