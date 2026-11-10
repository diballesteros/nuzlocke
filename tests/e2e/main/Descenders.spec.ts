// Truncated text must keep its descenders. An element that clips its overflow (truncate, or any
// overflow other than visible) clips at its own box, and a line height of 1 makes that box shorter
// than the font's glyphs: the bottoms of g, y and p were cut off three times (#908, the
// Calculator's row Selects, #918's Language field). The ink isn't in scrollHeight, so this measures
// each text's glyph box (a Range's rects: ascent to descent) against every clipping box around it.
//
// It visits each page from the seeds the visual suite uses, at desktop and phone widths, with the
// main menus and dialogs open, and fails on any text with a line under 1.2 times its font size
// whose own box fits a non-scrolling clip box while its glyphs stick out of it, by less than 40% of the font size (the top edge too: accents on
// capitals, as in de and es). Text cut with its box (a list's half-visible row, a collapsed
// section) is not a descender, and fully hidden text is skipped.
import fs from 'node:fs';
import path from 'node:path';
import { expect, type Page, test } from '../../fixtures';
import { byTestId, openOptions, tab, text } from '../helpers';

// Selectors of elements allowed to clip their text vertically, each with its reason. Keep it empty
// unless a design really needs it.
const ALLOWED: string[] = [];

interface Clipped {
  text: string;
  element: string;
  clippedBy: string;
  edge: 'top' | 'bottom';
  cut: number;
  fontSize: number;
  lineHeight: string;
}

const VIEWPORTS = { desktop: { width: 1280, height: 800 }, mobile: { width: 375, height: 812 } };

interface State {
  name: string;
  seed: string;
  route?: string;
  settings?: Record<string, unknown>;
  act?: (page: Page) => Promise<unknown>;
}

const firstOf = (page: Page, prefix: string) =>
  page.locator(`[data-testid^="${prefix}"]`).filter({ visible: true }).first();

const STATES: State[] = [
  { name: 'tracker', seed: 'mid-run' },
  { name: 'tracker compact', seed: 'mid-run', settings: { compact: true } },
  { name: 'tracker nicknames', seed: 'mid-run', settings: { nicknames: true } },
  {
    name: 'tracker compact nicknames',
    seed: 'mid-run',
    settings: { compact: true, nicknames: true },
  },
  { name: 'custom game', seed: 'custom-game' },
  { name: 'sidebar', seed: 'game-selected', act: (page) => openOptions(page) },
  {
    name: 'pokemon selector',
    seed: 'game-selected',
    act: (page) => byTestId(page, 'pokemon-0').click(),
  },
  { name: 'status menu', seed: 'mid-run', act: (page) => byTestId(page, 'status-1').click() },
  { name: 'nature menu', seed: 'mid-run', act: (page) => firstOf(page, 'nature-').click() },
  {
    name: 'row menu',
    seed: 'mid-run',
    act: (page) => firstOf(page, 'encounter-options-').click(),
  },
  {
    name: 'encounter editor',
    seed: 'mid-run',
    act: (page) => byTestId(page, 'edit-encounter-0').click(),
  },
  {
    name: 'location list',
    seed: 'mid-run',
    act: (page) => byTestId(page, 'open-scroll-list').click(),
  },
  { name: 'badge detail', seed: 'game-selected', route: '/badgedetail/4/0' },
  { name: 'rules', seed: 'mid-run', route: '/rules' },
  {
    name: 'rules ruleset menu',
    seed: 'mid-run',
    route: '/rules',
    act: (page) => byTestId(page, 'rule-select').click(),
  },
  {
    name: 'add rule',
    seed: 'game-selected',
    route: '/rules',
    act: async (page) => {
      await byTestId(page, 'add-rule').click();
      await text(page, 'Type').click();
    },
  },
  { name: 'stats', seed: 'mid-run', route: '/stats' },
  {
    name: 'stats settings',
    seed: 'mid-run',
    route: '/stats',
    act: (page) => byTestId(page, 'display-settings').click(),
  },
  {
    name: 'builder',
    seed: 'mid-run',
    route: '/builder',
    act: (page) => byTestId(page, 'expand-Bulbasaur').click(),
  },
  {
    name: 'coverage',
    seed: 'mid-run',
    route: '/builder',
    act: (page) => tab(page, 'secondary', 2).click(),
  },
  { name: 'calculator', seed: 'mid-run', route: '/calculator' },
  {
    name: 'calculator field',
    seed: 'mid-run',
    route: '/calculator',
    act: (page) => byTestId(page, 'field-settings').click(),
  },
  {
    name: 'calculator generation menu',
    seed: 'custom-game',
    route: '/calculator',
    act: (page) => byTestId(page, 'gen-selector').click(),
  },
  { name: 'settings', seed: 'game-selected', route: '/settings' },
  {
    name: 'settings language menu',
    seed: 'game-selected',
    route: '/settings',
    act: (page) => byTestId(page, 'settings-language').click(),
  },
  {
    name: 'custom statuses',
    seed: 'mid-run',
    route: '/settings',
    act: (page) => byTestId(page, 'edit-custom-statuses').click(),
  },
  { name: 'import', seed: 'game-selected', route: '/import' },
  { name: 'about', seed: 'game-selected', route: '/about' },
  { name: 'changelog', seed: 'game-selected', route: '/changelog' },
  { name: 'report', seed: 'game-selected', route: '/report' },
];

const open = async (page: Page, state: State) => {
  const seed = JSON.parse(
    fs.readFileSync(path.join('verification', 'seeds', `${state.seed}.json`), 'utf8')
  );
  Object.assign(seed.state, state.settings);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript((value) => {
    if (sessionStorage.getItem('__seeded')) return;
    localStorage.setItem('pokemon-tracker', value);
    sessionStorage.setItem('__seeded', '1');
  }, JSON.stringify(seed));
  await page.goto(state.route ?? '/');
  await byTestId(page, 'app').waitFor();
};

// Every text whose glyph box a non-scrolling clip box around it cuts by a little
const clippedText = (page: Page) =>
  page.evaluate((allowed): Clipped[] => {
    const describe = (el: Element) => {
      const id = el.getAttribute('data-testid');
      if (id) return `[data-testid="${id}"]`;
      const cls = typeof el.className === 'string' ? el.className.split(/\s+/).slice(0, 4) : [];
      return `${el.tagName.toLowerCase()}${cls.length ? `.${cls.join('.')}` : ''}`;
    };
    const found: Clipped[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const value = node.textContent?.trim();
      const element = node.parentElement;
      if (!value || !element) continue;
      const style = getComputedStyle(element);
      if (style.visibility !== 'visible' || style.opacity === '0') continue;
      if (allowed.some((selector) => element.closest(selector))) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
      if (!rects.length) continue;
      const fontSize = parseFloat(style.fontSize);
      // A line of 1.2 or more holds the glyphs in every engine. Below it, the glyph box decides;
      // above it, Firefox's taller glyph boxes stick out of 1.25 lines by under a pixel of
      // empty space, with no ink lost. ('normal' parses to NaN, which passes.)
      // The line's box: an inline element's box is its glyph box, so start from the block (or
      // inline-block, flex item…) that holds the line. Its line is at least as tall as the strut
      // of that block and as the inline's own line height
      let holder: Element = element;
      while (holder.parentElement && getComputedStyle(holder).display === 'inline') {
        holder = holder.parentElement;
      }
      const line = Math.max(
        parseFloat(style.lineHeight),
        parseFloat(getComputedStyle(holder).lineHeight)
      );
      if (!(line < 1.2 * fontSize)) continue;
      const own = holder.getBoundingClientRect();
      for (let box: Element | null = element; box && box !== document.body;) {
        const s = getComputedStyle(box);
        const r = box.getBoundingClientRect();
        // sr-only text: a 1px clip box, never painted
        if (r.width <= 1 || r.height <= 1) break;
        // A scrolling box cuts whatever is scrolled out of it; that's not a descender
        const clips = s.overflowY !== 'visible' && box.scrollHeight <= box.clientHeight + 1;
        if (clips) {
          // Overflow clips at the padding box
          const top = r.top + parseFloat(s.borderTopWidth);
          const bottom = r.bottom - parseFloat(s.borderBottomWidth);
          // Only text whose own box fits the clip box: a row half scrolled out of a list (or
          // out of a virtualized list's window) is cut with its box
          const fits = own.top >= top - 0.5 && own.bottom <= bottom + 0.5;
          for (const rect of fits ? rects : []) {
            if (rect.bottom <= top || rect.top >= bottom) continue;
            const below = rect.bottom - bottom;
            const above = top - rect.top;
            const cut = Math.max(below, above);
            if (cut > 0.5 && cut < 0.4 * fontSize) {
              found.push({
                text: value.slice(0, 40),
                element: describe(element),
                clippedBy: describe(box),
                edge: below >= above ? 'bottom' : 'top',
                cut: Math.round(cut * 10) / 10,
                fontSize,
                lineHeight: style.lineHeight,
              });
              break;
            }
          }
        }
        box = box.parentElement;
      }
    }
    return found;
  }, ALLOWED);

test.describe('Descenders', () => {
  for (const state of STATES) {
    for (const viewport of ['desktop', 'mobile'] as const) {
      test(`${state.name} ${viewport}`, async ({ page }) => {
        await page.setViewportSize(VIEWPORTS[viewport]);
        await open(page, state);
        await state.act?.(page);
        await page.evaluate(() => document.fonts.ready);
        // Menus and dialogs measure once their open animations have finished
        await page.waitForFunction(() =>
          document.getAnimations().every((animation) => animation.playState !== 'running')
        );
        expect(await clippedText(page)).toEqual([]);
      });
    }
  }
});
