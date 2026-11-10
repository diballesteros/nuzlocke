// The Settings rows (5w): each switch is named by its row's title and described by its hint, the
// whole row toggles it, an off switch's border keeps 3:1 against its card, the language field has a
// visible label, and the custom statuses row counts the statuses
import { expect, test } from '../../fixtures';
import { byTestId, field, text, typeInto } from '../helpers';

const luminance = (rgb: string) => {
  const [r, g, b] = rgb
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map((c) => {
      const v = Number(c) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

test('a switch is named by its title, described by its hint, and its whole row toggles it', async ({
  page,
}) => {
  await page.goto('/settings');
  const nicknames = page.getByRole('switch', { name: 'Show nicknames', exact: true });
  await expect(nicknames).toHaveAttribute('data-testid', 'settings-nickname');
  await expect(nicknames).toHaveAccessibleDescription('Under each Pokémon in the tracker');
  await expect(nicknames).not.toBeChecked();
  // The hint is part of the row's label, so a click on it toggles the switch
  await page.getByText('Under each Pokémon in the tracker').click();
  await expect(nicknames).toBeChecked();
  // A click on the switch itself toggles it once
  await nicknames.click();
  await expect(nicknames).not.toBeChecked();
  // So does Space once it has focus
  await nicknames.focus();
  await page.keyboard.press('Space');
  await expect(nicknames).toBeChecked();
  await expect(
    page.getByRole('switch', { name: 'Duplicate clause', exact: true })
  ).toHaveAccessibleDescription('Show an alert on a duplicate Pokémon');
});

for (const scheme of ['light', 'dark'] as const) {
  test(`an off switch's border keeps 3:1 against its card (${scheme})`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.goto('/settings');
    // The seedless app follows its own dark mode setting, so set it to the scheme under test
    const dark = byTestId(page, 'settings-darkmode');
    if ((await dark.getAttribute('aria-checked')) !== String(scheme === 'dark')) await dark.click();
    await expect(dark).toHaveAttribute('aria-checked', String(scheme === 'dark'));
    await expect(page.locator('html')).toHaveClass(
      scheme === 'dark' ? /\bdark\b/ : /^(?!.*\bdark\b)/
    );
    const off = byTestId(page, 'settings-soulink');
    await expect(off).not.toBeChecked();
    // Polled, in case a theme transition is still running
    await expect
      .poll(async () => {
        const { border, card } = await off.evaluate((el) => ({
          border: getComputedStyle(el).borderTopColor,
          card: getComputedStyle(el.closest('section')!).backgroundColor,
        }));
        return contrast(border, card);
      })
      .toBeGreaterThanOrEqual(3);
  });
}

test('the language field has a visible label', async ({ page }) => {
  await page.goto('/settings');
  const language = byTestId(page, 'settings-language');
  await expect(page.getByLabel('Language', { exact: true })).toHaveAttribute(
    'data-testid',
    'settings-language'
  );
  const label = page.locator(`label[for="${await language.getAttribute('id')}"]`);
  await expect(label).toHaveText('Language');
  // A click on it focuses the field without opening its menu
  await label.click();
  await expect(language).toBeFocused();
  await expect(language).toHaveAttribute('aria-expanded', 'false');
  await expect(page.getByRole('option')).toHaveCount(0);
  // The same lookup finds the options once the menu does open, so the check above can fail
  await page.keyboard.press('Space');
  await expect(page.getByRole('option')).toHaveCount(3);
});

test('the custom statuses row counts the statuses', async ({ page }) => {
  await page.goto('/settings');
  const edit = page.getByRole('button', { name: 'Edit custom statuses' });
  await expect(edit).toHaveAccessibleDescription('None yet');
  await edit.click();
  await typeInto(field(page, 'custom-status-input'), 'Traded');
  await byTestId(page, 'add-status').click();
  await text(page, 'Cancel').click();
  await expect(edit).toHaveAccessibleDescription('1 custom status');
  await edit.click();
  await typeInto(field(page, 'custom-status-input'), 'Lent');
  await byTestId(page, 'add-status').click();
  await text(page, 'Cancel').click();
  await expect(edit).toHaveAccessibleDescription('2 custom statuses');
  await expect(edit).toHaveText('Edit');
});
