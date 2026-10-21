// Regenerates verification/seeds/*.json by driving the real app (npm run seeds). Seeds are the
// starting states for the control CLI, the state goldens and the visual baselines. Regenerate them
// whenever the persisted store shape changes; src/verification.seeds.test.ts checks they still load.
import fs from 'node:fs';
import path from 'node:path';
import { type Page, test } from '../fixtures';
import {
  byTestId,
  field,
  importFile,
  navigate,
  pickOption,
  selectGame,
  text,
} from '../e2e/helpers';

const SEEDS = path.join('verification', 'seeds');

const save = async (page: Page, name: string) => {
  const stored = await page.evaluate(() => localStorage.getItem('pokemon-tracker'));
  fs.mkdirSync(SEEDS, { recursive: true });
  fs.writeFileSync(
    path.join(SEEDS, `${name}.json`),
    `${JSON.stringify(JSON.parse(stored ?? 'null'), null, 2)}\n`
  );
};

test.use({ colorScheme: 'dark' });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await byTestId(page, 'app').waitFor();
});

test('empty', async ({ page }) => {
  await save(page, 'empty');
});

test('game-selected', async ({ page }) => {
  await selectGame(page, 'FireRed and LeafGreen');
  await save(page, 'game-selected');
});

test.describe('light', () => {
  test.use({ colorScheme: 'light' });

  test('light-mode', async ({ page }) => {
    await selectGame(page, 'FireRed and LeafGreen');
    await save(page, 'light-mode');
  });
});

test('mid-run', async ({ page }) => {
  // Team.json: a Sword and Shield run with a team, boxed, failed and fainted Pokémon
  await importFile(page, 'Team.json');
  await navigate(page, 'tracker');
  await page.locator('[title="Grass Badge"]').click();
  await page.locator('[title="Water Badge"]').click();
  await navigate(page, 'rules');
  await byTestId(page, 'add-rule').click();
  await field(page, 'add-rule-input').fill('No items in battle');
  await text(page, 'Save').click();
  await navigate(page, 'settings');
  await byTestId(page, 'edit-custom-statuses').click();
  await field(page, 'custom-status-input').fill('Traded');
  await byTestId(page, 'add-status').click();
  await text(page, 'Cancel').click();
  await navigate(page, 'builder');
  await byTestId(page, 'builder-add').click();
  await byTestId(page, 'poke-Bulbasaur').click();
  await navigate(page, 'calculator');
  await byTestId(page, 'level-input1').fill('42');
  await navigate(page, 'tracker');
  await save(page, 'mid-run');
});

test('custom-game', async ({ page }) => {
  await byTestId(page, 'add-game').click();
  await field(page, 'add-game-input').fill('Emerald Kaizo');
  await pickOption(page, 'encounter-template', 1);
  await text(page, 'Save').click();
  await byTestId(page, 'custom-edit-badges').click();
  await byTestId(page, 'add-cap').click();
  await field(page, 'custom-badge-input-0').fill('12');
  // Level caps apply as typed; the editor only has a close button
  await text(page, 'Cancel').click();
  await byTestId(page, 'add-encounter').click();
  await field(page, 'add-encounter-input').fill('Secret Base');
  await text(page, 'Save').click();
  await save(page, 'custom-game');
});
