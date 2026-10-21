import fs from 'node:fs';
import path from 'node:path';
import BADGES, { GAME_CAP_DICTIONARY, LEVEL_CAPS } from 'constants/badges';
import { GAME_KEY_DICTIONARY, GAMES } from 'constants/constant';
import DETAILS from 'constants/details';
import FILTERS from 'constants/filters';
import { MOVEMAP } from 'constants/moves';
import POKEMON, { POKEMAP } from 'constants/pokemon';

const POKEMON_NAMES = new Set(POKEMON.map((poke) => poke.text));
const GAME_KEYS = GAMES.map((game) => game.value);

// Data problems that already exist in the app. Each test must match its list exactly, so a new
// problem fails the test, and fixing one means deleting its entry here.
const KNOWN_ISSUES = {
  missingFilters: ['4: Rocket Hideout (frlg-30)', '12: Royal Avenue (usum-51)'],
  duplicateIds: ['10: id 69'],
  // Misspellings: these Pokémon are never matched for their location
  unknownEncounterNames: [
    'gsc-63: Spinark',
    'rse-36: Milktank',
    'frlg-49: Macargo',
    'hgss-17: Spinark',
    'hgss-63: Spinark',
    'hgss-87: Ledybda',
    'bw2-44: Whimiscott',
    'bw2-44: Liligant',
    'sm-3: Spinark',
    'sm-54: Konmmo-o',
    'usum-3: Spinark',
    'usum-18: Groyvle',
    'usum-56: Konmmo-o',
    'swsh-4: Barrskewda',
    'swsh-5: Skowvet',
    'swsh-5: Kirilia',
    'swsh-6: Seimsitoad',
    'swsh-7: Grappoloct',
    'swsh-10: Galavantula',
    'swsh-24: Rhyorn',
    'swsh-24: Rimbombee',
    'swsh-26: Barbarcle',
    'swsh-30: Togedmaru',
    'swsh-30: Hakam-o',
    'swsh-30: Hatterne',
    'swsh-30: Barraskweda',
    'swsh-32: Swirilix',
    'bdsp-57: Flaafy',
    'bdsp-63: Tentracruel',
    'bdsp-63: Meditie',
  ],
  localeKeys: [],
};

describe('Game data integrity', () => {
  test('every base game has encounters, badges and level caps', () => {
    const missing = GAME_KEYS.flatMap((key) => [
      ...(GAME_KEY_DICTIONARY[key] ? [] : [`${key}: encounters`]),
      ...(BADGES[key] ? [] : [`${key}: badges`]),
      ...(LEVEL_CAPS[key] ? [] : [`${key}: level caps`]),
    ]);
    expect(missing).toEqual([]);
  });

  test('every level cap set exists in GAME_CAP_DICTIONARY', () => {
    const missing = Object.values(LEVEL_CAPS)
      .flat()
      .filter((cap) => !GAME_CAP_DICTIONARY[cap.value])
      .map((cap) => cap.value);
    expect(missing).toEqual([]);
  });

  test('every encounter filterKey has an encounter table', () => {
    const missing = Object.entries(GAME_KEY_DICTIONARY).flatMap(([game, encounters]) =>
      encounters
        .filter((encounter) => encounter.filterKey && !FILTERS[encounter.filterKey])
        .map((encounter) => `${game}: ${encounter.location} (${encounter.filterKey})`)
    );
    expect(missing).toEqual(KNOWN_ISSUES.missingFilters);
  });

  test('encounter ids are unique within each game', () => {
    const duplicates = Object.entries(GAME_KEY_DICTIONARY).flatMap(([game, encounters]) => {
      const ids = encounters.map((encounter) => encounter.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index).map((id) => `${game}: id ${id}`);
    });
    expect(duplicates).toEqual(KNOWN_ISSUES.duplicateIds);
  });

  test('every Pokémon in the encounter tables exists', () => {
    const unknown = Object.entries(FILTERS).flatMap(([key, names]) =>
      names.filter((name) => !POKEMON_NAMES.has(name)).map((name) => `${key}: ${name}`)
    );
    expect(unknown).toEqual(KNOWN_ISSUES.unknownEncounterNames);
  });

  test('every gym/trial Pokémon and move in the details exists', () => {
    const unknown = Object.entries(DETAILS).flatMap(([game, badges]) =>
      badges
        .flat()
        .flatMap((detail) =>
          [...detail.content, ...(detail.rematch ?? [])].flatMap((member) => [
            ...(POKEMAP.has(member.id) ? [] : [`${game} ${detail.name}: pokemon ${member.id}`]),
            ...(member.moves ?? [])
              .filter((move) => !MOVEMAP.has(move))
              .map((move) => `${game} ${detail.name}: move ${move}`),
          ])
        )
    );
    expect(unknown).toEqual([]);
  });

  test('every evolution line references existing Pokémon', () => {
    const unknown = POKEMON.flatMap((poke) =>
      (poke.evolve ?? []).filter((id) => !POKEMAP.has(id)).map((id) => `${poke.text}: ${id}`)
    );
    expect(unknown).toEqual([]);
  });
});

describe('Locale integrity', () => {
  const LOCALE_DIR = path.resolve(__dirname, '../locale');
  const LANGUAGES = ['es', 'de'];
  const flattenKeys = (value: unknown, prefix = ''): string[] =>
    value && typeof value === 'object'
      ? Object.entries(value).flatMap(([key, child]) =>
          flattenKeys(child, prefix ? `${prefix}.${key}` : key)
        )
      : [prefix];
  const readKeys = (language: string, file: string) =>
    new Set(
      flattenKeys(JSON.parse(fs.readFileSync(path.join(LOCALE_DIR, language, file), 'utf8')))
    );

  const namespaces = fs.readdirSync(path.join(LOCALE_DIR, 'en')).sort();

  test.each(LANGUAGES)('%s has the same namespaces as en', (language) => {
    expect(fs.readdirSync(path.join(LOCALE_DIR, language)).sort()).toEqual(namespaces);
  });

  test('es and de have the same keys as en', () => {
    const problems = namespaces.flatMap((file) => {
      const en = readKeys('en', file);
      return LANGUAGES.flatMap((language) => {
        const keys = readKeys(language, file);
        return [
          ...[...en]
            .filter((key) => !keys.has(key))
            .map((key) => `${language}/${file}: missing ${key}`),
          ...[...keys]
            .filter((key) => !en.has(key))
            .map((key) => `${language}/${file}: extra ${key}`),
        ];
      });
    });
    expect(problems).toEqual(KNOWN_ISSUES.localeKeys);
  });
});
