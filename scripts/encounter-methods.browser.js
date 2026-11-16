// Works out how each Pokémon in the encounter tables is met at its location when it isn't a
// plain wild encounter (a gift, a trade, a headbutt tree, a swarm...), from Bulbapedia alone.
// Bulbapedia refuses requests from scripts, so this runs in a browser tab on
// https://bulbapedia.bulbagarden.net (the DevTools console, or Claude in Chrome's JavaScript tool).
// It reads the app's tables from GitHub at REF, finds each location's page (about 800, three at a
// time) and reads its {{catch/entry…}} rows for the location's game.
//
// It ends with `globalThis.encounterMethods`, which scripts/encounter-methods.mjs turns into
// src/constants/methods.ts:
// - tags: { [filterKey]: { [pokemon]: methods[] } }, the table entries that, in some version, are
//   met at their location only in one of METHODS' ways. An entry met in the wild there in every
//   version it appears in (grass, caves, surfing, fishing, flying, and so on) stays untagged.
// - pages: { [filterKey]: page title or null }, the page each location was read from;
// - notOnPage: [filterKey, pokemon], table entries their page doesn't list (they stay untagged);
// - noPage: [filterKey, pokemon], entries of locations with no page found (also untagged).
//
// Pages: "Route N" is "<Region> Route N" (Kanto up to 28 and Johto from 29 in the Johto games);
// any other place is tried as itself, "<Place> (<Region>)" and "<Region> <Place>", following
// redirects, and the first page with catch rows wins. FIX holds the names Bulbapedia spells
// otherwise. "Starter" locations are skipped. Each game's rows use their own templates (GAMES), whose
// version columns say which versions a row is for. A row's method is its first column after them;
// the `catch/div` heading above it adds headbutt trees, swarms, hordes, phenomena and the like.
// Honey trees (Diamond/Pearl/Platinum, Brilliant Diamond/Shining Pearl) come from the Honey Tree
// page, Game Corner prizes from each city's "<City> Game Corner" page.
/* global fetch, setTimeout, console */
/* eslint-disable no-console */

const REF = 'master'; // a branch or commit with the tables to read
const RAW = `https://raw.githubusercontent.com/diballesteros/nuzlocke/${REF}/src/constants/`;
// Game key → its location file, its region, its catch template(s) and how many versions it has
const GAMES = {
  1: ['R_B_Y', 'Kanto', ['entry1'], 3],
  2: ['G_S_C', 'Johto', ['entry2'], 3],
  3: ['R_S_E', 'Hoenn', ['entry3', 'entry3a'], 3],
  4: ['FR_LG', 'Kanto', ['entryfl', 'entry3a'], 2],
  5: ['D_P_PLAT', 'Sinnoh', ['entry4'], 3],
  6: ['HG_SS', 'Johto', ['entryhs'], 2],
  7: ['B_W', 'Unova', ['entry5'], 2],
  8: ['B_W_2', 'Unova', ['entry5-2'], 2],
  9: ['X_Y', 'Kalos', ['entry6'], 2],
  10: ['OR_AS', 'Hoenn', ['entryoras'], 2],
  11: ['S_M', 'Alola', ['entry7'], 2],
  12: ['US_UM', 'Alola', ['entryusum'], 2],
  13: ['SW_SH', 'Galar', ['entry8'], 2],
  13.1: ['BD_SP', 'Sinnoh', ['entrybdsp'], 2],
};
const FIX = {
  'Vermillion City': 'Vermilion City',
  'Fuschia City': 'Fuchsia City',
  'The Great Marsh': 'Great Marsh',
  'Thrify Megamart': 'Thrifty Megamart',
  'Diglett': "Diglett's Cave",
  'Digletts Tunnel': "Diglett's Tunnel",
  'Dragon': "Dragon's Den",
  'Rocket HQ': 'Team Rocket HQ',
  'Tin Tower': 'Bell Tower',
  'Team Magma/Aqua Hideout': 'Team Magma Hideout',
  'Altar of the Sunne/Moone': 'Altar of the Sunne',
  'Soaring in the Sky': 'Soaring',
  'Pokemon League': 'Pokémon League',
  'Pokemon Tower': 'Pokémon Tower',
  'Pokemon Mansion': 'Pokémon Mansion',
  'Pokemon Village': 'Pokémon Village',
};
const HONEY = [
  'Wurmple',
  'Silcoon',
  'Cascoon',
  'Burmy',
  'Combee',
  'Cherubi',
  'Aipom',
  'Heracross',
  'Munchlax',
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const cache = {};
async function page(title) {
  if (title in cache) return cache[title];
  const response = await fetch(
    `/w/api.php?action=parse&format=json&prop=wikitext&redirects=1&page=${encodeURIComponent(title)}`
  );
  const json = await response.json();
  cache[title] = json.parse ? { title: json.parse.title, text: json.parse.wikitext['*'] } : null;
  await wait(120);
  return cache[title];
}

const strings = (body) =>
  [...body.matchAll(/'((?:[^'\\]|\\.)*)'|"([^"]*)"/g)].map((m) =>
    (m[1] ?? m[2]).replace(/\\'/g, "'")
  );
const clean = (s) =>
  s
    .replace(/\{\{color2\|[^|]*\|([^|}]*)(\|([^}]*))?\}\}/gi, (m, a, b, c) => c || a)
    .replace(/\[\[([^\]|]*\|)?([^\]]*)\]\]/g, '$2')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{\{[^}|]*\|([^}]*)\}\}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

// The pages to try for a location, in order
function candidates({ game, region, name }) {
  const place = name.replace(/^Wild ?Area: /, '').trim();
  const inner = place.match(/\(([^)]*)\)\s*$/)?.[1];
  const base = place.replace(/\s*\(.*\)\s*$/, '').trim();
  return [base, inner].filter(Boolean).flatMap((raw) => {
    const x = FIX[raw] ?? raw;
    const route = x.match(/^Route (\d+)$/);
    if (!route) return [x, `${x} (${region})`, `${region} ${x}`];
    const n = Number(route[1]);
    const johto = ['2', '6'].includes(game);
    return [`${johto ? (n <= 28 ? 'Kanto' : 'Johto') : region} Route ${n}`];
  });
}

// A location page's catch rows for one game: name, version flags, method, rate, heading
function rows(text, templates) {
  const out = [];
  let div = '';
  for (const line of text.split('\n')) {
    if (/\{\{catch\/header/i.test(line)) div = '';
    const heading = line.match(/\{\{catch\/div\|[^|]*\|(.*)\}\}\s*$/i);
    if (heading) div = clean(heading[1]);
    const row = line.match(/\{\{catch\/(entry[\w-]*)\|(.*)\}\}\s*$/i);
    if (!row || !templates.includes(row[1].toLowerCase())) continue;
    const fields = row[2].split('|');
    const form = row[2].match(/form\s*=\s*(Alolan|Galarian)/i)?.[1];
    const name = form
      ? `${fields[1]} (${form[0].toUpperCase()}${form.slice(1).toLowerCase()})`
      : fields[1];
    const rest = fields.slice(2);
    const flags = [];
    let i = 0;
    while (i < rest.length && /^(yes|no|n\/a)$/i.test(rest[i].trim())) {
      flags.push(/yes/i.test(rest[i]));
      i += 1;
    }
    const rate = (rest[i + 2] ?? '').replace(/^\w+\s*=/, '').trim();
    out.push({ name, flags, method: clean(rest[i] ?? ''), rate, div });
  }
  return out;
}

// A row's method: one of METHODS, or 'wild'
function classify({ method, div, rate }) {
  const m = method.toLowerCase();
  const both = `${m} ${div.toLowerCase()}`;
  if (/trade/.test(m)) return 'trade';
  if (
    /gift|^egg$|fossil|^(helix|dome|root|claw|skull|armor|old amber|plume|cover|jaw|sail)$/.test(
      m
    ) ||
    /gift|first partner/.test(div.toLowerCase())
  )
    return 'gift';
  if (/^(r|s|e|fr|lg|frlge|ruby|sapphire|emerald|firered|leafgreen)$/.test(m)) return 'dualslot';
  if (/^(hoenn|sinnoh)$/.test(m)) return 'radio';
  if (/radar/.test(both)) return 'radar';
  if (/swarm|mass outbreak/.test(both)) return 'swarm';
  if (/headbutt/.test(both)) return 'headbutt';
  if (/rock smash/.test(both)) return 'rocksmash';
  if (/horde/.test(both)) return 'horde';
  if (/honey/.test(both)) return 'honey';
  if (/allies|\bsos\b/.test(both)) return 'sos';
  if (/rippl|rustl|shaking|dust|dirt cloud|sand cloud|shadow|bubbling/.test(both))
    return 'phenomenon';
  if (/grotto/.test(both)) return 'grotto';
  if (/island scan/.test(both)) return 'islandscan';
  if (/hidden pok/.test(div.toLowerCase())) return 'hidden';
  if (/berry/.test(both)) return 'berry';
  if (/curry/.test(m)) return 'curry';
  if (/^(special|backlot|chase|pichu)$/.test(m) || /\bone\b/i.test(rate)) return 'special';
  return 'wild';
}

async function encounterMethods() {
  const tables = {};
  const filters = await (await fetch(`${RAW}filters.ts`)).text();
  for (const m of filters.matchAll(/'([a-z0-9]+-\d+)': \[([\s\S]*?)\]/g))
    tables[m[1]] = strings(m[2]);

  const locations = [];
  for (const [game, [file, region, templates, versions]] of Object.entries(GAMES)) {
    const source = await (await fetch(`${RAW}locations/${file}.ts`)).text();
    for (const m of source.matchAll(
      /location: (?:'((?:[^'\\]|\\.)*)'|"([^"]*)"),[\s\S]*?filterKey: '([^']+)'/g
    )) {
      const name = (m[1] ?? m[2]).replace(/\\'/g, "'");
      if (name !== 'Starter')
        locations.push({ game, region, templates, versions, name, key: m[3] });
    }
  }

  const pages = {};
  const queue = [...locations];
  const worker = async () => {
    while (queue.length) {
      const location = queue.shift();
      pages[location.key] = null;
      for (const title of candidates(location)) {
        const found = await page(title);
        if (found && /\{\{catch\/entry/i.test(found.text) && !/\{\{disambig/i.test(found.text)) {
          pages[location.key] = found.title;
          location.text = found.text;
          break;
        }
      }
    }
  };
  await Promise.all([worker(), worker(), worker()]);

  const honeyPage = (await page('Honey Tree')).text;
  const start = honeyPage.search(/==\s*Locations/i);
  const honeyPlaces = new Set(
    [
      ...honeyPage.slice(start, honeyPage.indexOf('\n==', start + 12)).matchAll(/\|\|\s*(.*)$/gm),
    ].map((m) =>
      clean(m[1].replace(/\{\{rt\|(\d+)\|(\w+)\}\}/g, '$2 Route $1'))
        .replace(/^(Southern|Northern|Eastern|Western) /, '')
        .replace(/ exterior$/, '')
    )
  );
  const prizes = {};
  for (const { key, name } of locations) {
    const city = name.match(/^(\w+) (City|Town)$/);
    const corner = city && (await page(`${city[1]} Game Corner`));
    if (corner)
      prizes[key] = new Set([...corner.text.matchAll(/\{\{shopmon\|([^|]+)\|/gi)].map((m) => m[1]));
  }

  const tags = {};
  const notOnPage = [];
  const noPage = [];
  const lower = (s) => s.toLowerCase();
  for (const location of locations) {
    const { game, key, name, templates, versions, text } = location;
    const table = tables[key] ?? [];
    if (!text) {
      for (const pokemon of table) noPage.push([key, pokemon]);
      continue;
    }
    const found = rows(text, templates);
    for (const pokemon of table) {
      const own = found.filter((row) => lower(row.name) === lower(pokemon));
      const tag = new Set();
      if (own.length) {
        for (let v = 0; v < versions; v++) {
          const methods = new Set(
            own.filter((row) => row.flags.length < versions || row.flags[v]).map(classify)
          );
          if (methods.size && !methods.has('wild')) methods.forEach((m) => tag.add(m));
        }
      } else if (
        ['5', '13.1'].includes(game) &&
        HONEY.includes(pokemon) &&
        (honeyPlaces.has(pages[key]) || honeyPlaces.has(name))
      ) {
        tag.add('honey');
      } else if (prizes[key]?.has(pokemon)) {
        tag.add('prize');
      } else {
        notOnPage.push([key, pokemon]);
        continue;
      }
      if (tag.size) (tags[key] ??= {})[pokemon] = [...tag].sort();
    }
  }

  const result = { ref: REF, tags, pages, notOnPage, noPage };
  globalThis.encounterMethods = result;
  console.log(
    `${Object.values(tags).reduce((n, t) => n + Object.keys(t).length, 0)} tags, ` +
      `${notOnPage.length} not on their page, ${noPage.length} without a page`
  );
  return result;
}

encounterMethods();
