// The redesigned encounter editor: captions name its fields, the move tiles open from the keyboard
// and say which move they delete, and the stat steppers are named after their stat.
import { expect, test } from '../../fixtures';
import { byTestId, field, modalDialog, selectGame } from '../helpers';

test.describe('Encounter editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
    await byTestId(page, 'pokemon-0').click();
    await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
    await byTestId(page, 'edit-encounter-0').click();
  });

  test('Captions name the fields', async ({ page }) => {
    const dialog = modalDialog(page);
    await expect(dialog.getByLabel('Level', { exact: true })).toBeVisible();
    await expect(dialog.getByLabel('Level', { exact: true })).toHaveAttribute('id', /^level-/);
    await expect(dialog.getByLabel('Met Level')).toHaveAttribute('id', /^metlevel-/);
    for (const name of ['Nature', 'Ability', 'Held item']) {
      await expect(dialog.getByRole('combobox', { name, exact: true })).toBeVisible();
    }
    await expect(dialog.getByRole('combobox', { name: 'Gender' })).toBeVisible();
  });

  test('A move tile opens from the keyboard and names its delete button', async ({ page }) => {
    await byTestId(page, 'move-summary').click();
    const tile = byTestId(page, 'move-1').getByRole('button', { name: 'Select a move...' });
    await tile.focus();
    await page.keyboard.press('Enter');
    await expect(modalDialog(page)).toHaveCount(2);
    await byTestId(page, 'move-Pound').click();
    await expect(modalDialog(page)).toHaveCount(1);
    await expect(byTestId(page, 'move-1')).toContainText('Pound');
    await byTestId(page, 'move-1').getByRole('button', { name: 'Delete Pound' }).click();
    await expect(byTestId(page, 'move-1')).toContainText('Select a move...');
    await expect(modalDialog(page)).toHaveCount(1);
  });

  test('The stat steppers are named after their stat', async ({ page }) => {
    await byTestId(page, 'stats-summary').click();
    const dialog = modalDialog(page);
    await dialog.getByRole('button', { name: 'Raise Atk EV' }).click();
    await dialog.getByRole('button', { name: 'Raise Atk EV' }).click();
    await expect(field(page, 'input-evatk')).toHaveValue('2');
    await dialog.getByRole('button', { name: 'Lower Atk EV' }).click();
    await expect(field(page, 'input-evatk')).toHaveValue('1');
    await expect(dialog.getByRole('slider', { name: 'Spe IV' })).toHaveAttribute('max', '31');
  });
});
