// Checks every table entry of the games with versions against Bulbapedia, which is the source of
// truth where it and PokéAPI disagree. Bulbapedia refuses requests from scripts, so this runs in a
// browser tab on https://bulbapedia.bulbagarden.net (the DevTools console, or Claude in Chrome's
// JavaScript tool): it reads the app's tables from GitHub at REF, fetches each Pokémon's raw page
// (about 720, three at a time), and compares the versions whose Availability lines place the
// Pokémon at the location with the tags in exclusives.ts. It ends with `bulbapediaCheck.overrides`,
// the JSON for scripts/bulbapedia-overrides.json: every entry where Bulbapedia gives an answer that
// differs. Review the rows before committing them (`bulbapediaCheck.rows`); an entry Bulbapedia
// doesn't place keeps PokéAPI's answer.
//
// Matching: route templates become "Route N", "Routes 3, 4 and 46" each route, time-of-day marks
// are dropped; segments (split on <br>) that start with Trade, Evolve, Event, Breed or a gift are
// skipped; a regional form ("Vulpix (Alolan)") only matches segments marked with that form, and a
// plain name only unmarked ones. Japanese-only and Expansion Pass lines are ignored.
/* global fetch, setTimeout, console */
/* eslint-disable no-console */

const REF = 'master'; // a branch or commit with the tables to check
const RAW = `https://raw.githubusercontent.com/diballesteros/nuzlocke/${REF}/src/constants/`;
const GAMES = {
  1: ['R_B_Y', ['Red', 'Blue', 'Yellow']],
  2: ['G_S_C', ['Gold', 'Silver', 'Crystal']],
  3: ['R_S_E', ['Ruby', 'Sapphire', 'Emerald']],
  4: ['FR_LG', ['FireRed', 'LeafGreen']],
  5: ['D_P_PLAT', ['Diamond', 'Pearl', 'Platinum']],
  6: ['HG_SS', ['HeartGold', 'SoulSilver']],
  7: ['B_W', ['Black', 'White']],
  8: ['B_W_2', ['Black 2', 'White 2']],
  9: ['X_Y', ['X', 'Y']],
  10: ['OR_AS', ['Omega Ruby', 'Alpha Sapphire']],
  11: ['S_M', ['Sun', 'Moon']],
  12: ['US_UM', ['Ultra Sun', 'Ultra Moon']],
  13: ['SW_SH', ['Sword', 'Shield']],
};
// Our names Bulbapedia spells differently (page titles and places)
const PAGES = { 'Ho-oh': 'Ho-Oh' };
const PLACES = {
  'vermillion city': 'vermilion city',
  'fuschia city': 'fuchsia city',
  'the great marsh': 'great marsh',
  'thrify megamart': 'thrifty megamart',
};

const norm = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '');
const idOf = (version) => norm(version).replace(/ /g, '');
const strings = (body) =>
  [...body.matchAll(/'((?:[^'\\]|\\.)*)'|"([^"]*)"/g)].map((m) =>
    (m[1] ?? m[2]).replace(/\\'/g, "'")
  );

const expand = (area) => {
  let s = area
    .replace(/\{\{sup\/[^{}]*\}\}/gi, ' ')
    .replace(/\{\{rtn?\|(\d+)\|[^}]*\}\}/gi, ' Route $1 ')
    .replace(/\{\{safari\|[^}]*\}\}/gi, ' Safari Zone ')
    .replace(/\[\[([^\]|]*)\|([^\]]*)\]\]/g, ' $2 ')
    .replace(/\[\[([^\]]*)\]\]/g, ' $1 ');
  for (let i = 0; i < 6; i++)
    s = s.replace(/\{\{([^{}]*)\}\}/g, (m, inner) => ` ${inner.split('|').pop()} `);
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(
      /Routes?((?:\s*(?:,|and|&)?\s*\d+\b)+)/g,
      (m, nums) =>
        ` ${nums
          .match(/\d+/g)
          .map((n) => `Route ${n}`)
          .join(', ')} `
    )
    .replace(/\s+/g, ' ');
};

const parse = (lines) =>
  lines
    .map((line) => {
      const i = line.indexOf('|area=');
      if (i < 0) return null;
      const head = line.slice(0, i);
      if (/ex=|Japanese|Expansion/.test(head)) return null;
      const versions = [...head.matchAll(/\|v\d?=([^|]+)/g)].map((m) => m[1].trim());
      const segments = line
        .slice(i + 6)
        .replace(/\}\}\s*$/, '')
        .split(/<br\s*\/?>/i)
        .filter(
          (seg) => !/^\s*(\[\[|\{\{p\|)?\s*(Trade|Evolve|Event|Breed|Receive|Gift)/i.test(seg)
        )
        .map((seg) => ({
          form: /Alolan Form/i.test(seg) ? 'Alolan' : /Galarian Form/i.test(seg) ? 'Galarian' : '',
          text: norm(expand(seg)),
        }));
      return { versions, segments };
    })
    .filter(Boolean);

const placeKey = (location) => {
  const key = norm(location)
    .replace(/^wild ?area: /, '')
    .replace(/\s*\(.*\)\s*$/, '')
    .trim();
  return PLACES[key] ?? key;
};

async function bulbapediaCheck() {
  const tables = {};
  const filters = await (await fetch(`${RAW}filters.ts`)).text();
  for (const m of filters.matchAll(/'([a-z0-9]+-\d+)': \[([\s\S]*?)\]/g))
    tables[m[1]] = strings(m[2]);
  const tags = {};
  const exclusives = await (await fetch(`${RAW}exclusives.ts`)).text();
  for (const m of exclusives.matchAll(/'([a-z0-9]+-\d+)': \{([\s\S]*?)\n?\s*\},?\n/g)) {
    tags[m[1]] = {};
    for (const t of m[2].matchAll(/(?:'((?:[^'\\]|\\.)*)'|"([^"]*)"): \[([^\]]*)\]/g)) {
      tags[m[1]][(t[1] ?? t[2]).replace(/\\'/g, "'")] = strings(t[3]);
    }
  }
  const entries = [];
  for (const [file, versions] of Object.values(GAMES)) {
    const source = await (await fetch(`${RAW}locations/${file}.ts`)).text();
    for (const m of source.matchAll(
      /location: (?:'((?:[^'\\]|\\.)*)'|"([^"]*)"),[\s\S]*?filterKey: '([^']+)'/g
    )) {
      const location = (m[1] ?? m[2]).replace(/\\'/g, "'");
      for (const name of tables[m[3]] ?? []) {
        entries.push({ key: m[3], location, name, versions, tag: tags[m[3]]?.[name] });
      }
    }
  }

  const pages = {};
  const queue = [...new Set(entries.map((e) => e.name.replace(/\s*\((Alolan|Galarian)\)$/, '')))];
  const missing = [];
  const worker = async () => {
    while (queue.length) {
      const name = queue.shift();
      const title = `${PAGES[name] ?? name} (Pokémon)`;
      const text = await (
        await fetch(`/w/index.php?title=${encodeURIComponent(title)}&action=raw`)
      ).text();
      pages[name] = parse(text.split('\n').filter((l) => /\{\{Availability\/Entry/.test(l)));
      if (!pages[name].length) missing.push(name);
      await new Promise((r) => setTimeout(r, 150));
    }
  };
  await Promise.all([worker(), worker(), worker()]);

  const rows = [];
  const overrides = {};
  let same = 0;
  let unplaced = 0;
  for (const e of entries) {
    const [, base, form] = e.name.match(/^(.*?)\s*(?:\((Alolan|Galarian)\))?$/);
    const place = new RegExp(
      `(^|[^a-z0-9])${placeKey(e.location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`
    );
    const found = new Set();
    for (const { versions, segments } of pages[base] ?? []) {
      for (const v of versions) {
        const here = segments.some((s) => (form ? s.form === form : !s.form) && place.test(s.text));
        if (e.versions.includes(v) && here) found.add(v);
      }
    }
    const bulbapedia = e.versions.filter((v) => found.has(v)).map(idOf);
    const current = e.tag ?? e.versions.map(idOf);
    if (!bulbapedia.length) unplaced++;
    else if (bulbapedia.join() === current.join()) same++;
    else {
      rows.push(`${e.key} ${e.name}: Bulbapedia ${bulbapedia}, tags ${current}`);
      (overrides[e.key] ??= {})[e.name] = bulbapedia;
    }
  }
  const result = { same, unplaced, differ: rows.length, missing, rows, overrides };
  globalThis.bulbapediaCheck = result;
  console.log(`${same} agree, ${unplaced} not placed by Bulbapedia, ${rows.length} differ`);
  return result;
}

bulbapediaCheck();
