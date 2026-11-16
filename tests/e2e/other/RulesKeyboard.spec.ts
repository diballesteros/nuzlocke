// Focus on the Rules page (5u): it follows a moved rule, and after Delete it goes to the next
// rule's first action (else the previous rule's, else Add rule). Rows are keyed by their place, so
// without this focus would stay with whichever rule took the moved or deleted one's place
import { expect, type Page, test } from '../../fixtures';
import { byTestId, field, navigate, text, typeInto } from '../helpers';

const FAINT_RULE = /^\d\.Any Pokémon that faints/;
const rule = (page: Page, n: number) =>
  byTestId(page, 'ruleslist').locator(`:scope > :nth-child(${n})`);

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'rules');
  // The sidebar stays mounted for its slide-out
  await expect(page.locator('[data-slot="sheet-content"]')).toHaveCount(0);
});

test('A moved or deleted rule keeps keyboard focus in place', async ({ page }) => {
  await byTestId(page, 'arrow-down-0').focus();
  await page.keyboard.press('Enter');
  await expect(rule(page, 2)).toHaveText(FAINT_RULE);
  await expect(byTestId(page, 'arrow-down-1')).toBeFocused();
  // At the end of the list the rule has no arrow down: focus takes its arrow up
  await page.keyboard.press('Enter');
  await expect(rule(page, 3)).toHaveText(FAINT_RULE);
  await expect(byTestId(page, 'arrow-up-2')).toBeFocused();

  await byTestId(page, 'add-rule').click();
  await typeInto(field(page, 'add-rule-input'), 'This is a test rule');
  await text(page, 'Save').click();
  await byTestId(page, 'delete-rule-3').focus();
  await page.keyboard.press('Enter');
  await expect(text(page, 'This is a test rule')).toHaveCount(0);
  // The last rule went, so focus goes to the rule before it
  await expect(byTestId(page, 'arrow-up-2')).toBeFocused();
});

test.describe('On a phone', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  const choose = async (page: Page, n: number, item: string) => {
    await byTestId(page, `rule-options-${n}`).click();
    await page.getByRole('menuitem', { name: item }).click();
  };

  test("Each rule's menu, and where focus goes after it", async ({ page }) => {
    await choose(page, 0, 'Move down');
    await expect(rule(page, 2)).toHaveText(FAINT_RULE);
    await expect(byTestId(page, 'rule-options-1')).toBeFocused();

    await byTestId(page, 'add-rule').click();
    await typeInto(field(page, 'add-rule-input'), 'This is a test rule');
    await text(page, 'Save').click();
    // Edit hands focus back to the rule's ⋮
    await choose(page, 3, 'Edit');
    await expect(field(page, 'edit-rule-input')).toHaveValue('This is a test rule');
    await text(page, 'Cancel').click();
    await expect(byTestId(page, 'rule-options-3')).toBeFocused();

    await choose(page, 3, 'Move up');
    await expect(rule(page, 3)).toHaveText(/^\d\.This is a test rule$/);
    await expect(byTestId(page, 'rule-options-2')).toBeFocused();

    // A default rule offers no Edit or Delete
    await byTestId(page, 'rule-options-0').click();
    await expect(page.getByRole('menuitem')).toHaveText(['Move down']);
    await page.keyboard.press('Escape');

    // After Delete focus goes to the rule that took its place
    await choose(page, 2, 'Delete');
    await expect(text(page, 'This is a test rule')).toHaveCount(0);
    await expect(byTestId(page, 'rule-options-2')).toBeFocused();
  });
});
