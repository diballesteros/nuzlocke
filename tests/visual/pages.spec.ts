// Visual, ARIA and accessibility baselines for every page and its key open states, in light and
// dark, at desktop and mobile widths. Rendered only in the pinned Playwright Docker image
// (npm run verify:visual) so fonts and anti-aliasing match CI.
//
// Every test is tagged with the areas it renders (see tags()). CI derives the areas a PR touches
// from its import graph (scripts/affected-areas.mjs) and fails on any change in an untouched area;
// changes in touched areas are reviewed and logged in verification/approved-diffs.tsv when the
// baselines are updated.
import fs from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from '../fixtures';
import { byTestId, openOptions, tab, text } from '../e2e/helpers';

type Viewport = 'desktop' | 'mobile';
type Theme = 'light' | 'dark';

interface State {
  name: string;
  area: string;
  seed: string;
  route?: string;
  act?: (page: Page, viewport: Viewport) => Promise<unknown>;
}

const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 375, height: 812 } };

// The area that owns each route's page. A state is tagged with its own area, its page's area and
// shell (the header renders everywhere): the sidebar or a dialog over the tracker shows tracker
// rows too, so a tracker change must count as touching them
const ROUTE_AREAS: [RegExp, string][] = [
  [/^\/$/, 'tracker'],
  [/^\/rules/, 'rules'],
  [/^\/stats/, 'pokestats'],
  [/^\/builder/, 'builder'],
  [/^\/calculator/, 'calculator'],
  [/^\/settings/, 'settings'],
  [/^\/badgedetail/, 'badges'],
  [/^\/(import|about|changelog|report|delete)/, 'misc'],
];

const tags = (state: State) => {
  const route = state.route ?? '/';
  const page = ROUTE_AREAS.find(([pattern]) => pattern.test(route))?.[1];
  return [...new Set([state.area, page, 'shell'])].filter(Boolean).map((area) => `@${area}`);
};

// On small screens the tracker's Add/Reset/badge buttons live in the FAB
const openFab = async (page: Page, viewport: Viewport) => {
  if (viewport === 'mobile') await byTestId(page, 'fab-tracker').locator(':scope > .ui').click();
};

const STATES: State[] = [
  { name: 'home-empty', area: 'shell', seed: 'empty' },
  { name: 'sidebar', area: 'shell', seed: 'game-selected', act: (page) => openOptions(page) },
  { name: 'tracker-fresh', area: 'tracker', seed: 'game-selected' },
  { name: 'tracker-run', area: 'tracker', seed: 'mid-run' },
  {
    name: 'pokemon-selector',
    area: 'tracker',
    seed: 'game-selected',
    act: (page) => byTestId(page, 'pokemon-0').click(),
  },
  {
    name: 'status-menu',
    area: 'tracker',
    seed: 'mid-run',
    act: (page) => byTestId(page, 'status-1').click(),
  },
  {
    name: 'encounter-editor',
    area: 'tracker',
    seed: 'mid-run',
    act: (page) => byTestId(page, 'edit-encounter-0').click(),
  },
  {
    name: 'scroll-list',
    area: 'tracker',
    seed: 'mid-run',
    act: (page) => byTestId(page, 'open-scroll-list').click(),
  },
  { name: 'custom-game', area: 'tracker', seed: 'custom-game' },
  {
    name: 'badge-editor',
    area: 'badges',
    seed: 'game-selected',
    act: async (page, viewport) => {
      await openFab(page, viewport);
      await byTestId(page, 'edit-badges').filter({ visible: true }).first().click();
    },
  },
  { name: 'badge-detail', area: 'badges', seed: 'game-selected', route: '/badgedetail/4/0' },
  { name: 'rules', area: 'rules', seed: 'mid-run', route: '/rules' },
  {
    name: 'add-rule',
    area: 'rules',
    seed: 'game-selected',
    route: '/rules',
    act: async (page) => {
      await byTestId(page, 'add-rule').click();
      await text(page, 'Type').click();
    },
  },
  { name: 'stats', area: 'pokestats', seed: 'mid-run', route: '/stats' },
  {
    name: 'stats-settings',
    area: 'pokestats',
    seed: 'mid-run',
    route: '/stats',
    act: (page) => byTestId(page, 'display-settings').click(),
  },
  {
    name: 'builder',
    area: 'builder',
    seed: 'mid-run',
    route: '/builder',
    act: (page) => byTestId(page, 'expand-Bulbasaur').click(),
  },
  {
    name: 'coverage',
    area: 'builder',
    seed: 'mid-run',
    route: '/builder',
    act: (page) => tab(page, 'secondary', 2).click(),
  },
  { name: 'calculator', area: 'calculator', seed: 'mid-run', route: '/calculator' },
  {
    name: 'calculator-field',
    area: 'calculator',
    seed: 'mid-run',
    route: '/calculator',
    act: (page) => byTestId(page, 'field-settings').click(),
  },
  { name: 'settings', area: 'settings', seed: 'game-selected', route: '/settings' },
  {
    name: 'custom-statuses',
    area: 'settings',
    seed: 'mid-run',
    route: '/settings',
    act: (page) => byTestId(page, 'edit-custom-statuses').click(),
  },
  { name: 'import', area: 'misc', seed: 'game-selected', route: '/import' },
  { name: 'about', area: 'misc', seed: 'game-selected', route: '/about' },
  { name: 'changelog', area: 'misc', seed: 'game-selected', route: '/changelog' },
  { name: 'report', area: 'misc', seed: 'game-selected', route: '/report' },
];

// Starts the app from a seed with the theme set, before any app code runs
const open = async (page: Page, state: State, theme: Theme) => {
  const seed = JSON.parse(
    fs.readFileSync(path.join('verification', 'seeds', `${state.seed}.json`), 'utf8')
  );
  seed.state.darkMode = theme === 'dark';
  await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
  await page.addInitScript((value) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('pokemon-tracker', value);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify(seed));
  await page.goto(state.route ?? '/');
  await byTestId(page, 'app').waitFor();
};

// Sprites, badge images and the icon font are all local; wait until they have painted
const settle = async (page: Page) => {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : img.decode().catch((): null => null)
      )
    );
  });
};

// Violations as rule, impact and node count: stable across runs, and any new or fixed violation
// changes the file (fixed ones must be removed from the baseline too)
const a11ySummary = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const summary = violations
    .map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length }))
    .sort((a, b) => a.id.localeCompare(b.id));
  return `${JSON.stringify(summary, null, 2)}\n`;
};

for (const state of STATES) {
  for (const viewport of ['desktop', 'mobile'] as const) {
    test.describe(`${state.name} ${viewport}`, { tag: tags(state) }, () => {
      test.use({ viewport: VIEWPORTS[viewport] });

      for (const theme of ['dark', 'light'] as const) {
        test(theme, async ({ page }) => {
          await open(page, state, theme);
          await state.act?.(page, viewport);
          await settle(page);
          const name = `${state.area}/${state.name}-${viewport}-${theme}`;
          // threshold 0: rendering in the pinned image is deterministic, and the default (0.2)
          // treats close dark greys as equal, hiding dark-theme changes
          await expect(page).toHaveScreenshot(`${name}.png`, {
            animations: 'disabled',
            caret: 'hide',
            threshold: 0,
          });
          expect(await a11ySummary(page)).toMatchSnapshot(`${name}.a11y.json`);
          // Roles and names don't depend on the theme
          if (theme === 'dark') {
            await expect(page.locator('body')).toMatchAriaSnapshot({
              name: `${state.area}/${state.name}-${viewport}.aria.yml`,
            });
          }
        });
      }
    });
  }
}
