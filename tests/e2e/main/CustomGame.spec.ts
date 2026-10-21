import { expect, type Page, test } from '../../fixtures';
import { byTestId, encounterRows, field, navigate, pickOption, text, typeInto } from '../helpers';

const addGame = async (page: Page) => {
  await byTestId(page, 'add-game').click();
  await typeInto(field(page, 'add-game-input'), 'Emerald Kaizo');
};

const addEncounter = async (page: Page) => {
  await byTestId(page, 'add-encounter').click();
  await typeInto(field(page, 'add-encounter-input'), 'Test');
  await text(page, 'Save').click();
};

const deleteGame = (page: Page) => page.locator('[aria-label="deletegame"]').click();

test.describe('Custom game', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Add custom game', () => {
    test.afterEach(async ({ page }) => {
      await typeInto(field(page, 'add-encounter-input'), 'Test');
      await text(page, 'Save').click();

      await typeInto(field(page, 'filter'), 'Test');
      await expect(encounterRows(page)).toHaveCount(1);
      await text(page, 'Pokémon...').click();
      await byTestId(page, 'poke-Bulbasaur').click();
      await expect(text(page, 'Bulbasaur')).toBeAttached();
      await text(page, 'Status...').click();
      await text(page, 'Fainted').dispatchEvent('click');
      await byTestId(page, 'encounter-options-0').click();
      await byTestId(page, 'reset-encounter-0').click();
      await expect(text(page, 'Status...')).toBeAttached();
      await byTestId(page, 'encounter-options-0').click();
      await byTestId(page, 'delete-encounter-0').click();
      await text(page, 'OK').click();
      await expect(encounterRows(page)).toHaveCount(0);
      await navigate(page, 'builder');
      // Cypress force-clicks (dispatched to the element, never at coordinates) become dispatchEvent
      await byTestId(page, 'builder-add').dispatchEvent('click');
      await byTestId(page, 'poke-Bulbasaur').click();
      await deleteGame(page);
      await text(page, 'Cancel').click();
      await deleteGame(page);
      await text(page, 'OK').click();
      await expect(text(page, 'Emerald Kaizo')).toHaveCount(0);
    });

    test('Add game', async ({ page }) => {
      await byTestId(page, 'add-game').click();
      await text(page, 'Cancel').click();
      await addGame(page);
      await expect(field(page, 'add-game-input')).toHaveValue('Emerald Kaizo');
      await text(page, 'Save').click();
      await byTestId(page, 'custom-edit-badges').click();
      await text(page, 'Cancel').click();
      await byTestId(page, 'custom-edit-badges').click();
      await byTestId(page, 'add-cap').click();
      await byTestId(page, 'remove-custom-badge-0').click();
      await byTestId(page, 'add-cap').click();
      await typeInto(field(page, 'custom-badge-input-0'), '10');
      await expect(field(page, 'custom-badge-input-0')).toHaveValue('010');
      await text(page, 'Cancel').click();
      await text(page, '010').click();
      await byTestId(page, 'add-encounter').click();
    });

    test.describe('small screen', () => {
      test.use({ viewport: { width: 414, height: 736 } });

      test('Add game - small screen', async ({ page }) => {
        await addGame(page);
        await text(page, 'Save').click();
        await byTestId(page, 'fab-tracker').locator(':scope > .ui').click();
        await page
          .locator('[data-testid="fab-add-edit-badges"] > [data-testid="custom-edit-badges"]')
          .click();
        await text(page, 'Cancel').click();
        await page
          .locator('[data-testid="fab-add-encounter"] > [data-testid="add-encounter"]')
          .click();
      });
    });
  });

  test('Reset custom game encounters', async ({ page }) => {
    await addGame(page);
    await pickOption(page, 'encounter-template', 1);
    await text(page, 'Save').click();
    await expect(text(page, '14')).toBeAttached();
    await addEncounter(page);
    await byTestId(page, 'reset-all').click();
    await text(page, 'Save').click();
    await expect(encounterRows(page)).toHaveCount(0);
  });

  test('Delete game with full options', async ({ page }) => {
    await addGame(page);
    await text(page, 'Save').click();
    await addEncounter(page);
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'skip-encounter-0').click();
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'open-notes').click();
    await typeInto(byTestId(page, 'game-notes'), 'These are notes');
    await expect(byTestId(page, 'game-notes')).toHaveValue('These are notes');
    await byTestId(page, 'close-scroll-list').click();
    await deleteGame(page);
    await text(page, 'OK').click();
  });
});
