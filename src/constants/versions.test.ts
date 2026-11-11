import { GAME_KEY_DICTIONARY } from 'constants/constant';
import EXCLUSIVES from 'constants/exclusives';
import FILTERS from 'constants/filters';
import { GAME_VERSIONS, inVersion } from 'constants/versions';

describe('inVersion', () => {
  test('without a version, every Pokémon in a table appears', () => {
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Weedle')).toBe(true);
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Pidgey', undefined)).toBe(true);
  });

  test('before the tags have loaded, nothing is filtered', () => {
    expect(inVersion(null, 'rby-6', 'Weedle', 'yellow')).toBe(true);
  });

  test('a tagged Pokémon appears only in its versions', () => {
    // Viridian Forest: Weedle in Red and Blue, Pidgey in Yellow
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Weedle', 'red')).toBe(true);
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Weedle', 'yellow')).toBe(false);
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Pidgey', 'yellow')).toBe(true);
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Pidgey', 'blue')).toBe(false);
  });

  test('an untagged Pokémon or location appears in every version', () => {
    expect(inVersion(EXCLUSIVES, 'rby-6', 'Caterpie', 'yellow')).toBe(true);
    expect(inVersion(EXCLUSIVES, 'frlg-3', 'Pidgey', 'red')).toBe(true);
  });

  test("Yellow's only starter is Pikachu", () => {
    const starters = FILTERS['rby-0'].filter((name) =>
      inVersion(EXCLUSIVES, 'rby-0', name, 'yellow')
    );
    expect(starters).toEqual(['Pikachu']);
  });
});

describe('version tags', () => {
  // Each tagged table belongs to one of the combined games, by its encounters' filter keys
  const gameOf = (filterKey: string) =>
    Object.keys(GAME_VERSIONS).find((game) =>
      GAME_KEY_DICTIONARY[game].some((encounter) => encounter.filterKey === filterKey)
    );

  test("every tag names a Pokémon in its location's table, in a strict subset of the game's versions", () => {
    const problems = Object.entries(EXCLUSIVES).flatMap(([filterKey, tags]) => {
      const game = gameOf(filterKey);
      if (!game) return [`${filterKey}: not a location of a game with versions`];
      return Object.entries(tags).flatMap(([pokemon, versions]) => {
        const all = GAME_VERSIONS[game];
        if (!FILTERS[filterKey].includes(pokemon)) return [`${filterKey}: ${pokemon} not in table`];
        if (
          versions.length === 0 ||
          versions.length >= all.length ||
          versions.some((version) => !all.includes(version))
        ) {
          return [`${filterKey}: ${pokemon} has ${versions}`];
        }
        return [];
      });
    });
    expect(problems).toEqual([]);
  });

  // Only these locations are empty in some versions: Emerald's Mirage Tower and Desert Underpass,
  // Team Aqua's hideout (Ruby has Magma's), Platinum's Porygon gift and Distortion World
  test('locations left empty by a version are the ones that version lacks', () => {
    const empty = Object.keys(EXCLUSIVES).flatMap((filterKey) =>
      GAME_VERSIONS[gameOf(filterKey)]
        .filter(
          (version) =>
            !FILTERS[filterKey].some((name) => inVersion(EXCLUSIVES, filterKey, name, version))
        )
        .map((version) => `${filterKey} ${version}`)
    );
    expect(empty).toMatchInlineSnapshot(`
      [
        "rse-22 ruby",
        "rse-22 sapphire",
        "rse-27 ruby",
        "rse-27 sapphire",
        "rse-69 ruby",
        "dpp-32 diamond",
        "dpp-32 pearl",
        "dpp-55 diamond",
        "dpp-55 pearl",
      ]
    `);
  });
});
