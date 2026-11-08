// The Builder's member cards from the keyboard (5t): the header shows a focus ring around the
// expand button, and after Delete focus moves to the card that takes the deleted one's place
import { expect, test } from '../../fixtures';
import { byTestId, navigate, selectGame } from '../helpers';

test('Builder cards from the keyboard', async ({ page }) => {
  await page.goto('/');
  await selectGame(page, 'Sword and Shield');
  await navigate(page, 'builder');
  for (const name of ['Bulbasaur', 'Charmander']) {
    await byTestId(page, 'builder-add').click();
    await byTestId(page, `poke-${name}`).dispatchEvent('click');
  }

  const expand = byTestId(page, 'expand-Bulbasaur');
  await expand.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(expand).toBeFocused();
  // The ring is drawn on the header, which holds the button
  await expect(byTestId(page, 'team-poke-Bulbasaur').locator(':scope > div').first()).not.toHaveCSS(
    'outline-style',
    'none'
  );

  await page.keyboard.press('Enter');
  await expect(expand).toHaveAttribute('aria-expanded', 'true');
  await byTestId(page, 'delete-team-0').focus();
  await page.keyboard.press('Enter');
  await expect(byTestId(page, 'expand-Charmander')).toBeFocused();
});
