// The Report page's quick feedback: Sentry's form, loaded on the first click. It asks for a message
// only (no name, email or screenshot) and is removed again on Cancel. Nothing is sent: the dev DSN
// is empty, and the spec fails on any request to the tunnel or to Sentry.
import { expect, test } from '../../fixtures';
import { byTestId, typeInto } from '../helpers';

test('quick feedback opens a message-only form and closes on Cancel', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', (request) => {
    if (/\/diag|sentry\.io/.test(request.url())) sent.push(request.url());
  });
  await page.goto('/report');

  await byTestId(page, 'report-feedback').click();
  const form = page.getByRole('dialog');
  await expect(form).toBeVisible();
  await expect(form.getByRole('heading')).toHaveText('Send feedback');
  const message = form.getByRole('textbox', { name: /What happened\?/ });
  await expect(message).toHaveAttribute('placeholder', 'Describe the problem or your idea');
  // The message is the only field: name and email stay hidden, and there's no screenshot button
  await expect(form.getByRole('textbox')).toHaveCount(1);
  await expect(form.getByRole('button')).toHaveText(['Send', 'Cancel']);
  await expect(form.getByRole('link')).toHaveCount(0);

  // A second click while it's open doesn't add another form
  await byTestId(page, 'report-feedback').dispatchEvent('click');
  await expect(page.locator('#nuzlocke-feedback')).toHaveCount(1);

  await typeInto(message, 'The Rival fight is missing');
  await form.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('#nuzlocke-feedback')).toHaveCount(0);

  // It opens again, empty
  await byTestId(page, 'report-feedback').click();
  await expect(page.getByRole('dialog').getByRole('textbox')).toHaveValue('');
  expect(sent).toEqual([]);
});
