// Behaviour a screenshot can't show, pinned before the UI library changes: keyboard use, menus
// rendering above the virtualized tracker rows, and scroll position across updates.
import { expect, type Locator, type Page, test } from '../../fixtures';
import {
  byTestId,
  dropdownText,
  importFile,
  modalDialog,
  navigate,
  options,
  selectGame,
  typeInDropdown,
} from '../helpers';

// True when the element's centre isn't covered by anything else (what a click would hit)
const isOnTop = (locator: Locator) =>
  locator.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return !!hit && (el === hit || el.contains(hit));
  });

const openTrackerRun = async (page: Page) => {
  await page.goto('/');
  await importFile(page, 'over6.json');
  await navigate(page, 'tracker');
};

// Today only dialogs given an onClose close on Escape (and on a click outside); the rest close only
// from their buttons. Component libraries usually close every dialog on Escape, so a migration
// must keep each row's behaviour, or change it on purpose and update this table.
const ESCAPE: { dialog: string; route: string; open: string; closes: boolean }[] = [
  { dialog: 'add encounter', route: '/', open: 'add-encounter', closes: true },
  { dialog: 'reset all', route: '/', open: 'reset-all', closes: true },
  { dialog: 'share', route: '/rules', open: 'share-encounters', closes: true },
  { dialog: 'Pokémon selector', route: '/', open: 'pokemon-0', closes: false },
  { dialog: 'add rule', route: '/rules', open: 'add-rule', closes: false },
  { dialog: 'add ruleset', route: '/rules', open: 'add-ruleset', closes: true },
  { dialog: 'custom statuses', route: '/settings', open: 'edit-custom-statuses', closes: false },
];

for (const { dialog, route, open, closes } of ESCAPE) {
  test(`Escape ${closes ? 'closes' : 'does not close'} the ${dialog} dialog`, async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
    if (route !== '/') await navigate(page, route.slice(1));
    await byTestId(page, open).click();
    const modal = modalDialog(page);
    await expect(modal).toBeVisible();
    await page.keyboard.press('Escape');
    if (closes) {
      await expect(modal).toHaveCount(0);
    } else {
      // Closing would be synchronous; give it two frames to happen before asserting it didn't
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      );
      await expect(modal).toBeVisible();
    }
  });
}

test('a searchable dropdown picks the first match with Enter', async ({ page }) => {
  await page.goto('/');
  await navigate(page, 'calculator');
  await selectGame(page, 'Sword and Shield');
  await typeInDropdown(page, 'nature1', 'Bol');
  await page.keyboard.press('Enter');
  await expect(dropdownText(page, 'nature1')).toHaveText('Bold');
});

test('an open status menu sits above the rows below it', async ({ page }) => {
  await openTrackerRun(page);
  await byTestId(page, 'status-1').click();
  const items = options(page, 'status-1');
  await expect(items.first()).toBeVisible();
  // The last option overlaps the next row; it must still be the topmost element
  await items.last().scrollIntoViewIfNeeded();
  expect(await isOnTop(items.last())).toBe(true);
});

test('changing a status keeps the tracker scrolled where it was', async ({ page }) => {
  await openTrackerRun(page);
  await byTestId(page, 'open-scroll-list').click();
  await byTestId(page, 'scroll-to-encounter-6').click();
  const row = byTestId(page, 'status-6');
  await expect(row).toBeVisible();
  const before = await row.boundingBox();
  await byTestId(page, 'status-6').click();
  await options(page, 'status-6').nth(1).click();
  await expect(row).toBeVisible();
  expect((await row.boundingBox())?.y).toBeCloseTo(before?.y ?? NaN, 0);
});

// The encounter editor and the dialogs it opens, which stack: Escape closes only the top one, and
// only the nature and ability tables (which had an onClose); the editor and the move list stay.
test('Escape in the encounter editor closes only the nature and ability tables', async ({
  page,
}) => {
  await page.goto('/');
  await selectGame(page, 'Sword and Shield');
  await byTestId(page, 'pokemon-0').click();
  await byTestId(page, 'poke-Scorbunny').dispatchEvent('click');
  await byTestId(page, 'edit-encounter-0').click();
  const dialogs = modalDialog(page);
  const twoFrames = () =>
    page.evaluate(
      () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    );
  await expect(dialogs).toHaveCount(1);
  await page.keyboard.press('Escape');
  await twoFrames();
  await expect(dialogs).toHaveCount(1);
  for (const open of ['nature-info', 'ability-info']) {
    await byTestId(page, open).click();
    await expect(dialogs).toHaveCount(2);
    await page.keyboard.press('Escape');
    await expect(dialogs).toHaveCount(1);
  }
  await byTestId(page, 'move-summary').click();
  await byTestId(page, 'move-1').locator(':scope > div').click();
  await expect(dialogs).toHaveCount(2);
  await page.keyboard.press('Escape');
  await twoFrames();
  await expect(dialogs).toHaveCount(2);
});
