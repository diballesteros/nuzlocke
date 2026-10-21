import fs from 'node:fs';
import { expect, type Page, test } from '../../fixtures';
import {
  byTestId,
  expectChecked,
  field,
  importFile,
  navigate,
  pickOption,
  selectGame,
  tab,
  tabCount,
  text,
  toggle,
  typeInto,
} from '../helpers';

const toggleSetting = async (page: Page, id: string, checked: boolean) => {
  await toggle(page, id);
  await expectChecked(page, id, checked);
};

// The display settings panel groups its options in <details>, numbered from 1
const openSection = (page: Page, n: number) =>
  page
    .locator('summary')
    .nth(n - 1)
    .click();

test.describe('PokéStats', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
  });

  test('Tips', async ({ page }) => {
    await navigate(page, 'stats');
    for (const n of [2, 3, 4, 5]) {
      await tabCount(page, n).click();
      await expect(byTestId(page, 'status-tip')).toBeAttached();
    }
  });

  test('General Stats Page', async ({ page }) => {
    await importFile(page, 'Team.json');
    await navigate(page, 'tracker');
    await byTestId(page, 'open-scroll-list').click();
    await byTestId(page, 'open-scroll-list').click();
    await navigate(page, 'stats');

    await expect(text(page, '18%')).toBeAttached();
    await expect(text(page, 'Pound')).toBeAttached();
    await expect(text(page, 'Karate Chop')).toBeAttached();
    await expect(text(page, 'Surf')).toBeAttached();
    await expect(text(page, 'Vulpix')).toBeAttached();
    await expect(byTestId(page, 'image-box-0-true')).toBeAttached();
    await expect(byTestId(page, 'image-fainted-0-true')).toBeAttached();
    // Card headings are uppercased by CSS only; their DOM text is title case
    const headings = ['Encounters', 'Stats', 'Boxed', 'Fainted', 'Rules'];
    const card = byTestId(page, 'image-header-true').locator('xpath=..');
    const heading = (name: string) => card.locator('span').getByText(name, { exact: true });
    for (const name of headings) await expect(heading(name).first()).toBeAttached();
    await byTestId(page, 'display-settings').click();
    await openSection(page, 1);
    await typeInto(field(page, 'summary-title'), ' New');
    await expect(field(page, 'summary-title')).toHaveValue('Nuzlocke Run New');
    await pickOption(page, 'summary-status', 1);
    await pickOption(page, 'summary-status', 2);
    await openSection(page, 2);
    await toggleSetting(page, 'summary-encounters', false);
    await openSection(page, 3);
    await toggleSetting(page, 'summary-stats', false);
    await toggleSetting(page, 'summary-boxed', false);
    await toggleSetting(page, 'summary-fainted', false);
    await openSection(page, 4);
    await toggleSetting(page, 'summary-rules', false);
    await openSection(page, 5);
    await expectChecked(page, 'summary-show-description', true);
    await toggleSetting(page, 'summary-show-description', false);
    await toggleSetting(page, 'summary-show-description', true);
    await typeInto(byTestId(page, 'summary-description'), 'Summary description');
    await expect(byTestId(page, 'summary-description')).toHaveValue('Summary description');
    await byTestId(page, 'display-settings').click();
    for (const name of headings) await expect(heading(name)).toHaveCount(0);
    await expect(text(page, 'Summary description')).toBeAttached();
    await tabCount(page, 5).click();
    await expect(tabCount(page, 5)).toHaveText('1');
    await tabCount(page, 4).click();
    await expect(tabCount(page, 4)).toHaveText('1');
    await tabCount(page, 3).click();
    await expect(tabCount(page, 3)).toHaveText('4');

    await byTestId(page, 'caught-0').click();
    await byTestId(page, 'caught-1').click();
    await byTestId(page, 'caught-2').click();
    await tab(page, 'secondary', 4).click();
    await expect(byTestId(page, 'failed-5')).toBeAttached();
    await tab(page, 'secondary', 5).click();
    await byTestId(page, 'fainted-4').click();
    await expect(text(page, 'Lv. 15')).toBeAttached();
    await expect(text(page, 'Met at: Route 2, at lv. 5')).toBeAttached();
    await expect(text(page, 'Bold nature')).toBeAttached();
    await expect(text(page, 'Arena Trap')).toBeAttached();
    await expect(text(page, 'Item: Black Belt')).toBeAttached();
    await expect(text(page, 'Cause of Fainting: Died to crit')).toBeAttached();
    await tab(page, 'secondary', 2).click();
    await byTestId(page, 'team-6').click();
    await expect(text(page, 'Wild Area: Dappled Grove')).toBeAttached();
  });

  test('Download Image', async ({ page }) => {
    await navigate(page, 'stats');
    await page.locator('h1').click();
    const download = page.waitForEvent('download');
    await byTestId(page, 'download-image').click();
    const file = await (await download).path();
    expect((await download).suggestedFilename()).toBe('nuzlocke.png');
    expect(fs.statSync(file).size).toBeGreaterThan(1000);
  });

  test.describe('Share Image', () => {
    const visitWithShare = async (page: Page, canShare: boolean) => {
      await page.addInitScript((supported) => {
        const calls: unknown[] = [];
        Object.defineProperty(window, '__shareCalls', { value: calls });
        Object.defineProperty(navigator, 'canShare', { value: () => supported });
        Object.defineProperty(navigator, 'share', {
          value: (data: unknown) => {
            calls.push(data);
            return Promise.resolve();
          },
        });
      }, canShare);
      await page.goto('/stats');
    };
    const shareCalls = (page: Page) =>
      page.evaluate(() => (window as unknown as { __shareCalls: unknown[] }).__shareCalls.length);

    test('Share Success', async ({ page }) => {
      await visitWithShare(page, true);
      await byTestId(page, 'share-image').click();
      await expect(text(page, 'Share the image!')).toBeAttached({ timeout: 15_000 });
      expect(await shareCalls(page)).toBe(1);
    });

    test('Share Unsupported', async ({ page }) => {
      await visitWithShare(page, false);
      await byTestId(page, 'share-image').click();
      await expect(text(page, 'Unable to share')).toBeAttached({ timeout: 15_000 });
      expect(await shareCalls(page)).toBe(0);
    });
  });
});
