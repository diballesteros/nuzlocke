// Browser translation (Chrome's built-in translate, Google Translate) replaces each text node with
// <font> elements. React then can't remove a text node it rendered, and the next change threw
// "Failed to execute 'removeChild' on 'Node'" (a production Sentry report from the header's game
// Select, on a German Chrome). These pin that the app survives a translated page.
import { expect, type Page, test } from '../../fixtures';
import { byTestId, selectGame } from '../helpers';

// What Google Translate does to a page: every non-blank text node becomes <font><font>text</font></font>
const translatePage = (page: Page) =>
  page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      if (node.data.trim() && !node.parentElement?.closest('script, style')) nodes.push(node);
    }
    for (const node of nodes) {
      const outer = document.createElement('font');
      const inner = document.createElement('font');
      inner.textContent = node.data;
      outer.append(inner);
      node.replaceWith(outer);
    }
    return nodes.length;
  });

test('changing the game on a translated page', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  await page.goto('/');
  await selectGame(page, 'Red, Blue and Yellow');
  expect(await translatePage(page)).toBeGreaterThan(0);
  await selectGame(page, 'Gold, Silver and Crystal');
  await expect(byTestId(page, 'game-select')).toContainText('Gold, Silver and Crystal');
  await selectGame(page, 'Ruby, Sapphire and Emerald');
  await expect(byTestId(page, 'game-select')).toContainText('Ruby, Sapphire and Emerald');
  expect(errors.filter((e) => e.includes('removeChild'))).toEqual([]);
});

test('the page states its language, so browsers only offer to translate other languages', async ({
  page,
}) => {
  await page.goto('/settings');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await byTestId(page, 'settings-language').click();
  await page.getByRole('option', { name: 'Deutsch' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
