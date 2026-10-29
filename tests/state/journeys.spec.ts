// Persisted-store goldens. Each journey drives the UI from a seed and records what it changed in
// localStorage["pokemon-tracker"]. A UI-only change (styling, a component-library swap) must leave
// every golden byte-identical; CI fails a PR that changes one without the state-change-approved
// label. Update with: npx playwright test --project=state --update-snapshots
import { expect, test } from '../fixtures';
import {
  byTestId,
  field,
  importFile,
  modalField,
  navigate,
  pickOption,
  radio,
  selectGame,
  stepTo,
  text,
  toggle,
  typeInto,
} from '../e2e/helpers';
import { openWithSeed, storeChanges } from './persisted';

const expectGolden = async (
  page: Parameters<typeof storeChanges>[0],
  seed: string,
  name: string,
  depth?: number
) => expect(await storeChanges(page, seed, depth)).toMatchSnapshot(`${name}.json`);

test('tracker encounters', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await byTestId(page, 'pokemon-0').click();
  await byTestId(page, 'poke-Bulbasaur').dispatchEvent('click');
  await pickOption(page, 'status-0', 'Team');
  await byTestId(page, 'edit-encounter-0').click();
  await typeInto(field(page, 'level'), '15');
  await text(page, 'Save').click();
  await byTestId(page, 'encounter-options-0').click();
  await byTestId(page, 'level-up-0').click();
  await byTestId(page, 'pokemon-1').click();
  // The first Pokémon the location's encounter table offers
  await page.locator('[data-testid^="poke-"]').first().dispatchEvent('click');
  await pickOption(page, 'status-1', 'Fainted');
  await byTestId(page, 'encounter-options-1').click();
  await byTestId(page, 'reset-encounter-1').click();
  await byTestId(page, 'encounter-options-2').click();
  await byTestId(page, 'delete-encounter-2').click();
  await text(page, 'OK').click();
  await byTestId(page, 'add-encounter').click();
  await typeInto(field(page, 'add-encounter-input'), 'Secret Garden');
  await text(page, 'Save').click();
  await expectGolden(page, 'game-selected', 'tracker-encounters');
});

test('encounter order', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await byTestId(page, 'encounter-options-0').click();
  await byTestId(page, 'move-down-0').click();
  await byTestId(page, 'encounter-options-3').click();
  await byTestId(page, 'move-up-3').click();
  await expectGolden(page, 'game-selected', 'encounter-order');
});

test('encounter detail editor', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await selectGame(page, 'Sword and Shield');
  await byTestId(page, 'pokemon-0').click();
  await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
  await byTestId(page, 'edit-encounter-0').click();
  await typeInto(field(page, 'metlevel'), '5');
  await pickOption(page, 'ability', 1);
  await pickOption(page, 'item', 1);
  await pickOption(page, 'gender', 1);
  await byTestId(page, 'shiny').click();
  await byTestId(page, 'move-summary').click();
  await byTestId(page, 'move-1').locator(':scope > div').click();
  await byTestId(page, 'move-Pound').click();
  await byTestId(page, 'stats-summary').click();
  await stepTo(byTestId(page, 'evatk'), 4);
  await text(page, 'Save').click();
  await byTestId(page, 'evolve-0}').click();
  await radio(page, 'Raboot').click();
  await text(page, 'Save').click();
  await expectGolden(page, 'game-selected', 'encounter-detail');
});

test('game management', async ({ page }) => {
  await openWithSeed(page, 'empty');
  await byTestId(page, 'add-game').click();
  await typeInto(field(page, 'add-game-input'), 'Emerald Kaizo');
  await pickOption(page, 'encounter-template', 1);
  await text(page, 'Save').click();
  await byTestId(page, 'custom-edit-badges').click();
  await byTestId(page, 'add-cap').click();
  await typeInto(field(page, 'custom-badge-input-0'), '12');
  await text(page, 'Cancel').click();
  await selectGame(page, 'Red, Blue and Yellow');
  await expectGolden(page, 'empty', 'game-management');
});

test('badges and level caps', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await page.locator('[title="Boulder Badge"]').click();
  await page.locator('[title="Cascade Badge"]').click();
  await page.locator('[title="Cascade Badge"]').click();
  await byTestId(page, 'edit-badges').click();
  await typeInto(modalField(page, 1), '9');
  await text(page, 'Cancel').click();
  await expectGolden(page, 'game-selected', 'badges');
});

test('rules and rulesets', async ({ page }) => {
  await openWithSeed(page, 'game-selected', '/rules');
  await byTestId(page, 'add-rule').click();
  await typeInto(field(page, 'add-rule-input'), 'No items in battle');
  await text(page, 'Save').click();
  await byTestId(page, 'edit-rule-3').click();
  await typeInto(field(page, 'edit-rule-input'), ' outside of gyms');
  await text(page, 'Save').click();
  await byTestId(page, 'arrow-down-0').click();
  await byTestId(page, 'add-rule').click();
  await text(page, 'Type').click();
  await byTestId(page, 'add-rule-type').click();
  await text(page, 'GRASS').click();
  await text(page, 'Type').click();
  await text(page, 'Save').click();
  await byTestId(page, 'add-ruleset').click();
  await typeInto(field(page, 'add-ruleset-input'), 'House rules');
  await text(page, 'Save').click();
  await expectGolden(page, 'game-selected', 'rules');
});

test('pokestats display settings', async ({ page }) => {
  await openWithSeed(page, 'mid-run', '/stats');
  await byTestId(page, 'display-settings').click();
  const section = (n: number) =>
    page
      .locator('summary')
      .nth(n - 1)
      .click();
  await section(1);
  await typeInto(field(page, 'summary-title'), ' 2');
  await pickOption(page, 'summary-status', 1);
  await section(3);
  await toggle(page, 'summary-boxed');
  await section(5);
  await typeInto(byTestId(page, 'summary-description'), 'Second attempt');
  await expectGolden(page, 'mid-run', 'pokestats');
});

test('team builder', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'builder');
  await byTestId(page, 'builder-add').click();
  await byTestId(page, 'poke-Bulbasaur').click();
  await byTestId(page, 'expand-Bulbasaur').click();
  await pickOption(page, 'team-ability-Bulbasaur', 1);
  await pickOption(page, 'team-item-Bulbasaur', 1);
  await byTestId(page, 'team-details-Bulbasaur').locator(':scope > :nth-child(4) b').click();
  await byTestId(page, 'move-Pound').click();
  await byTestId(page, 'builder-add').click();
  await byTestId(page, 'poke-Charmander').dispatchEvent('click');
  await byTestId(page, 'builder-add').click();
  await byTestId(page, 'poke-Squirtle').dispatchEvent('click');
  // Known UI issue: with several members, the team panel covers the next member's delete button
  await byTestId(page, 'delete-team-1').dispatchEvent('click');
  await expectGolden(page, 'game-selected', 'builder');
});

test('damage calculator', async ({ page }) => {
  await openWithSeed(page, 'game-selected');
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'calculator');
  await byTestId(page, 'level-input1').clear();
  await typeInto(byTestId(page, 'level-input1'), '50');
  await byTestId(page, 'nature1').locator('input.search').pressSequentially('Adamant');
  await pickOption(page, 'nature1', 0);
  await byTestId(page, 'status2').locator('input.search').pressSequentially('Burned');
  await pickOption(page, 'status2', 0);
  await byTestId(page, 'move1_crit1').click();
  await byTestId(page, 'field-settings').click();
  await toggle(page, 'weather-Rain');
  await toggle(page, 'gameType-doubles');
  await byTestId(page, 'field-settings').click();
  await expectGolden(page, 'game-selected', 'calculator');
});

test('settings and custom statuses', async ({ page }) => {
  await openWithSeed(page, 'game-selected', '/settings');
  for (const id of ['settings-dupes', 'settings-nickname', 'settings-soulink']) {
    await toggle(page, id);
  }
  await byTestId(page, 'settings-darkmode').click();
  await byTestId(page, 'edit-custom-statuses').click();
  await typeInto(field(page, 'custom-status-input'), 'Traded');
  await byTestId(page, 'add-status').click();
  await text(page, 'Cancel').click();
  await byTestId(page, 'settings-language').click();
  await text(page, 'Deutsch').click();
  await expectGolden(page, 'game-selected', 'settings');
});

test('import a backup', async ({ page }) => {
  await openWithSeed(page, 'empty');
  await importFile(page, 'PokemonList.json');
  await expect(text(page, 'Emerald Kaizo')).toBeAttached();
  // An import replaces whole store keys, so compare per key
  await expectGolden(page, 'empty', 'import', 2);
});
