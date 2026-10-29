import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DEFAULT_POKEMON_1, DEFAULT_POKEMON_2 } from 'constants/calculator';
import DETAILS from 'constants/details';
import type { AppState, PokemonDetail, TCalculatorForm, TEncounter } from 'constants/types';
import useStore from 'store';
import PokeController from './PokeController';

// The selectors are dialogs over a virtualized list, which jsdom can't lay out. Each stub picks
// whatever the test hands it, so these tests check what PokeController does with the choice
const picks = vi.hoisted(() => ({
  detail: null as PokemonDetail,
  encounter: null as TEncounter,
  pokemon: 0,
}));

type DetailSelectorProps = {
  details: PokemonDetail[];
  handleDetail: (detail: PokemonDetail) => void;
};
type EncounterSelectorProps = { handleEncounter: (encounter: TEncounter) => void };
type PokemonSelectorProps = { handlePokemon: (id: number) => void };

vi.mock('common', async (importOriginal) => ({
  ...(await importOriginal<typeof import('common')>()),
  DetailSelector: ({ details, handleDetail }: DetailSelectorProps) => (
    <button data-count={details?.length ?? 0} onClick={() => handleDetail(picks.detail)}>
      detail-selector
    </button>
  ),
  EncounterSelector: ({ handleEncounter }: EncounterSelectorProps) => (
    <button onClick={() => handleEncounter(picks.encounter)}>encounter-selector</button>
  ),
  PokemonSelector: ({ handlePokemon }: PokemonSelectorProps) => (
    <button onClick={() => handlePokemon(picks.pokemon)}>pokemon-selector</button>
  ),
}));

const INITIAL = useStore.getState();
const USUM = '12';

const STATS = ['hp', 'atk', 'def', 'spatk', 'spdef', 'speed'];
// What handleEncounter sets for an encounter without IVs or EVs
const ZEROED = Object.fromEntries(
  STATS.flatMap((s) => [
    [`iv${s}1`, 0],
    [`ev${s}1`, 0],
  ])
);

const store = () => useStore.getState();
const form = (): TCalculatorForm => store().calcs[USUM].form;

// Radix measures the anchor; jsdom has no ResizeObserver or pointer capture
beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  store().selectGame(store().gamesList.find((game) => game.value === USUM));
  store().setDefaultCalculator();
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

describe('attacker', () => {
  test('shows my encounters by default, and every Pokémon when switched', async () => {
    const user = userEvent.setup();
    render(<PokeController encounters={[]} name="pokemon1" />);
    expect(screen.getByText('encounter-selector')).toBeTruthy();
    expect(screen.queryByTestId('gym-filter')).toBeNull();
    await user.click(screen.getByTestId('show-all-pokemon1'));
    expect(screen.getByText('pokemon-selector')).toBeTruthy();
  });

  test('an encounter brings its details and resets the rest of the attacker', async () => {
    const user = userEvent.setup();
    store().updateDefaultValues({ level1: 5, modatk1: 2, pokemon2: 25 });
    picks.encounter = {
      details: {
        ability: 'Torrent',
        gender: 'FEMALE',
        id: 7,
        item: 'Mystic Water',
        level: 12,
        moves: [55, 33, 39, 145],
        nature: 'Modest',
        evspatk: 8,
        ivhp: 20,
        ivspeed: 31,
      },
      id: 1,
      location: 'Route 1',
      pokemon: 7,
      status: null,
    };
    render(<PokeController encounters={[]} name="pokemon1" />);
    await user.click(screen.getByText('encounter-selector'));
    expect(form()).toMatchObject({
      ...DEFAULT_POKEMON_1,
      ...ZEROED,
      ability1: 'Torrent',
      gender1: 'FEMALE',
      item1: 'Mystic Water',
      level1: 12,
      nature1: 'Modest',
      move1_1: 55,
      move2_1: 33,
      move3_1: 39,
      move4_1: 145,
      evhp1: 0,
      evspatk1: 8,
      ivhp1: 20,
      ivatk1: 0,
      ivspeed1: 31,
      pokemon1: 7,
      pokemon2: 25,
    });
  });

  // Pinned as it is: the defaults have 31 IVs, but an encounter without them brings 0
  test('an encounter without details gets the defaults, with IVs and EVs at 0', async () => {
    const user = userEvent.setup();
    picks.encounter = { details: null, id: 1, location: 'Route 1', pokemon: 4, status: null };
    render(<PokeController encounters={[]} name="pokemon1" />);
    await user.click(screen.getByText('encounter-selector'));
    expect(form()).toMatchObject({ ...DEFAULT_POKEMON_1, ...ZEROED, pokemon1: 4 });
    expect(DEFAULT_POKEMON_1.ivhp1).toBe(31);
  });

  test('a Pokémon from the full list resets the attacker', async () => {
    const user = userEvent.setup();
    store().updateDefaultValues({ level1: 5 });
    picks.pokemon = 150;
    render(<PokeController encounters={[]} name="pokemon1" />);
    await user.click(screen.getByTestId('show-all-pokemon1'));
    await user.click(screen.getByText('pokemon-selector'));
    expect(form()).toMatchObject({ ...DEFAULT_POKEMON_1, pokemon1: 150 });
  });
});

describe('defender', () => {
  test('shows every Pokémon by default; a pick resets the defender', async () => {
    const user = userEvent.setup();
    store().updateDefaultValues({ level2: 7, pokemon1: 6 });
    picks.pokemon = 151;
    render(<PokeController name="pokemon2" />);
    expect(screen.getByTestId('gym-filter')).toBeTruthy();
    await user.click(screen.getByText('pokemon-selector'));
    expect(form()).toMatchObject({ ...DEFAULT_POKEMON_2, pokemon1: 6, pokemon2: 151 });
  });

  test("the gym filter lists the game's trainers and hands the chosen one's team over", async () => {
    const user = userEvent.setup();
    render(<PokeController name="pokemon2" />);
    await user.click(screen.getByTestId('show-all-pokemon2'));
    expect(screen.getByText('detail-selector').dataset.count).toBe('0');

    const trainers = DETAILS[USUM].flat();
    await user.click(screen.getByRole('combobox', { name: 'gym-filter' }));
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(trainers.length);
    expect(options[0].textContent).toBe(`${trainers[0].name} - ${trainers[0].game}`);

    const lana = trainers.findIndex((trainer) => trainer.name.startsWith("Lana's Trial"));
    await user.click(options[lana]);
    expect(screen.getByText('detail-selector').dataset.count).toBe(
      String(trainers[lana].content.length)
    );
  });

  test("a trainer's Pokémon brings every detail it has, IVs and EVs included", async () => {
    const user = userEvent.setup();
    picks.detail = {
      ability: 'Water Bubble',
      gender: 'MALE',
      id: 752,
      item: 'Wacan Berry',
      level: 20,
      moves: [141, 145, 44, 62],
      nature: 'Bold',
      ivhp: 31,
      ivatk: 1,
      ivdef: 31,
      ivspatk: 1,
      ivspdef: 31,
      ivspeed: 1,
      evhp: 4,
      evatk: 8,
      evdef: 252,
      evspatk: 12,
      evspdef: 16,
      evspeed: 20,
    };
    render(<PokeController name="pokemon2" />);
    await user.click(screen.getByTestId('show-all-pokemon2'));
    await user.click(screen.getByText('detail-selector'));
    expect(form()).toMatchObject({
      ability2: 'Water Bubble',
      gender2: 'MALE',
      item2: 'Wacan Berry',
      level2: 20,
      nature2: 'Bold',
      move1_2: 141,
      move2_2: 145,
      move3_2: 44,
      move4_2: 62,
      ivhp2: 31,
      ivatk2: 1,
      ivdef2: 31,
      ivspatk2: 1,
      ivspdef2: 31,
      ivspeed2: 1,
      evhp2: 4,
      evatk2: 8,
      evdef2: 252,
      evspatk2: 12,
      evspdef2: 16,
      evspeed2: 20,
      pokemon2: 752,
    });
  });

  test("details a trainer's Pokémon lacks keep the defender's defaults", async () => {
    const user = userEvent.setup();
    store().updateDefaultValues({ ability2: 'Levitate', ivatk2: 3, level2: 9 });
    picks.detail = { id: 74, level: 0, moves: undefined };
    render(<PokeController name="pokemon2" />);
    await user.click(screen.getByTestId('show-all-pokemon2'));
    await user.click(screen.getByText('detail-selector'));
    expect(form()).toMatchObject({ ...DEFAULT_POKEMON_2, pokemon2: 74 });
    expect(form().ability2).toBe(DEFAULT_POKEMON_2.ability2);
  });

  test('a game without trainer details has no gym filter', () => {
    store().addGame('Custom');
    store().selectGame(store().gamesList.find((game) => game.text === 'Custom'));
    render(<PokeController name="pokemon2" />);
    expect(screen.queryByTestId('gym-filter')).toBeNull();
    expect(screen.getByText('pokemon-selector')).toBeTruthy();
  });
});
