// The Builder's member cards from the keyboard (5t): the header shows a focus ring around the
// expand button, and after Delete focus moves to the card that takes the deleted one's place
import { expect, test } from '../../fixtures';
import { byTestId, navigate, selectGame } from '../helpers';

test('Builder cards from the keyboard', async ({ browserName, page }) => {
  await page.goto('/');
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'builder');
  for (const name of ['Bulbasaur', 'Charmander']) {
    await byTestId(page, 'builder-add').click();
    await byTestId(page, `poke-${name}`).dispatchEvent('click');
  }

  // Tab from the first card's header, past its type chips, to the next card's: a closed card's
  // fields are skipped, and the header shows the focus ring
  // macOS WebKit moves Tab between text fields only (Option+Tab reaches every control); Linux
  // WebKit, as in CI, tabs to buttons
  const tab = browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab';
  const next = byTestId(page, 'expand-Charmander');
  await byTestId(page, 'expand-Bulbasaur').focus();
  for (let i = 0; i < 5 && !(await next.evaluate((el) => el === document.activeElement)); i += 1) {
    await page.keyboard.press(tab);
  }
  await expect(next).toBeFocused();
  // The ring is drawn on the header, which holds the button
  await expect(
    byTestId(page, 'team-poke-Charmander').locator(':scope > div').first()
  ).not.toHaveCSS('outline-style', 'none');

  const expand = byTestId(page, 'expand-Bulbasaur');
  await expand.focus();
  await page.keyboard.press('Enter');
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  await byTestId(page, 'delete-team-0').focus();
  await page.keyboard.press('Enter');
  await expect(byTestId(page, 'expand-Charmander')).toBeFocused();
});
