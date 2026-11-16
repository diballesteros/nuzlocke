// Works out which Pokémon in each paired game's encounter tables appear only in some versions,
// from Bulbapedia alone. Bulbapedia refuses requests from scripts, so this runs in a browser tab on
// https://bulbapedia.bulbagarden.net (the DevTools console, or Claude in Chrome's JavaScript tool).
// It reads the app's tables from GitHub at REF, fetches every Pokémon's raw page (about 900, three
// at a time) and reads its {{Availability/Entry…|v=<Version>|area=…}} lines.
//
// It ends with `globalThis.versionExclusives`, which scripts/version-exclusives.mjs turns into
// src/constants/exclusives.ts:
// - tags: { [filterKey]: { [pokemon]: versions[] } }, the table entries Bulbapedia places at their
//   location in some but not all of the game's versions. Every other entry stays untagged, so it
//   shows in every version.
// - unplaced: [filterKey, pokemon], table entries Bulbapedia doesn't place at their location in
//   any version (they stay untagged: questions for whoever owns the tables);
// - missing: [filterKey, pokemon, versions[]], Pokémon Bulbapedia places at a location whose table
//   lacks them (left out of the tables: also questions).
//
// Matching: Max Raid Den links are dropped; route templates become "Route N", "Routes 3, 4 and
// 46" each route; {{OBP|place|…}}, {{gdis|place|…}} and {{tt|text|…}} their first parameter, other
// templates their last; time-of-day marks are dropped. Each area is split on <br>, and segments
// that start with Trade, Evolve, Event or Breed are skipped (gifts count, as the tables list them).
// A location matches by its name or by the part in brackets ("Route 1 (Trainer's School)"),
// without accents or apostrophes, or by the names in PLACES ("Mt." is also "Mount"; "Starter" is
// Bulbapedia's "First Pokémon"). A regional form ("Vulpix (Alolan)") only matches segments marked
// with that form, and a plain name only unmarked ones. Japanese-only and Expansion Pass lines are
// ignored.
/* global fetch, setTimeout, console */
/* eslint-disable no-console */

const REF = 'master'; // a branch or commit with the tables to read
const RAW = `https://raw.githubusercontent.com/diballesteros/nuzlocke/${REF}/src/constants/`;
// Game key → its location file and Bulbapedia's version names
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
  13.1: ['BD_SP', ['Brilliant Diamond', 'Shining Pearl']],
};
// Our names that Bulbapedia spells differently (page titles, and each place's names there)
const PAGES = { 'Ho-oh': 'Ho-Oh' };
const PLACES = {
  'vermillion city': ['vermilion city'],
  'fuschia city': ['fuchsia city'],
  'the great marsh': ['great marsh'],
  'thrify megamart': ['thrifty megamart'],
  'team magma hideout': ['magma hideout'],
  'team magma/aqua hideout': ['team magma hideout', 'team aqua hideout'],
  'altar of the sunne/moone': ['altar of the sunne', 'altar of the moone'],
  'tin tower': ['tin tower', 'bell tower'],
  'rocket hideout': ['rocket hideout', 'team rocket hq'],
  'abandoned ship': ['abandoned ship', 'sea mauville'],
  // Our starters' location: Bulbapedia calls them the player's first Pokémon
  starter: ['first pokemon', 'first partner pokemon'],
};
const FORM = /\s*\((Alolan|Galarian)\)$/;

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
    .replace(/\{\{(?:OBP|gdis|tt)\|([^{}|]*)\|[^{}]*\}\}/gi, ' $1 ')
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

// [{ versions, segments: [{ form, text }] }] for a page's Availability lines
const parse = (page) =>
  page
    .split('\n')
    .filter((line) => /\{\{Availability\/Entry/.test(line))
    .map((line) => {
      const i = line.indexOf('|area=');
      if (i < 0) return null;
      const head = line.slice(0, i);
      if (/ex=|Japanese|Expansion/.test(head)) return null;
      const versions = [...head.matchAll(/\|v\d?=([^|]+)/g)].map((m) => m[1].trim());
      const segments = line
        .slice(i + 6)
        // Max Raid Dens, which the tables leave out
        .replace(/\[\[[^\]|]*\/Dens\|[^\]]*\]\]/g, ' ')
        .replace(/\}\}\s*$/, '')
        .split(/<br\s*\/?>/i)
        .filter((seg) => !/^\s*(\[\[|\{\{p\|)?\s*(Trade|Evolve|Event|Breed)/i.test(seg))
        .map((seg) => ({
          form: /Alolan Form/i.test(seg) ? 'Alolan' : /Galarian Form/i.test(seg) ? 'Galarian' : '',
          text: norm(expand(seg)),
        }));
      return { versions, segments };
    })
    .filter(Boolean);

// The regular expressions a location's name matches in a segment
const placesOf = (location) => {
  const name = norm(location).replace(/^wild ?area: /, '');
  const inner = name.match(/\(([^)]*)\)\s*$/)?.[1];
  const base = name.replace(/\s*\(.*\)\s*$/, '').trim();
  return [base, inner]
    .filter(Boolean)
    .flatMap(
      (key) => PLACES[key] ?? (key.startsWith('mt. ') ? [key, `mount ${key.slice(4)}`] : [key])
    )
    .map(
      (key) => new RegExp(`(^|[^a-z0-9])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`)
    );
};

// The versions (Bulbapedia's names) whose lines place a Pokémon (with its form) at a location
const versionsAt = (lines, form, places, versions) => {
  const found = new Set();
  for (const line of lines) {
    for (const version of line.versions) {
      if (!versions.includes(version) || found.has(version)) continue;
      const here = line.segments.some(
        (s) => (form ? s.form === form : !s.form) && places.some((place) => place.test(s.text))
      );
      if (here) found.add(version);
    }
  }
  return versions.filter((version) => found.has(version));
};

async function versionExclusives() {
  const tables = {};
  const filters = await (await fetch(`${RAW}filters.ts`)).text();
  for (const m of filters.matchAll(/'([a-z0-9]+-\d+)': \[([\s\S]*?)\]/g))
    tables[m[1]] = strings(m[2]);
  const species = await (await fetch(`${RAW}pokemon.ts`)).text();
  const names = [
    ...new Set(
      [...species.matchAll(/text: (?:'((?:[^'\\]|\\.)*)'|"([^"]*)")/g)].map((m) =>
        (m[1] ?? m[2]).replace(/\\'/g, "'")
      )
    ),
  ];

  const locations = [];
  for (const [game, [file, versions]] of Object.entries(GAMES)) {
    const source = await (await fetch(`${RAW}locations/${file}.ts`)).text();
    for (const m of source.matchAll(
      /location: (?:'((?:[^'\\]|\\.)*)'|"([^"]*)"),[\s\S]*?filterKey: '([^']+)'/g
    )) {
      const location = (m[1] ?? m[2]).replace(/\\'/g, "'");
      locations.push({ game, key: m[3], places: placesOf(location), versions });
    }
  }

  const pages = {};
  const queue = [...new Set(names.map((name) => name.replace(FORM, '')))];
  const worker = async () => {
    while (queue.length) {
      const name = queue.shift();
      const title = `${PAGES[name] ?? name} (Pokémon)`;
      const response = await fetch(`/w/index.php?title=${encodeURIComponent(title)}&action=raw`);
      pages[name] = response.ok ? parse(await response.text()) : [];
      await new Promise((r) => setTimeout(r, 150));
    }
  };
  await Promise.all([worker(), worker(), worker()]);

  const tags = {};
  const unplaced = [];
  const missing = [];
  // Each Pokémon's lines for one game's versions, worked out once per game
  const byGame = {};
  const linesOf = (game, versions, base) =>
    ((byGame[game] ??= {})[base] ??= (pages[base] ?? []).filter((line) =>
      line.versions.some((version) => versions.includes(version))
    ));
  for (const { game, key, places, versions } of locations) {
    const table = tables[key] ?? [];
    for (const name of names) {
      const form = name.match(FORM)?.[1] ?? '';
      const lines = linesOf(game, versions, name.replace(FORM, ''));
      const listed = table.includes(name);
      if (!lines.length && !listed) continue;
      const found = versionsAt(lines, form, places, versions);
      if (listed) {
        if (!found.length) unplaced.push([key, name]);
        else if (found.length < versions.length) (tags[key] ??= {})[name] = found.map(idOf);
      } else if (found.length) {
        missing.push([key, name, found.map(idOf)]);
      }
    }
  }
  const unknown = Object.entries(tables).flatMap(([key, table]) =>
    table.filter((name) => !names.includes(name)).map((name) => [key, name])
  );
  const result = { ref: REF, tags, unplaced, missing, unknown };
  globalThis.versionExclusives = result;
  console.log(
    `${Object.values(tags).reduce((n, t) => n + Object.keys(t).length, 0)} tags, ` +
      `${unplaced.length} unplaced, ${missing.length} missing, ${unknown.length} unknown names`
  );
  return result;
}

versionExclusives();
