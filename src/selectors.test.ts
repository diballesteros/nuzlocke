import { INITIAL_STATE } from 'constants/constant';
import type {
  AppState,
  PokemonDetail,
  TEncounter,
  TStatus,
  TTeamDictionary,
} from 'constants/types';
import {
  selectBoxed,
  selectBuilderStrong,
  selectBuilderWeak,
  selectCaught,
  selectCompletion,
  selectExport,
  selectFailed,
  selectFainted,
  selectItemGeneration,
  selectNAGeneration,
  selectShiny,
  selectSuggestion,
  selectTeam,
  selectTotal,
} from 'selectors';
import useStore from 'store';

const status = (value: number) => ({ value }) as TStatus;

const encounter = (id: number, statusValue: number | null, pokemon = 25): TEncounter => ({
  id,
  location: `Route ${id}`,
  pokemon,
  status: statusValue === null ? null : status(statusValue),
});

const stateWith = (game: string, encounters: TEncounter[], extra: Partial<AppState> = {}) => {
  const state = structuredClone(INITIAL_STATE) as AppState;
  state.selectedGame = state.gamesList.find((g) => g.value === game);
  state.games[game].encounters = encounters;
  return { ...state, ...extra };
};

// One encounter per status: 1 captured, 2 fainted, 3 gifted, 4 traded, 5 failed, 7 team
const MIXED = [1, 2, 3, 4, 5, 7, null].map((value, i) => encounter(i, value));
const idsOf = (encounters: TEncounter[]) => encounters.map((enc) => enc.status?.value);

describe('status selectors', () => {
  const state = stateWith('13', MIXED);

  test('group encounters by status', () => {
    expect(idsOf(selectTeam(state))).toEqual([7]);
    expect(idsOf(selectBoxed(state))).toEqual([1, 3, 4]);
    expect(idsOf(selectFainted(state))).toEqual([2]);
    expect(idsOf(selectFailed(state))).toEqual([5]);
    expect(idsOf(selectCaught(state))).toEqual([1, 3, 4, 7]);
    expect(idsOf(selectTotal(state))).toEqual([1, 2, 3, 4, 7]);
  });

  test('completion is the share of encounters with a pokemon and a status', () => {
    expect(selectCompletion(state)).toBeCloseTo(6 / 7);
    expect(selectCompletion(stateWith('13', [encounter(0, null)]))).toBe(0);
  });

  test('shiny encounters', () => {
    const shiny = {
      ...encounter(9, 1),
      details: { id: 25, level: 5, moves: [], shiny: true } as PokemonDetail,
    };
    expect(selectShiny(stateWith('13', [...MIXED, shiny]))).toEqual([shiny]);
  });

  test('return undefined without a selected game', () => {
    const state = structuredClone(INITIAL_STATE) as AppState;
    expect(selectTeam(state)).toBeUndefined();
    expect(selectCompletion(state)).toBe(0);
  });
});

describe('generation selectors', () => {
  test.each([
    ['1', false, false],
    ['2', false, true],
    ['3', true, true],
    ['custom', true, true],
  ])('game %s: natures/abilities %s, items %s', (game, natures, items) => {
    const state = { selectedGame: { value: game } } as AppState;
    expect(selectNAGeneration(state)).toBe(natures);
    expect(selectItemGeneration(state)).toBe(items);
  });
});

describe('type suggestions', () => {
  test('no suggestions without a team', () => {
    expect(selectSuggestion(stateWith('13', [encounter(0, 1)]))).toBeUndefined();
  });

  test('suggests types that cover what the team cannot hit (Pikachu, Gen 8)', () => {
    expect(selectSuggestion(stateWith('13', [encounter(0, 7, 25)]))).toMatchInlineSnapshot(`
      [
        "BUG",
        "DARK",
        "DRAGON",
        "FAIRY",
        "FIGHTING",
        "FIRE",
        "FLYING",
        "GHOST",
        "GRASS",
        "GROUND",
        "ICE",
        "POISON",
        "PSYCHIC",
        "ROCK",
        "STEEL",
        "WATER",
      ]
    `);
  });

  test('uses the older type chart for Gen 1 (Pikachu)', () => {
    expect(selectSuggestion(stateWith('1', [encounter(0, 7, 25)]))).toMatchInlineSnapshot(`
      [
        "BUG",
        "DRAGON",
        "FIGHTING",
        "FIRE",
        "FLYING",
        "GHOST",
        "GRASS",
        "GROUND",
        "ICE",
        "POISON",
        "PSYCHIC",
        "ROCK",
        "WATER",
      ]
    `);
  });
});

describe('team builder', () => {
  // Charizard with Flamethrower (53), Thunderbolt (85) and Growl (45, status move)
  const team: TTeamDictionary = {
    '13': [{ id: 6, level: 50, moves: [53, 85, 45] }],
    '1': [{ id: 35, level: 50, moves: [] }],
  };

  test('no analysis without a team', () => {
    expect(selectBuilderStrong(stateWith('13', []))).toBeUndefined();
    expect(selectBuilderWeak(stateWith('13', []))).toBeUndefined();
  });

  test('counts super-effective coverage from damaging moves', () => {
    expect(selectBuilderStrong(stateWith('13', [], { team }))).toMatchInlineSnapshot(`
      {
        "BUG": 1,
        "DARK": 0,
        "DRAGON": 0,
        "ELECTRIC": 0,
        "FAIRY": 0,
        "FIGHTING": 0,
        "FIRE": 0,
        "FLYING": 1,
        "GHOST": 0,
        "GRASS": 1,
        "GROUND": 0,
        "ICE": 1,
        "NORMAL": 0,
        "POISON": 0,
        "PSYCHIC": 0,
        "ROCK": 0,
        "STEEL": 1,
        "WATER": 1,
      }
    `);
  });

  test('counts weaknesses, cancelled by the second type', () => {
    expect(selectBuilderWeak(stateWith('13', [], { team }))).toMatchInlineSnapshot(`
      {
        "BUG": 0,
        "DARK": 0,
        "DRAGON": 0,
        "ELECTRIC": 1,
        "FAIRY": 0,
        "FIGHTING": 0,
        "FIRE": 0,
        "FLYING": 0,
        "GHOST": 0,
        "GRASS": 0,
        "GROUND": 0,
        "ICE": 0,
        "NORMAL": 0,
        "POISON": 0,
        "PSYCHIC": 0,
        "ROCK": 2,
        "STEEL": 0,
        "WATER": 1,
      }
    `);
  });

  test('uses pre-Fairy types for older games (Clefairy in Gen 1)', () => {
    expect(selectBuilderWeak(stateWith('1', [], { team }))).toMatchInlineSnapshot(`
      {
        "BUG": 0,
        "DRAGON": 0,
        "ELECTRIC": 0,
        "FIGHTING": 1,
        "FIRE": 0,
        "FLYING": 0,
        "GHOST": 0,
        "GRASS": 0,
        "GROUND": 0,
        "ICE": 0,
        "NORMAL": 0,
        "POISON": 0,
        "PSYCHIC": 0,
        "ROCK": 0,
        "WATER": 0,
      }
    `);
  });
});

describe('export', () => {
  test('exports only the shareable fields', () => {
    expect(Object.keys(JSON.parse(selectExport(useStore.getState()))).sort()).toEqual(
      [
        'badges',
        'customBadges',
        'customStatuses',
        'darkMode',
        'duplicates',
        'games',
        'gamesList',
        'missing',
        'nicknames',
        'notes',
        'rules',
        'selectedGame',
        'showAll',
        'suggestions',
        'team',
      ].sort()
    );
  });
});
