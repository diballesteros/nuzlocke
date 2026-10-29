import { readFileSync } from 'node:fs';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { toast } from 'react-toastify';
import type { AppState, TEncounter } from 'constants/types';
import useStore from 'store';
import Import from './Import';

vi.mock('react-toastify', () => ({
  toast: Object.assign(vi.fn(), { error: vi.fn(), success: vi.fn() }),
}));

const INITIAL = useStore.getState();
const HGSS = '6';
// The header PkHeX exports, as the e2e import uses it
const HEADER = readFileSync('tests/data/table.txt', 'utf8').split('\n')[0].trim().split('|');

const store = () => useStore.getState();
const encounter = (location: string): TEncounter =>
  store().games[HGSS].encounters.find((enc) => enc.location === location);

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  vi.mocked(toast.error).mockClear();
  vi.mocked(toast.success).mockClear();
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

function selectHgss() {
  store().selectGame(store().gamesList.find((game) => game.value === HGSS));
}

// One table row, with every column the row doesn't name left empty
function row(values: Record<string, string>) {
  return HEADER.map((column) => values[column] ?? '').join('|');
}

function table(...rows: string[]) {
  return [HEADER.join('|'), HEADER.map(() => ':--:').join('|'), ...rows].join('\n');
}

const tableOption = () => screen.getByRole('radio', { name: 'import_game_by' });

function renderImport() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <Import />
    </MemoryRouter>
  );
  return user;
}

async function importTable(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.click(tableOption());
  const textarea = screen.getByTestId('table-import-textarea');
  // Pasted: user.type would read the brackets in a table as key names
  await user.click(textarea);
  await user.paste(text);
  await user.click(screen.getByTestId('apply-import'));
}

describe('complete import', () => {
  const upload = async (user: ReturnType<typeof userEvent.setup>, content: string) => {
    const file = new File([content], 'backup.json', { type: 'application/json' });
    await user.upload(screen.getByTestId('import-file-input'), file);
    expect(screen.getByText('backup.json')).toBeTruthy();
    await user.click(screen.getByTestId('apply-import'));
  };

  test('needs a file first', () => {
    renderImport();
    expect(screen.getByTestId('apply-import').hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('select_file...')).toBeTruthy();
  });

  test('a backup with games, a selected game and a games list replaces the state', async () => {
    const user = renderImport();
    const { games, gamesList } = store();
    const selectedGame = gamesList.find((game) => game.value === HGSS);
    await upload(user, JSON.stringify({ darkMode: true, games, gamesList, selectedGame }));
    await vi.waitFor(() => expect(toast.success).toHaveBeenCalledWith('file_success'));
    expect(store().selectedGame).toEqual(selectedGame);
    expect(store().darkMode).toBe(true);
  });

  test('a backup missing one of them, or a file that is not JSON, is rejected', async () => {
    const user = renderImport();
    const { games } = store();
    await upload(user, JSON.stringify({ games }));
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledWith('invalid_file'));
    await upload(user, '{ not json');
    await vi.waitFor(() => expect(toast.error).toHaveBeenCalledTimes(2));
    expect(store().selectedGame).toBeNull();
    expect(toast.success).not.toHaveBeenCalled();
  });
});

describe('import by table', () => {
  test('needs a selected game, and text', async () => {
    const { unmount } = render(
      <MemoryRouter>
        <Import />
      </MemoryRouter>
    );
    expect(tableOption().hasAttribute('disabled')).toBe(true);
    expect(screen.getByText('no_game')).toBeTruthy();
    unmount();

    selectHgss();
    const user = renderImport();
    expect(screen.getByText('HeartGold and SoulSilver')).toBeTruthy();
    await user.click(tableOption());
    expect(screen.getByTestId('apply-import').hasAttribute('disabled')).toBe(true);
  });

  test('a row fills the encounter whose location contains its met location', async () => {
    selectHgss();
    const user = renderImport();
    await importTable(
      user,
      table(
        row({
          'Ability': 'Overgrow',
          'ATK_EV': '16',
          'ATK_IV': '30',
          'DEF_EV': '17',
          'DEF_IV': '8',
          'Gender': 'F',
          'HeldItem': 'Oran Berry',
          'HP_EV': '34',
          'HP_IV': '4',
          'IsShiny': 'True',
          'Level': '27',
          'MetLevel': '5',
          'MetLoc': 'New Bark Town',
          'Move1': 'Headbutt',
          'Move2': 'Reflect',
          'Move3': 'Magical Leaf',
          'Move4': 'Poison Powder',
          'Nature': 'Adamant',
          'Nickname': 'Chicalina',
          'SPA_EV': '10',
          'SPA_IV': '2',
          'SPD_EV': '22',
          'SPD_IV': '6',
          'SPE_EV': '44',
          'SPE_IV': '2',
          'Species': 'Bayleef',
        })
      )
    );

    expect(toast.success).toHaveBeenCalledWith('game_success');
    const imported = encounter('New Bark Town');
    expect(imported).toMatchObject({ nickname: 'Chicalina', pokemon: 153, status: null });
    expect(imported.details).toMatchObject({
      ability: 'Overgrow',
      gender: 'FEMALE',
      id: 153,
      item: 'Oran Berry',
      level: 27,
      metLevel: 5,
      nature: 'Adamant',
      shiny: true,
      ivhp: 4,
      ivatk: 30,
      ivdef: 8,
      ivspatk: 2,
      ivspdef: 6,
      ivspeed: 2,
      evhp: 34,
      evatk: 16,
      evdef: 17,
      evspatk: 10,
      evspdef: 22,
      evspeed: 44,
    });
    expect(imported.details.moves.every((move) => typeof move === 'number')).toBe(true);
  });

  test('(None), unknown moves and stats that are not numbers fall back', async () => {
    selectHgss();
    const user = renderImport();
    await importTable(
      user,
      table(
        row({
          'Gender': 'M',
          'HeldItem': '(None)',
          'IsShiny': 'False',
          'MetLoc': 'Route 29',
          'Move1': 'Not A Move',
          'Nature': '(None)',
          'Nickname': '(None)',
          'Species': 'Sentret',
          ...Object.fromEntries(
            ['HP', 'ATK', 'DEF', 'SPA', 'SPD', 'SPE'].flatMap((stat) => [
              [`${stat}_IV`, 'N/A'],
              [`${stat}_EV`, 'N/A'],
            ])
          ),
        })
      )
    );

    const imported = encounter('Route 29');
    expect(imported.nickname).toBeNull();
    expect(imported.details).toMatchObject({
      gender: 'MALE',
      item: null,
      moves: [null, null, null, null],
      nature: null,
      shiny: false,
      ivhp: 31,
      ivatk: 31,
      ivdef: 31,
      ivspatk: 31,
      ivspdef: 31,
      ivspeed: 31,
      evhp: 0,
      evatk: 0,
      evdef: 0,
      evspatk: 0,
      evspdef: 0,
      evspeed: 0,
    });
  });

  // Pinned as it is: Number('') is 0, so an empty IV column imports as 0, not the 31 fallback
  test('an empty IV column imports as 0', async () => {
    selectHgss();
    const user = renderImport();
    await importTable(user, table(row({ MetLoc: 'Route 29', Species: 'Sentret' })));
    expect(encounter('Route 29').details).toMatchObject({ ivhp: 0, evhp: 0, level: 0 });
  });

  test('rows without a species, too short, or from an unknown location are skipped', async () => {
    selectHgss();
    const before = structuredClone(store().games[HGSS].encounters);
    const user = renderImport();
    await importTable(
      user,
      table(
        row({ MetLoc: 'Route 29' }),
        'a|b|c',
        row({ MetLoc: 'Nowhere Island', Species: 'Mew' }),
        ''
      )
    );
    expect(toast.success).toHaveBeenCalledWith('game_success');
    expect(store().games[HGSS].encounters).toEqual(before);
  });

  test('text without a header and a row, or without columns, is rejected', async () => {
    selectHgss();
    const user = renderImport();
    await importTable(user, 'Species|Nickname');
    expect(toast.error).toHaveBeenCalledWith('invalid_text');
    await user.clear(screen.getByTestId('table-import-textarea'));
    await user.click(screen.getByTestId('table-import-textarea'));
    await user.paste('one line\nanother line');
    await user.click(screen.getByTestId('apply-import'));
    expect(toast.error).toHaveBeenCalledTimes(2);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
