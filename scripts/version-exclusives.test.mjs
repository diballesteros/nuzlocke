import { describe, expect, test } from 'vitest';
import { ALIASES, exclusives, locationKey, speciesId } from './version-exclusives.mjs';

describe('version-exclusives', () => {
  test("species ids follow PokéAPI's identifiers", () => {
    expect(
      [
        'Nidoran♀',
        'Nidoran♂',
        'Mr. Mime',
        "Farfetch'd",
        'Mime Jr.',
        'Flabébé',
        'Vulpix (Alolan)',
        "Farfetch'd (Galarian)",
      ].map(speciesId)
    ).toEqual([
      'nidoran-f',
      'nidoran-m',
      'mr-mime',
      'farfetchd',
      'mime-jr',
      'flabebe',
      'vulpix-alola',
      'farfetchd-galar',
    ]);
  });

  test('location names match across spellings', () => {
    expect(
      ['Diglett’s Tunnel', 'Pokémon Mansion', 'Wild Area: Dusty Bowl', 'Mt. Moon'].map(locationKey)
    ).toEqual(['digletts tunnel', 'pokemon mansion', 'dusty bowl', 'mount moon']);
  });

  test('tags what appears in some versions, and reports what the tables lack', () => {
    const all = ['red', 'blue', 'yellow'];
    const encounters = [
      { location: 'Viridian Forest', filterKey: 'rby-6' },
      { location: 'Vermillion City', filterKey: 'rby-16' },
      { location: 'Nowhere', filterKey: 'rby-99' },
    ];
    const filters = {
      'rby-6': ['Caterpie', 'Weedle', 'Pidgey', 'Mew'],
      'rby-16': ['Krabby'],
      'rby-99': ['Ditto'],
    };
    const tables = {
      'viridian forest': {
        caterpie: new Set(all),
        weedle: new Set(['red', 'blue']),
        pidgey: new Set(['yellow']),
        pikachu: new Set(['red', 'blue']),
      },
      // The alias finds it under PokéAPI's spelling
      'vermilion city': { krabby: new Set(['yellow']) },
    };
    const { tags, missing } = exclusives(encounters, filters, tables, all, ALIASES['1']);
    // Mew isn't in PokéAPI's table, and Nowhere has none: both stay untagged
    expect(tags).toEqual({
      'rby-6': { Weedle: ['red', 'blue'], Pidgey: ['yellow'] },
      'rby-16': { Krabby: ['yellow'] },
    });
    expect(missing).toEqual([
      { filterKey: 'rby-6', location: 'Viridian Forest', id: 'pikachu', versions: ['red', 'blue'] },
    ]);
  });

  test('hand tags replace what the tables say', () => {
    const all = ['red', 'blue', 'yellow'];
    const { tags } = exclusives(
      [{ location: 'Starter', filterKey: 'rby-0' }],
      { 'rby-0': ['Bulbasaur', 'Pikachu'] },
      {},
      all
    );
    expect(tags).toEqual({ 'rby-0': { Bulbasaur: ['red', 'blue'], Pikachu: ['yellow'] } });
  });
});
