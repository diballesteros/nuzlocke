// Generates src/constants/exclusives.ts: which Pokémon in a combined game's encounter tables
// (Red/Blue/Yellow, Ruby/Sapphire/Emerald, Diamond/Pearl/Platinum) appear only in some versions.
//
// Source: PokéAPI's encounter CSVs (one row per version, location area and slot), at the commit in
// POKEAPI_COMMIT. Download them first, then run:
//
//   node scripts/version-exclusives.mjs <dir with the CSVs>          (writes the file)
//   node scripts/version-exclusives.mjs <dir with the CSVs> --report (also lists what PokéAPI has
//                                                                     that the tables lack)
//
// The CSVs: encounters, encounter_slots, encounter_methods, pokemon, pokemon_species,
// location_areas and location_names, from
// https://raw.githubusercontent.com/PokeAPI/pokeapi/<POKEAPI_COMMIT>/data/v2/csv/<name>.csv
//
// A Pokémon is tagged when PokéAPI lists it at the location (any method, time or condition) in some
// but not all of the game's versions. One that PokéAPI doesn't list there (gifts, static encounters,
// fossils) stays untagged, which means every version, unless HAND says otherwise. In-game trades
// are left out: the app's tables don't list them.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const POKEAPI_COMMIT = '5cbeb3f3eb55a9b86da52c4869336f9d61fdd6d7';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const OUT = join(ROOT, 'src/constants/exclusives.ts');

// Game key → its location file, filter prefix and PokéAPI version ids → our version names
export const GAMES = {
  '1': { file: 'R_B_Y', versions: { 1: 'red', 2: 'blue', 3: 'yellow' } },
  '3': { file: 'R_S_E', versions: { 7: 'ruby', 8: 'sapphire', 9: 'emerald' } },
  '5': { file: 'D_P_PLAT', versions: { 12: 'diamond', 13: 'pearl', 14: 'platinum' } },
  '2': { file: 'G_S_C', versions: { 4: 'gold', 5: 'silver', 6: 'crystal' } },
  '4': { file: 'FR_LG', versions: { 10: 'firered', 11: 'leafgreen' } },
  '6': { file: 'HG_SS', versions: { 15: 'heartgold', 16: 'soulsilver' } },
  '7': { file: 'B_W', versions: { 17: 'black', 18: 'white' } },
  '8': { file: 'B_W_2', versions: { 21: 'black2', 22: 'white2' } },
  '9': { file: 'X_Y', versions: { 23: 'x', 24: 'y' } },
  '10': { file: 'OR_AS', versions: { 25: 'omegaruby', 26: 'alphasapphire' } },
  '11': { file: 'S_M', versions: { 27: 'sun', 28: 'moon' } },
  '12': { file: 'US_UM', versions: { 29: 'ultrasun', 30: 'ultramoon' } },
  '13': { file: 'SW_SH', versions: { 33: 'sword', 34: 'shield' } },
  // Brilliant Diamond and Shining Pearl: PokéAPI has no encounters for them yet
};

// Our location name → PokéAPI's English location name, per game, where they differ beyond what
// locationKey evens out (some are our misspellings). Kanto's Routes 19 to 21 and Johto's 40 and
// 41 are sea routes there
const KANTO = {
  'Fuschia City': 'Fuchsia City',
  'Power Plant': 'Kanto Power Plant',
  'Route 19': 'Sea Route 19',
  'Route 20': 'Sea Route 20',
  'Route 21': 'Sea Route 21',
  'Vermillion City': 'Vermilion City',
};
const JOHTO = {
  'Rocket HQ': 'Team Rocket HQ',
  'Route 40': 'Sea Route 40',
  'Route 41': 'Sea Route 41',
  'Tin Tower': 'Bell Tower',
};
export const ALIASES = {
  '1': KANTO,
  '2': { ...KANTO, ...JOHTO },
  '4': KANTO,
  '5': {
    'Route 220': 'Sea Route 220',
    'Route 223': 'Sea Route 223',
    'The Great Marsh': 'Great Marsh',
  },
  '6': {
    ...KANTO,
    ...JOHTO,
    'Rocket Hideout': 'Team Rocket HQ',
    'Safari Zone': 'Johto Safari Zone',
  },
};

// One spelling for both sides: no accents or apostrophes (straight or curly), "Mount" for "Mt.",
// and no "Wild Area:" before Sword and Shield's Wild Area parts
export const locationKey = (name) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['\u2019]/g, '')
    .replace(/^wild ?area: /, '')
    .replace(/\bmt\. /, 'mount ')
    .trim();

// Bulbapedia is the source of truth where it and PokéAPI disagree: these are its answers for every
// table entry where they differed, from scripts/bulbapedia-check.browser.js (run in a Bulbapedia tab;
// Bulbapedia refuses requests from scripts). Entries Bulbapedia's pages don't place (gifts, our
// own place names) keep PokéAPI's answer.
export const BULBAPEDIA = JSON.parse(
  readFileSync(join(ROOT, 'scripts/bulbapedia-overrides.json'), 'utf8')
).overrides;

// Tags PokéAPI can't give (starters and gifts aren't in its encounter tables), checked by hand
// against Bulbapedia. They replace whatever the CSVs say for that Pokémon at that location.
export const HAND = {
  // Red and Blue's starters; Yellow's only starter is Pikachu
  'rby-0': {
    Bulbasaur: ['red', 'blue'],
    Charmander: ['red', 'blue'],
    Squirtle: ['red', 'blue'],
    Pikachu: ['yellow'],
  },
};

// Our regional forms, "Vulpix (Alolan)", and PokéAPI's suffixes for them
const FORMS = { alolan: 'alola', galarian: 'galar' };

// PokéAPI's identifier for one of our Pokémon names: the species for its usual form
// ("wormadam", not "wormadam-plant"), the form's own for a regional form ("vulpix-alola")
export const speciesId = (name) => {
  const [, base, form] = name.match(/^(.*?)\s*(?:\((\w+)\))?$/);
  const id = speciesBase(base);
  return form && FORMS[form.toLowerCase()] ? `${id}-${FORMS[form.toLowerCase()]}` : id;
};

const speciesBase = (name) =>
  name
    .toLowerCase()
    .replace('♀', '-f')
    .replace('♂', '-m')
    .replace(/é/g, 'e')
    .replace(/[.']/g, '')
    .trim()
    .replace(/\s+/g, '-');

function readCsv(file) {
  const [head, ...rows] = readFileSync(file, 'utf8').trim().split('\n');
  const keys = head.split(',');
  return rows.map((row) => {
    // No field these scripts read contains a comma; names are matched by id, not text
    const values = row.split(',');
    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  });
}

// { [location name]: { [species identifier]: Set<version> } } for one game's versions
export function pokeapiTables(dir, versions) {
  const species = new Map(
    readCsv(join(dir, 'pokemon_species.csv')).map((r) => [r.id, r.identifier])
  );
  const pokemon = new Map(
    // Each encounter's Pokémon by speciesId's key: a regional form by its own id, every other form
    // by its species (the app has one Basculin, one Indeedee)
    readCsv(join(dir, 'pokemon.csv')).map((r) => [
      r.id,
      /-(alola|galar)$/.test(r.identifier) ? r.identifier : species.get(r.species_id),
    ])
  );
  const names = new Map(
    readCsv(join(dir, 'location_names.csv'))
      .filter((r) => r.local_language_id === '9')
      .map((r) => [r.location_id, r.name])
  );
  const areas = new Map(
    readCsv(join(dir, 'location_areas.csv')).map((r) => [r.id, names.get(r.location_id)])
  );
  const methods = new Map(
    readCsv(join(dir, 'encounter_methods.csv')).map((r) => [r.id, r.identifier])
  );
  const slots = new Map(
    readCsv(join(dir, 'encounter_slots.csv')).map((r) => [r.id, methods.get(r.encounter_method_id)])
  );
  const tables = {};
  readCsv(join(dir, 'encounters.csv')).forEach((r) => {
    const version = versions[r.version_id];
    if (!version || slots.get(r.encounter_slot_id) === 'npc-trade') return;
    const location = locationKey(areas.get(r.location_area_id) ?? '');
    const id = pokemon.get(r.pokemon_id);
    tables[location] ??= {};
    tables[location][id] ??= new Set();
    tables[location][id].add(version);
  });
  return tables;
}

// { [filterKey]: { [pokemon]: versions[] } } for one game, plus what PokéAPI has that we lack
export function exclusives(encounters, filters, tables, all, aliases = {}) {
  const tags = {};
  const missing = [];
  encounters.forEach(({ location, filterKey }) => {
    const table = tables[locationKey(aliases[location] ?? location)];
    const names = filters[filterKey] ?? [];
    names.forEach((name) => {
      const found = BULBAPEDIA[filterKey]?.[name] ??
        HAND[filterKey]?.[name] ?? [...(table?.[speciesId(name)] ?? [])];
      const versions = all.filter((version) => found.includes(version));
      if (versions.length > 0 && versions.length < all.length) {
        tags[filterKey] ??= {};
        tags[filterKey][name] = versions;
      }
    });
    if (!table) return;
    const ours = new Set(names.map(speciesId));
    Object.entries(table).forEach(([id, versions]) => {
      if (!ours.has(id)) missing.push({ filterKey, location, id, versions: [...versions] });
    });
  });
  return { tags, missing };
}

async function main() {
  const [dir, flag] = process.argv.slice(2);
  if (!dir) {
    console.error('Usage: node scripts/version-exclusives.mjs <dir with the CSVs> [--report]');
    process.exit(1);
  }
  const { default: FILTERS } = await import(join(ROOT, 'src/constants/filters.ts'));
  const result = {};
  for (const [game, { file, versions }] of Object.entries(GAMES)) {
    const { default: encounters } = await import(join(ROOT, `src/constants/locations/${file}.ts`));
    const all = Object.values(versions);
    const { tags, missing } = exclusives(
      encounters,
      FILTERS,
      pokeapiTables(resolve(dir), versions),
      all,
      ALIASES[game]
    );
    Object.assign(result, tags);
    if (flag === '--report') {
      missing
        .filter(({ versions: found }) => found.length < all.length)
        .forEach((m) =>
          console.info(`${game} ${m.filterKey} ${m.location}: ${m.id} (${m.versions})`)
        );
    }
  }
  const body = `// Generated by scripts/version-exclusives.mjs from PokéAPI (${POKEAPI_COMMIT.slice(0, 7)}); don't edit by hand.
// The Pokémon in an encounter table that appear only in the listed versions. Any other Pokémon in
// the table appears in every version of its game.
import type { TExclusives } from 'constants/versions';

const EXCLUSIVES: TExclusives = ${JSON.stringify(result)};

export default EXCLUSIVES;
`;
  writeFileSync(OUT, body);
  execFileSync('npx', ['prettier', '--write', OUT], { cwd: ROOT, stdio: 'inherit' });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
