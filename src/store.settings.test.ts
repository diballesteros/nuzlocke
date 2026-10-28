import { INITIAL_SUMMARY } from 'constants/constant';
import STATUSES from 'constants/status';
import type { AppState, TEncounter } from 'constants/types';
import useStore from 'store';

const INITIAL = useStore.getState();
const SWSH = '13';

const store = () => useStore.getState();
const first = (): TEncounter => store().games[SWSH].encounters[0];

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

describe('encounter details', () => {
  test('changeDetails stores every field and the encounter pokemon id', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeDetails(
      id, 5, 4, 'FEMALE', 'Torrent', 'Bold', 'Oran Berry', 'No', 1, 2, 3, 4, true,
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 3
    ); // prettier-ignore
    expect(first().details).toEqual({
      level: 5,
      metLevel: 4,
      gender: 'FEMALE',
      ability: 'Torrent',
      id: 816,
      nature: 'Bold',
      item: 'Oran Berry',
      faint: 'No',
      moves: [1, 2, 3, 4],
      shiny: true,
      ivhp: 1,
      ivatk: 2,
      ivdef: 3,
      ivspatk: 4,
      ivspdef: 5,
      ivspeed: 6,
      evhp: 7,
      evatk: 8,
      evdef: 9,
      evspatk: 10,
      evspdef: 11,
      evspeed: 12,
      soulink: 3,
    });
  });

  test('changeDetails ignores unknown encounters', () => {
    const before = structuredClone(store().games);
    store().changeDetails(
      -1, 5, 4, 'MALE', 'a', 'n', 'i', 'f', 1, 2, 3, 4, false,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ); // prettier-ignore
    expect(store().games).toEqual(before);
  });

  test('changeLevel with details but level 0 resets the level to 1', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeNature(id, 'Bold');
    expect(first().details.level).toBe(1);
    store().changeLevel(id, false);
    expect(first().details.level).toBe(0);
    // A level of 0 is falsy, so the next step in either direction lands on 1
    store().changeLevel(id, false);
    expect(first().details.level).toBe(1);
  });

  test('changeNature keeps existing details', () => {
    const { id } = first();
    store().changePokemon(id, 816);
    store().changeLevel(id, true);
    store().changeLevel(id, true);
    store().changeNature(id, 'Calm');
    expect(first().details).toEqual({ id: 816, level: 2, moves: [], nature: 'Calm' });
  });

  test('the previous status is stored on the encounter', () => {
    const { id } = first();
    store().changePreviousStatus(id, STATUSES[1]);
    expect(first().previousStatus).toEqual(STATUSES[1]);
    store().changePreviousStatus(-1, STATUSES[2]);
    expect(first().previousStatus).toEqual(STATUSES[1]);
  });
});

describe('team, skipped and notes', () => {
  test('the first team member creates the list and later ones append', () => {
    expect(store().team[SWSH]).toBeUndefined();
    store().addTeamMember(25);
    store().addTeamMember(26);
    expect(store().team[SWSH]).toEqual([
      { id: 25, level: 0, moves: [] },
      { id: 26, level: 0, moves: [] },
    ]);
  });

  test('exporting a team member creates the list when there is none', () => {
    store().exportTeamMember({ id: 6, level: 50, moves: [] });
    expect(store().team[SWSH]).toEqual([{ id: 6, level: 50, moves: [] }]);
  });

  test('skipped indexes can be deleted, and unknown ones are ignored', () => {
    store().addSkipped(3);
    store().addSkipped(5);
    store().deleteSkipped(3);
    store().deleteSkipped(99);
    expect(store().skipped[SWSH]).toEqual([5]);
  });

  test('notes are stored per game', () => {
    store().changeNotes('hello');
    expect(store().notes[SWSH]).toBe('hello');
  });
});

describe('rules', () => {
  test('reordering moves a rule to the destination index', () => {
    const name = store().selectedRuleset;
    const rules = store().rules[name];
    expect(rules.length).toBeGreaterThan(2);
    const [a, b, c] = rules;
    store().reorderRule(2, a, 0);
    expect(store().rules[name].slice(0, 3)).toEqual([b, c, a]);
  });

  test('changeRuleset selects a ruleset and deleteRuleset removes it', () => {
    store().addRuleset('Mine');
    store().changeRuleset('Mine');
    expect(store().selectedRuleset).toBe('Mine');
    expect(store().rules.Mine).toEqual([]);
    store().deleteRuleset();
    expect(store().rules.Mine).toBeUndefined();
  });
});

describe('summary and calculator', () => {
  test('summary fields can be changed, toggled and reset', () => {
    store().changeSummaryTitle('Run');
    store().changeSummaryDescription('Desc');
    store().changeSummaryStatus(2);
    expect(store().summary[SWSH]).toMatchObject({ title: 'Run', description: 'Desc', status: 2 });

    const flag = (Object.keys(INITIAL_SUMMARY) as (keyof typeof INITIAL_SUMMARY)[]).find(
      (key) => typeof INITIAL_SUMMARY[key] === 'boolean'
    );
    const before = store().summary[SWSH][flag];
    store().toggleSummarySetting(flag as never);
    expect(store().summary[SWSH][flag]).toBe(!before);

    store().setDefaultSummary();
    expect(store().summary[SWSH]).toEqual(INITIAL_SUMMARY);
  });

  test('the calculator form merges updates and resets to the defaults', () => {
    store().updateDefaultValues({ level1: 77 });
    expect(store().calcs[SWSH].form.level1).toBe(77);
    store().setDefaultCalculator();
    expect(store().calcs[SWSH].form).toMatchObject({ calculatorGen: 8, pokemon1: 1, pokemon2: 1 });
    expect(store().calcs[SWSH].form.level1).not.toBe(77);
  });

  test('updating the calculator without a selected game does nothing', () => {
    store().selectGame(undefined);
    const calcs = structuredClone(store().calcs);
    store().updateDefaultValues({ level1: 77 });
    expect(store().calcs).toEqual(calcs);
  });
});

describe('filters and ui flags', () => {
  test('generations and types toggle on and off', () => {
    store().setGens(2);
    store().setGens(4);
    store().setGens(2);
    expect(store().gens).toEqual([4]);
    store().setTypes('FIRE');
    store().setTypes('WATER');
    store().setTypes('FIRE');
    expect(store().types).toEqual(['WATER']);
  });

  test('search, language and the type modal', () => {
    store().search('pika');
    store().setLanguage('es');
    store().showTypeModal('FIRE');
    expect(store()).toMatchObject({ text: 'pika', language: 'es', typeModal: 'FIRE' });
    store().closeTypeModal();
    expect(store().typeModal).toBeNull();
  });

  test('the all-tooltip hint is turned off and the new-version notice is acknowledged', () => {
    store().toggleShowAllTooltip();
    expect(store().showAllTooltip).toBe(false);
    store().toggleShowAllTooltip();
    expect(store().showAllTooltip).toBe(false);
    store().removeNew();
    expect(store().newVersion).toBe(import.meta.env.REACT_APP_VERSION);
  });
});
