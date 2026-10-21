// Helpers for the persisted-store goldens: load a seed before the app boots, and describe what a
// journey changed in localStorage["pokemon-tracker"] as a stable, reviewable JSON document.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@playwright/test';

const STORE_KEY = 'pokemon-tracker';

export const seedJson = (name: string) =>
  fs.readFileSync(path.join('verification', 'seeds', `${name}.json`), 'utf8');

// Seeds storage once per test (sessionStorage survives reloads, so later reloads keep app state)
export const openWithSeed = async (page: Page, name: string, route = '/') => {
  await page.addInitScript(
    ([key, value]) => {
      if (sessionStorage.getItem('__seeded')) return;
      localStorage.setItem(key, value);
      sessionStorage.setItem('__seeded', '1');
    },
    [STORE_KEY, seedJson(name)]
  );
  await page.goto(route);
  await page.locator('[data-testid="app"]').waitFor();
};

export const readStore = async (page: Page) =>
  JSON.parse((await page.evaluate((key) => localStorage.getItem(key), STORE_KEY)) ?? 'null');

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Change = { path: string; before?: Json; after?: Json };

const isObject = (value: unknown): value is Record<string, Json> =>
  typeof value === 'object' && value !== null;

// Arrays of records with unique ids (encounters, rules) are compared by id, so deleting one entry
// shows as one removal instead of every later index changing
const byId = (list: Json[]) => {
  const ids = list.map((item) => (isObject(item) && !Array.isArray(item) ? item.id : undefined));
  if (ids.some((id) => id === undefined || id === null) || new Set(ids).size !== ids.length) {
    return null;
  }
  return Object.fromEntries(list.map((item, i) => [`id=${ids[i]}`, item]));
};

const diff = (before: Json, after: Json, at: string, out: Change[], depth = Infinity) => {
  if (depth <= 0) {
    if (JSON.stringify(before) !== JSON.stringify(after)) out.push({ path: at, before, after });
    return;
  }
  if (Array.isArray(before) && Array.isArray(after)) {
    const [keyedBefore, keyedAfter] = [byId(before), byId(after)];
    if (keyedBefore && keyedAfter) {
      const order = [Object.keys(keyedBefore), Object.keys(keyedAfter)];
      if (order[0].join() !== order[1].filter((k) => k in keyedBefore).join()) {
        out.push({ path: `${at}.order`, before: order[0], after: order[1] });
      }
      for (const key of new Set([...order[0], ...order[1]])) {
        const next = `${at}[${key}]`;
        if (!(key in keyedBefore)) out.push({ path: next, after: keyedAfter[key] });
        else if (!(key in keyedAfter)) out.push({ path: next, before: keyedBefore[key] });
        else diff(keyedBefore[key], keyedAfter[key], next, out, depth - 1);
      }
      return;
    }
  }
  if (isObject(before) && isObject(after) && Array.isArray(before) === Array.isArray(after)) {
    for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
      const next = Array.isArray(after) ? `${at}[${key}]` : `${at}.${key}`;
      if (!(key in before)) out.push({ path: next, after: after[key] });
      else if (!(key in after)) out.push({ path: next, before: before[key] });
      else diff(before[key], after[key], next, out, depth - 1);
    }
    return;
  }
  if (JSON.stringify(before) !== JSON.stringify(after)) out.push({ path: at, before, after });
};

// Timestamps (Date.now() ids, Date strings) differ on every run. Replace each distinct one with a
// numbered placeholder in order of appearance, so "the same id in two places" is still checked
const normalizeTimes = (trees: Json[]) => {
  const tokens = new Map<string, string>();
  const token = (raw: string) => {
    if (!tokens.has(raw)) tokens.set(raw, `<time:${tokens.size}>`);
    return tokens.get(raw);
  };
  const walk = (value: Json): Json => {
    if (typeof value === 'number' && value > 1e12 && value < 1e13) return token(String(value));
    if (typeof value === 'string') {
      return value
        .replace(/\b1\d{12}\b/g, token)
        .replace(/\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT[+-]\d{4}( \([^)]*\))?/g, token);
    }
    if (Array.isArray(value)) return value.map(walk);
    if (isObject(value))
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, walk(v)]));
    return value;
  };
  return trees.map(walk);
};

// Large values (a copied encounter list, an imported game) are kept as a hash and size: any
// change still alters the golden, and the file stays small enough to review
const compact = (value: Json | undefined) => {
  if (value === undefined) return undefined;
  const text = JSON.stringify(value);
  if (text.length <= 300) return value;
  return {
    sha256: createHash('sha256').update(text).digest('hex').slice(0, 16),
    size: text.length,
  };
};

// What the journey changed, relative to the seed it started from. `depth` stops the comparison at
// that many levels below the root (e.g. 2 = per store key, for journeys that replace whole keys)
export const storeChanges = async (page: Page, seed: string, depth = Infinity) => {
  const [before, after] = normalizeTimes([JSON.parse(seedJson(seed)), await readStore(page)]);
  const changes: Change[] = [];
  diff(before, after, '$', changes, depth);
  const compacted = changes.map(({ path: at, before: b, after: a }) => ({
    path: at,
    before: compact(b),
    after: compact(a),
  }));
  return `${JSON.stringify(compacted, null, 2)}
`;
};
