import {
  DEFAULT_RULES,
  INITIAL_STATE,
  SOULLINK_RULESET,
  WEDLOCKE_RULESSET,
} from 'constants/constant';
import STATUSES from 'constants/status';
import type { AppState, TEncounter } from 'constants/types';
import useStore from 'store';

const STORAGE_KEY = 'pokemon-tracker';

// A persisted state as an older app version would have written it
const persistedState = (): AppState => structuredClone(INITIAL_STATE) as AppState;

const migrate = (state: AppState, version: number) =>
  useStore.persist.getOptions().migrate(state, version) as AppState;

const encounterAt = (state: AppState, game: string, index: number): TEncounter =>
  state.games[game].encounters[index];

describe('Persisted store', () => {
  test('uses the pokemon-tracker key at version 8', () => {
    expect(useStore.persist.getOptions().name).toBe(STORAGE_KEY);
    expect(useStore.persist.getOptions().version).toBe(8);
  });

  test('rehydrates a current (v8) snapshot from localStorage as-is', async () => {
    const state = persistedState();
    state.darkMode = true;
    state.selectedGame = state.gamesList[0];
    state.games['1'].encounters[0] = {
      ...encounterAt(state, '1', 0),
      pokemon: 25,
      nickname: 'Sparky',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ state, version: 8 }));

    await useStore.persist.rehydrate();

    const current = useStore.getState();
    expect(current.darkMode).toBe(true);
    expect(current.selectedGame).toEqual(state.gamesList[0]);
    expect(encounterAt(current, '1', 0)).toMatchObject({ pokemon: 25, nickname: 'Sparky' });
    localStorage.clear();
  });

  test('writes state changes back to localStorage', () => {
    useStore.getState().toggleNickname();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored.version).toBe(8);
    expect(stored.state.nicknames).toBe(useStore.getState().nicknames);
    localStorage.clear();
  });
});

describe('Store migrations', () => {
  test('v0: encounter pokemon objects become ids', () => {
    const state = persistedState();
    (state.games['1'].encounters[0] as unknown as { pokemon: unknown }).pokemon = {
      value: 25,
      text: 'Pikachu',
    };
    expect(encounterAt(migrate(state, 0), '1', 0).pokemon).toBe(25);
  });

  test('v1: legacy rulesets are converted to named text rules', () => {
    const state = persistedState();
    state.rulesets = [
      { key: '1', text: 'Nuzlocke', value: '1' },
      { key: '2', text: 'My rules', value: '2' },
    ];
    state.rules = {
      '1': [{ content: 'Catch first', default: true, type: 'TEXT' }],
      '2': [{ content: 'No items', default: true, type: 'TEXT' }],
    };
    const migrated = migrate(state, 1);
    expect(migrated.rules['old-Nuzlocke']).toEqual([
      { content: 'Catch first', default: false, type: 'TEXT' },
    ]);
    expect(migrated.rules['My rules']).toEqual([
      { content: 'No items', default: false, type: 'TEXT' },
    ]);
    expect(migrated.rules.Nuzlocke).toEqual(DEFAULT_RULES.Nuzlocke);
  });

  test('v2: inline encounter filters are replaced by filterKey', () => {
    const state = persistedState();
    const encounter = encounterAt(state, '4', 2);
    const { filterKey } = encounter;
    delete encounter.filterKey;
    encounter.filter = ['Pidgey'];
    const migrated = encounterAt(migrate(state, 2), '4', 2);
    expect(migrated.filterKey).toBe(filterKey);
    expect(migrated.filter).toBeUndefined();
  });

  test('v3: Brilliant Diamond/Shining Pearl is added once', () => {
    const state = persistedState();
    delete state.games['13.1'];
    delete state.calcs['13.1'];
    delete state.summary['13.1'];
    state.gamesList = state.gamesList.filter((game) => game.value !== '13.1');
    const migrated = migrate(state, 3);
    expect(migrated.games['13.1']).toBeDefined();
    expect(migrated.calcs['13.1']).toBeDefined();
    expect(migrated.summary['13.1']).toBeDefined();
    expect(migrated.gamesList.filter((game) => game.value === '13.1')).toHaveLength(1);
    expect(migrated.gamesList[13].value).toBe('13.1');
  });

  test('v4: an existing Brilliant Diamond/Shining Pearl game is kept', () => {
    const state = persistedState();
    const migrated = migrate(state, 4);
    expect(migrated.gamesList.filter((game) => game.value === '13.1')).toHaveLength(1);
  });

  test('v4: a missing Brilliant Diamond/Shining Pearl game is added', () => {
    const state = persistedState();
    delete state.games['13.1'];
    state.gamesList = state.gamesList.filter((game) => game.value !== '13.1');
    const migrated = migrate(state, 4);
    expect(migrated.games['13.1']).toBeDefined();
    expect(migrated.gamesList[13].value).toBe('13.1');
  });

  test('v6: games without a badge count get an empty badge list', () => {
    const state = persistedState();
    delete state.games['1'].badge;
    expect(migrate(state, 6).games['1'].badge).toEqual([]);
  });

  test('v5: legacy status 6 becomes Fainted + shiny, and Soulocke rules are added', () => {
    const state = persistedState();
    delete state.rules.Soulocke;
    state.games['1'].encounters[0] = {
      ...encounterAt(state, '1', 0),
      pokemon: 25,
      status: { icon: null, key: 'old', value: 6, text: 'Old' },
      details: { id: 25, level: 5, moves: [] },
    };
    const migrated = migrate(state, 5);
    expect(encounterAt(migrated, '1', 0).status).toEqual(STATUSES[1]);
    expect(encounterAt(migrated, '1', 0).details?.shiny).toBe(true);
    expect(migrated.rules.Soulocke).toEqual(SOULLINK_RULESET);
  });

  test('v6: Wedlocke rules are added', () => {
    const state = persistedState();
    delete state.rules.Wedlocke;
    expect(migrate(state, 6).rules.Wedlocke).toEqual(WEDLOCKE_RULESSET);
  });

  test('v7: obtained badges are reset', () => {
    const state = persistedState();
    state.games['1'].badge = [0, 1, 2];
    expect(migrate(state, 7).games['1'].badge).toEqual([]);
  });

  test('always resets the selected ruleset to Nuzlocke', () => {
    const state = persistedState();
    state.selectedRuleset = 'Hardcore';
    expect(migrate(state, 7).selectedRuleset).toBe('Nuzlocke');
  });

  test('rejects a non-object state', () => {
    expect(() => migrate('broken' as unknown as AppState, 7)).toThrow('Invalid app state');
  });
});
