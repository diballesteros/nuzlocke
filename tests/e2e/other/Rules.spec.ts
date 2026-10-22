import { expect, type Page, test } from '../../fixtures';
import {
  byTestId,
  clickOutside,
  field,
  importFile,
  navigate,
  openPopup,
  pickOption,
  selectGame,
  text,
  typeInto,
} from '../helpers';

const FAINT_RULE =
  'Any Pokémon that faints is considered dead, and must be released or put in the Pokémon Storage System permanently';

// Leaves the Rules page for the tracker and checks the first encounter's rule alert
const expectAlert = async (page: Page, alert: string, level?: string) => {
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'tracker');
  await byTestId(page, 'pokemon-0').click();
  await text(page, 'Scorbunny').click();
  if (level) {
    await byTestId(page, 'edit-encounter-0').click();
    await typeInto(field(page, 'level'), level);
    await text(page, 'Save').click();
  }
  await openPopup(byTestId(page, 'alert-0'));
  await expect(text(page, alert)).toBeAttached();
};

test.describe('Rules', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await navigate(page, 'rules');
  });

  test('Rule CRUD', async ({ page }) => {
    await byTestId(page, 'add-rule').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'add-rule').click();
    await typeInto(field(page, 'add-rule-input'), 'This is a test rule');
    await expect(field(page, 'add-rule-input')).toHaveValue('This is a test rule');
    await text(page, 'Save').click();
    await expect(text(page, 'This is a test rule')).toBeAttached();
    await byTestId(page, 'edit-rule-3').click();
    await typeInto(field(page, 'edit-rule-input'), ' this is now an edited rule');
    await expect(field(page, 'edit-rule-input')).toHaveValue(
      'This is a test rule this is now an edited rule'
    );
    await text(page, 'Save').click();
    await expect(text(page, 'This is a test rule this is now an edited rule')).toBeAttached();
    await byTestId(page, 'delete-rule-3').click();
    await expect(text(page, 'This is a test rule')).toHaveCount(0);
    const rule = (n: number) => byTestId(page, 'ruleslist').locator(`:scope > :nth-child(${n})`);
    await byTestId(page, 'arrow-down-0').click();
    await expect(rule(2)).toHaveText(`2.${FAINT_RULE}`);
    await byTestId(page, 'arrow-up-1').click();
    await expect(rule(1)).toHaveText(`1.${FAINT_RULE}`);
  });

  test('Custom ruleset', async ({ page }) => {
    await byTestId(page, 'add-ruleset').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'add-ruleset').click();
    await typeInto(field(page, 'add-ruleset-input'), 'Nuzlocke Custom');
    await expect(field(page, 'add-ruleset-input')).toHaveValue('Nuzlocke Custom');
    await text(page, 'Save').click();
    await pickOption(page, 'rule-select', 'Nuzlocke Custom');
    await byTestId(page, 'add-rule').click();
    await typeInto(field(page, 'add-rule-input'), 'This is a test rule');
    await expect(field(page, 'add-rule-input')).toHaveValue('This is a test rule');
    await text(page, 'Save').click();
    await expect(text(page, 'This is a test rule')).toBeAttached();
    await byTestId(page, 'delete-rule-0').click();
    await expect(text(page, 'This is a test rule')).toHaveCount(0);
    await byTestId(page, 'delete-ruleset').click();
    await text(page, 'Cancel').click();
    await byTestId(page, 'delete-ruleset').click();
    await text(page, 'OK').click();
    await byTestId(page, 'rule-select').click();
    await expect(byTestId(page, 'rule-select').getByRole('option')).not.toHaveCount(0);
    await expect(text(page, 'Nuzlocke Custom')).toHaveCount(0);
  });

  test.describe('Smart Rules', () => {
    test('Smart Rules of type', async ({ page }) => {
      await byTestId(page, 'add-rule').click();
      await text(page, 'Type').click();
      await byTestId(page, 'add-rule-type').click();
      await text(page, 'GRASS').click();
      await text(page, 'Type').click();
      await text(page, 'Save').click();
      await expect(text(page, 'Allowed types: GRASS')).toBeAttached();
      await byTestId(page, 'edit-rule-3').click();
      await text(page, 'Cancel').click();
      await byTestId(page, 'edit-rule-3').click();
      await byTestId(page, 'edit-rule-type').click();
      await text(page, 'ICE').click();
      await text(page, 'Save').dispatchEvent('click');
      await byTestId(page, 'add-rule').click();
      await text(page, 'Type').click();
      await expect(text(page, 'Type rule already exists')).toBeAttached();
      await text(page, 'Cancel').click();
      await expectAlert(page, 'FORBIDDEN TYPE');
    });

    test('Smart Rules of generation', async ({ page }) => {
      await byTestId(page, 'add-rule').click();
      await text(page, 'Generation').click();
      await byTestId(page, 'add-rule-generation').click();
      await text(byTestId(page, 'add-rule-generation'), '1').click();
      await text(page, 'Save').dispatchEvent('click');
      await expect(text(page, 'Allowed generations: 1')).toBeAttached();
      await byTestId(page, 'edit-rule-3').click();
      await byTestId(page, 'edit-rule-generation').click();
      await text(page, '6').click();
      await text(page, 'Save').dispatchEvent('click');
      await byTestId(page, 'add-rule').click();
      await text(page, 'Generation').click();
      await expect(text(page, 'Generation rule already exists')).toBeAttached();
      await text(page, 'Cancel').click();
      await expectAlert(page, 'FORBIDDEN GEN');
    });

    test('Smart Rules of level', async ({ page }) => {
      await byTestId(page, 'add-rule').click();
      await text(page, 'Level').click();
      await typeInto(field(page, 'add-rule-level-input'), '1');
      await text(page, 'Save').click();
      await expect(text(page, 'Max level 1')).toBeAttached();
      await byTestId(page, 'edit-rule-3').click();
      await field(page, 'edit-rule-level-input').clear();
      await typeInto(field(page, 'edit-rule-level-input'), '2');
      await text(page, 'Save').click();
      await byTestId(page, 'add-rule').click();
      await text(page, 'Level').click();
      await expect(text(page, 'Level rule already exists')).toBeAttached();
      await text(page, 'Cancel').click();
      await expectAlert(page, 'OVERLEVELED', '5');
    });
  });

  test('Over 6 alert', async ({ page }) => {
    await importFile(page, 'over6.json');
    await navigate(page, 'tracker');
    await openPopup(byTestId(page, 'alert-0'));
    await expect(text(page, 'TEAM OVER 6')).toBeAttached();
  });

  test.describe('Share text', () => {
    // Clipboard results differ by browser and by whether a click counts as user activation, so
    // every test supplies its own clipboard
    const visitWithClipboard = async (page: Page, clipboard: 'rejects' | 'broken' | 'works') => {
      await page.addInitScript((kind) => {
        const writeText =
          kind === 'works' ? () => Promise.resolve() : () => Promise.reject(new Error('denied'));
        const value = kind === 'broken' ? {} : { writeText };
        Object.defineProperty(navigator, 'clipboard', { value, configurable: true });
      }, clipboard);
      await page.goto('/rules');
      await page.locator('h1').click();
      await byTestId(page, 'share-encounters').click();
    };

    test('Share Error', async ({ page }) => {
      await visitWithClipboard(page, 'rejects');
      await expect(byTestId(page, 'share-textarea')).toBeAttached();
      await typeInto(byTestId(page, 'share-textarea'), 'Test');
      await text(page, 'Copy').click();
      await expect(text(page, 'Unable to share')).toBeAttached();
      await text(page, 'Cancel').click();
      await byTestId(page, 'share-encounters').click();
      await clickOutside(page);
    });

    test('Share Clipboard Error', async ({ page }) => {
      // A clipboard without writeText makes copying fail
      await visitWithClipboard(page, 'broken');
      await text(page, 'Copy').click();
      await expect(text(page, 'Unable to share')).toBeAttached();
    });

    test('Share Success', async ({ page }) => {
      await visitWithClipboard(page, 'works');
      await text(page, 'Copy').click();
      await expect(text(page, 'Copied')).toBeAttached();
    });
  });
});
