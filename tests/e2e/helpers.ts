// The only place e2e specs touch UI-library markup. When a widget moves off Semantic UI, change the
// helper body here and leave the specs alone.
import path from 'node:path';
import { expect, type Locator, type Page } from '@playwright/test';

export const FIXTURES = path.join('tests', 'data');
export const fixture = (name: string) => path.join(FIXTURES, name);

// Like cy.contains: case-sensitive substring, first match. A space also matches text split across
// elements with none between them ("<b>Met at:</b>Route 2")
export const text = (scope: Page | Locator, value: string) =>
  scope
    .getByText(new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s*')))
    .first();

export const byTestId = (page: Page, id: string) => page.locator(`[data-testid="${id}"]`);

// A text input that carries the test id itself or sits inside the element that does
export const field = (page: Page, id: string) =>
  page.locator(
    `input[data-testid="${id}"], textarea[data-testid="${id}"], [data-testid="${id}"] > input`
  );

// Types at the end of the current value, like cy.type (fill would replace it)
export const typeInto = async (locator: Locator, value: string) => {
  await locator.focus();
  await locator.press('End');
  await locator.pressSequentially(value);
};

export const openOptions = (page: Page) => byTestId(page, 'options').click();

export const navigate = async (page: Page, testId: string) => {
  await openOptions(page);
  await byTestId(page, testId).click();
};

// Dropdowns. Semantic UI renders role="option" items inside the open menu; the Combobox
// (data-slot="combobox") portals its menu, which carries the test id plus "-options"
export const options = (page: Page, id: string) =>
  byTestId(page, id)
    .getByRole('option')
    .or(byTestId(page, `${id}-options`).getByRole('option'));

const menuOpen = (dropdown: Locator) =>
  dropdown.locator(':scope > .menu.visible, :scope > input[aria-expanded="true"]').count();

// `covered`: the open menu sits under another element (known UI issue: the first row's nature
// menu opens upward beneath the badge strip), so the click is dispatched to the option directly,
// as Cypress did for every click
export const pickOption = async (
  page: Page,
  id: string,
  option: number | string,
  { covered = false } = {}
) => {
  const dropdown = byTestId(page, id);
  if (!(await menuOpen(dropdown))) await dropdown.click();
  const items = options(page, id);
  const item =
    typeof option === 'number' ? items.nth(option) : items.filter({ hasText: option }).first();
  if (covered) await item.dispatchEvent('click');
  else await item.click();
};

// The value (or placeholder) a dropdown shows
export const dropdownText = (page: Page, id: string) =>
  byTestId(page, id).locator(':scope > .text, :scope > [data-slot="combobox-value"]');

export const typeInDropdown = (page: Page, id: string, value: string) =>
  byTestId(page, id)
    .locator(':scope > input.search, :scope > input[role="combobox"]')
    .pressSequentially(value);

export const selectGame = async (page: Page, game: string) => {
  await byTestId(page, 'game-select').click();
  await byTestId(page, 'game-select').getByRole('option', { name: game, exact: true }).click();
};

// Checkboxes, toggles and radios
export const checkbox = (page: Page, id: string) => byTestId(page, id).locator('input');

export const toggle = async (page: Page, id: string) => {
  await byTestId(page, id).locator('label').click();
};

// A radio button picked by its label (e.g. an evolution in the Evolve modal)
export const radio = (page: Page, label: string) =>
  page.locator('.ui.radio.checkbox label').filter({ hasText: new RegExp(`^${label}$`) });

export const expectChecked = (page: Page, id: string, checked: boolean) =>
  expect(checkbox(page, id)).toBeChecked({ checked });

// Tab menus, numbered from 1 like the Cypress :nth-child selectors they replace
export const tabMenu = (page: Page, menu: 'secondary' | 'tabular' | Locator) =>
  typeof menu === 'string'
    ? page.locator(`.ui.${menu}.menu`).first().locator(':scope > .item')
    : menu.locator('.ui.menu').first().locator(':scope > .item');

export const tab = (page: Page, menu: 'secondary' | 'tabular' | Locator, n: number) =>
  tabMenu(page, menu).nth(n - 1);

// The count label on a tab (PokéStats)
export const tabCount = (page: Page, n: number) => tab(page, 'secondary', n).locator('.ui.label');

// The open dialog (Semantic's modal until every dialog is on Radix)
export const modalDialog = (page: Page) => page.locator('.ui.modal, [role="dialog"]');

// Modals and popovers close when the dimmed page around them is clicked
export const clickOutside = (page: Page) => page.mouse.click(2, 2);

export const modalField = (page: Page, n: number) =>
  page.locator('.ui.modal .content').locator(`:scope > :nth-child(${n}) > input`);

// Semantic's Popup opens on hover (after 50 ms) and toggles on click. A pointer click races the
// two: when the browser is slow, the hover opens it first and the click closes it again (WebKit's
// "Over 6 alert" flake). Dispatching the click never moves the pointer, so only the click counts.
export const openPopup = (trigger: Locator) => trigger.dispatchEvent('click');

// The help icon next to a widget
export const helpIcon = (page: Page, id: string) => byTestId(page, id).locator('.question').first();

// Number of encounters the virtualized tracker list renders
export const encounterRows = (page: Page) =>
  byTestId(page, 'encounters-list').locator(':scope > * > * > *');

// Range inputs: step to a value and fire change, as a user's drag would
export const stepTo = (locator: Locator, target: number) =>
  locator.evaluate((el: HTMLInputElement, value) => {
    const step = Number(el.getAttribute('step') || 1);
    const diff = value - Number(el.value);
    const steps = Math.abs(diff * step);
    if (diff > 0) el.stepUp(steps);
    else el.stepDown(steps);
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, target);

export const importFile = async (page: Page, name: string) => {
  await navigate(page, 'import');
  await byTestId(page, 'import-file-input').setInputFiles(fixture(name));
  await byTestId(page, 'apply-import').click();
};

// Fills a Pokémon's details in the encounter editor (was cy.pokemondetail)
export const pokemonDetail = async (page: Page) => {
  await typeInto(field(page, 'level'), '15');
  await expect(field(page, 'level')).toHaveValue('15');
  await typeInto(field(page, 'metlevel'), '5');
  await expect(field(page, 'metlevel')).toHaveValue('5');
  await pickOption(page, 'ability', 1);
  await pickOption(page, 'item', 1);
  await pickOption(page, 'gender', 1);
  await typeInto(byTestId(page, 'nature').locator('input.search'), 'Bold');
  await byTestId(page, 'shiny').click();
  await byTestId(page, 'move-summary').click();
  await byTestId(page, 'move-1').locator(':scope > div').click();
  await byTestId(page, 'move-Pound').click();
  await byTestId(page, 'move-2').locator(':scope > div').click();
  await byTestId(page, 'move-Karate Chop').dispatchEvent('click');
  await byTestId(page, 'move-3').locator(':scope > div').click();
  const filterButton = page.locator(
    '[data-testid="move-selector-wrapper"] > div > [data-testid="filter-button"]'
  );
  await filterButton.click();
  await byTestId(page, 'filter-gen-1').click();
  await byTestId(page, 'filter-type-WATER').click();
  await filterButton.click();
  await byTestId(page, 'move-Surf').dispatchEvent('click');
  await byTestId(page, 'move-4').locator(':scope > div').click();
  await byTestId(page, 'move-Pound').click();
};
