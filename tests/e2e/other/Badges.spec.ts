import { expect, test } from '../../fixtures';
import {
  byTestId,
  clickOutside,
  helpIcon,
  modalField,
  pickOption,
  selectGame,
  tab,
  text,
  typeInto,
} from '../helpers';

test.describe('Badges', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectGame(page, 'Sword and Shield');
  });

  test('Select badge', async ({ page }) => {
    const badge = page.locator('[title="Fire Badge"]');
    await expect(badge).toHaveCSS('filter', 'grayscale(1)');
    // Hovering a badge also clears the filter, so move the pointer away before each check
    const clickBadge = async () => {
      await badge.click();
      await page.mouse.move(0, 400);
    };
    await clickBadge();
    await expect(badge).not.toHaveCSS('filter', 'grayscale(1)');
    await clickBadge();
    await expect(badge).toHaveCSS('filter', 'grayscale(1)');
  });

  test('Edit badges', async ({ page }) => {
    const grass = page.locator('[title="Grass Badge"]');
    await expect(grass).toHaveText('20');
    await byTestId(page, 'edit-badges').click();
    await typeInto(modalField(page, 1), '9');
    await text(page, 'Cancel').click();
    await expect(grass).toHaveText('209');
    await byTestId(page, 'edit-badges').click();
    await text(page, 'Set default').click();
    await text(page, 'Cancel').click();
    await expect(grass).toHaveText('20');
    await selectGame(page, 'Red, Blue and Yellow');
    await byTestId(page, 'edit-badges').click();
    await pickOption(page, 'badge-multiple-default', 1);
    await expect(modalField(page, 1)).toHaveValue('12');
    await clickOutside(page);
  });

  test.describe('Smaller screen', () => {
    test.use({ viewport: { width: 414, height: 736 } });

    test('Edit badges - Smaller screen', async ({ page }) => {
      await byTestId(page, 'fab-tracker').locator(':scope > .ui').click();
      await page
        .locator('[data-testid="fab-add-edit-badges"] > [data-testid="edit-badges"]')
        .click();
    });
  });

  test('Badge Details', async ({ page }) => {
    await helpIcon(page, 'badge-detail-0').click();
    await expect(text(page, 'Eldegoss')).toBeAttached();
    await expect(text(page, 'DYNAMAX')).toBeAttached();
    await text(page, 'Back').click();
    await selectGame(page, 'Ultra Sun and Ultra Moon');
    await helpIcon(page, 'badge-detail-0').click();
    await expect(text(page, 'TOTEM')).toBeAttached();
    await text(page, 'Back').click();
    await selectGame(page, 'HeartGold and SoulSilver');
    await byTestId(page, 'badges').evaluate((el) => (el.scrollLeft = el.scrollWidth));
    await helpIcon(page, 'badge-detail-8').click();
    await text(page, 'Rematch').click();
    await expect(text(page, 'Bronzong')).toBeAttached();
    await text(page, 'Original').click();
    await expect(text(page, 'Xatu')).toBeAttached();
    await text(page, 'Rematch').click();
    await tab(page, byTestId(page, 'badge-details-tabs'), 5).click();
    await expect(text(page, 'Salamence')).toBeAttached();
    await expect(text(page, '241')).toBeAttached();
  });

  test('Badge detail incorrect parameters', async ({ page }) => {
    await page.goto('/badgedetail/13/15');
    await expect(page).not.toHaveURL(/\/badgedetail/);
    await page.goto('/badgedetail/25/25');
    await expect(page).not.toHaveURL(/\/badgedetail/);
  });
});
