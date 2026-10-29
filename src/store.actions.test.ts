import { GAME_CAP_DICTIONARY } from 'constants/badges';
import { INITIAL_STATE } from 'constants/constant';
import STATUSES from 'constants/status';
import type { AppState, TEncounter } from 'constants/types';
import useStore from 'store';

const INITIAL = useStore.getState();
const SWSH = '13';
// New game keys are the last key + 1, and the last base game is '13.1'
const CUSTOM = '14.1';

const store = () => useStore.getState();
const encounters = (game = SWSH) => store().games[game].encounters;
const first = (game = SWSH): TEncounter => encounters(game)[0];

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  store().selectGame(store().gamesList.find((game) => game.value === SWSH));
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

describe('encounters', () => {
  test('change pokemon, status, nickname and clear them again', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeStatus(id, STATUSES[0]);
    store().changeNickname(id, 'Sobble');
    expect(first()).toMatchObject({ pokemon: 816, status: STATUSES[0], nickname: 'Sobble' });

    store().clearEncounter(id);
    expect(first()).toMatchObject({ pokemon: null, status: null, nickname: null, details: null });
  });

  test('add and delete custom locations', () => {
    const count = encounters().length;
    store().addEncounter('Secret Garden');
    const added = encounters()[encounters().length - 1];
    expect(added).toMatchObject({ location: 'Secret Garden', pokemon: null, status: null });

    store().deleteEncounter(added.id);
    expect(encounters()).toHaveLength(count);
  });

  test('level changes create details and step the level', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeLevel(id, true);
    expect(first().details).toEqual({ id: 816, level: 1, moves: [] });
    store().changeLevel(id, true);
    store().changeLevel(id, true);
    store().changeLevel(id, false);
    expect(first().details.level).toBe(2);
  });

  test('moving an encounter puts it in its target place', () => {
    const [a, b, c, d] = encounters().map((enc) => enc.id);
    store().moveEncounter(c, a);
    expect(
      encounters()
        .slice(0, 4)
        .map((enc) => enc.id)
    ).toEqual([c, a, b, d]);
    store().moveEncounter(c, d);
    expect(
      encounters()
        .slice(0, 4)
        .map((enc) => enc.id)
    ).toEqual([a, b, d, c]);
    const before = structuredClone(encounters());
    store().moveEncounter(-1, a);
    store().moveEncounter(a, -1);
    expect(encounters()).toEqual(before);
  });

  test('nature creates details when missing', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeNature(id, 'Bold');
    expect(first().details).toEqual({ id: 816, level: 1, moves: [], nature: 'Bold' });
    store().changeNature(id, 'Calm');
    expect(first().details.nature).toBe('Calm');
  });

  test('unknown encounter ids are ignored', () => {
    const before = structuredClone(encounters());
    store().changePokemon(-1, 25);
    store().changeStatus(-1, STATUSES[0]);
    store().changeNickname(-1, 'Ghost');
    store().changePreviousStatus(-1, STATUSES[0]);
    store().changeLevel(-1, true);
    store().changeNature(-1, 'Bold');
    store().clearEncounter(-1);
    store().changeDetails(
      ...([-1, ...Array(25).fill(undefined)] as Parameters<AppState['changeDetails']>)
    );
    store().deleteEncounter(-1);
    expect(encounters()).toEqual(before);
  });

  test('reset restores the template encounters and clears badges', () => {
    store().changePokemon(first().id, 25);
    store().selectBadge(0);
    store().resetAll();
    expect(encounters()).toEqual(INITIAL_STATE.games[SWSH].encounters);
    expect(store().games[SWSH].badge).toEqual([]);
  });

  test('exporting to another game prepends it with the new location', () => {
    store().changePokemon(first().id, 816);
    store().exportToGame(first(), '1', 'From Sword and Shield');
    expect(first('1')).toMatchObject({ pokemon: 816, location: 'From Sword and Shield' });
  });

  test('mass import replaces matching encounters', () => {
    const imported = { ...first(), pokemon: 1, status: STATUSES[0] };
    store().massImport([imported]);
    expect(first()).toEqual(imported);
  });
});

describe('games', () => {
  test('a custom game from a template copies encounters and level caps', () => {
    store().addGame('My run', '4');
    const custom = store().selectedGame;
    expect(custom).toMatchObject({ text: 'My run', value: CUSTOM });
    expect(encounters(CUSTOM)).toEqual(INITIAL_STATE.games['4'].encounters);
    expect(store().customBadges[CUSTOM]).toEqual(GAME_CAP_DICTIONARY.FRLG);
    expect(store().summary[CUSTOM]).toBeDefined();
    expect(store().calcs[CUSTOM]).toBeDefined();
  });

  test('an empty custom game has no encounters', () => {
    store().addGame('Blank');
    expect(encounters(CUSTOM)).toEqual([]);
    expect(store().customBadges[CUSTOM]).toBeUndefined();
  });

  test('deleting a game removes all of its data', () => {
    store().addGame('Doomed', '4');
    store().addTeamMember(25);
    store().changeNotes('notes');
    store().deleteGame();
    const state = store();
    expect(state.selectedGame).toBeNull();
    expect(state.games[CUSTOM]).toBeUndefined();
    expect(state.team[CUSTOM]).toBeUndefined();
    expect(state.notes[CUSTOM]).toBeUndefined();
    expect(state.gamesList.find((game) => game.value === CUSTOM)).toBeUndefined();
  });

  test('badges toggle on and off', () => {
    store().selectBadge(2);
    store().selectBadge(4);
    store().selectBadge(2);
    expect(store().games[SWSH].badge).toEqual([4]);
  });

  test('a legacy non-list badge value is replaced before toggling', () => {
    useStore.setState((state) => {
      (state.games[SWSH] as unknown as { badge: number }).badge = 3;
    });
    store().selectBadge(1);
    expect(store().games[SWSH].badge).toEqual([1]);
  });

  test('level caps can be edited and reset', () => {
    store().editBadge('99', 0);
    expect(store().badges[SWSH][0].levelCap).toBe('99');
    store().resetBadges(null);
    expect(store().badges[SWSH][0].levelCap).toBe(INITIAL.badges[SWSH][0].levelCap);
  });

  test('custom level caps can be added, edited and deleted', () => {
    store().addCustomBadge();
    store().addCustomBadge();
    store().editCustomBadge('30', 1);
    expect(store().customBadges[SWSH]).toEqual([0, '30']);
    store().deleteCustomBadge(0);
    expect(store().customBadges[SWSH]).toEqual(['30']);
  });

  test('skipped encounters are tracked per game', () => {
    store().addSkipped(3);
    store().addSkipped(5);
    store().deleteSkipped(3);
    expect(store().skipped[SWSH]).toEqual([5]);
    store().deleteSkipped(42);
    expect(store().skipped[SWSH]).toEqual([5]);
  });

  test('deleting a game without per-game data still removes the game', () => {
    store().addGame('Bare');
    useStore.setState((state) => {
      delete state.summary[CUSTOM];
      delete state.calcs[CUSTOM];
    });
    store().deleteGame();
    expect(store().games[CUSTOM]).toBeUndefined();
    expect(store().selectedGame).toBeNull();
  });
});

describe('rules', () => {
  test('rulesets and their rules can be managed', () => {
    store().addRuleset('Mine');
    store().changeRuleset('Mine');
    store().addRule({ content: 'One', default: false, type: 'TEXT' });
    store().addRule({ content: 'Two', default: false, type: 'TEXT' });
    store().editRule('Uno', 0);
    store().reorderRule(0, store().rules.Mine[1], 1);
    expect(store().rules.Mine.map((rule) => rule.content)).toEqual(['Two', 'Uno']);

    store().deleteRule(0);
    expect(store().rules.Mine.map((rule) => rule.content)).toEqual(['Uno']);

    store().deleteRuleset();
    expect(store().rules.Mine).toBeUndefined();
  });
});

describe('team builder', () => {
  test('members can be added, changed and removed', () => {
    store().addTeamMember(25);
    store().exportTeamMember({ id: 6, level: 50, moves: [53] });
    store().changeTeamMember(0, { id: 26, level: 30, moves: [85] });
    expect(store().team[SWSH]).toEqual([
      { id: 26, level: 30, moves: [85] },
      { id: 6, level: 50, moves: [53] },
    ]);
    store().deleteTeamMember(0);
    expect(store().team[SWSH]).toEqual([{ id: 6, level: 50, moves: [53] }]);
  });
});

describe('custom statuses', () => {
  test('deleting a custom status clears it from every game', () => {
    store().addCustomStatus('Benched');
    const benched = store().customStatuses[0];
    store().changeStatus(first().id, benched);
    store().deleteCustomStatus(0);
    expect(store().customStatuses).toEqual([]);
    expect(first().status).toBeNull();
  });
});

describe('settings', () => {
  test.each([
    ['toggleMode', 'darkMode'],
    ['changeDupe', 'duplicates'],
    ['toggleMissing', 'missing'],
    ['toggleNickname', 'nicknames'],
    ['toggleShowAll', 'showAll'],
    ['toggleSoulink', 'soulink'],
    ['toggleSuggestions', 'suggestions'],
  ] as const)('%s flips %s', (action, field) => {
    const before = store()[field];
    store()[action]();
    expect(store()[field]).toBe(!before);
  });

  test('importing a run replaces state and coerces flags to booleans', () => {
    const games = structuredClone(store().games);
    store().importState({
      games,
      gamesList: store().gamesList,
      selectedGame: store().gamesList[0],
      darkMode: undefined,
      nicknames: true,
    });
    expect(store()).toMatchObject({
      selectedGame: store().gamesList[0],
      darkMode: false,
      nicknames: true,
    });
  });

  test('importing keeps optional sections only when present', () => {
    const rules = store().rules;
    store().importState({
      games: structuredClone(store().games),
      gamesList: store().gamesList,
      selectedGame: store().gamesList[0],
      notes: { '1': 'imported notes' },
      skipped: { '1': [2] },
    });
    expect(store().notes).toEqual({ '1': 'imported notes' });
    expect(store().skipped).toEqual({ '1': [2] });
    expect(store().rules).toEqual(rules);
  });
});
