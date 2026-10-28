import { Pokemon } from '@smogon/calc';
import { act, renderHook } from '@testing-library/react';
import type { AppState, TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';

const INITIAL = useStore.getState();
const SWSH = '13';
// Pikachu against Charizard; Thunderbolt and Tackle
const PIKACHU = 25;
const CHARIZARD = 6;
const THUNDERBOLT = 85;
const TACKLE = 33;

// The default form puts Pound (move 1) in every slot
const EMPTY_SLOTS: Partial<TCalculatorForm> = {
  move2_1: undefined,
  move3_1: undefined,
  move4_1: undefined,
  move2_2: undefined,
  move3_2: undefined,
  move4_2: undefined,
};

const store = () => useStore.getState();
const update = (values: Partial<TCalculatorForm>) =>
  act(() => {
    store().updateDefaultValues(values);
  });
const maxDamage = (result: { range: () => [number, number] }) => result.range()[1];

beforeEach(() => {
  useStore.setState({ ...INITIAL, ...structuredClone(stripActions(INITIAL)) }, true);
  localStorage.clear();
  store().selectGame(store().gamesList.find((game) => game.value === SWSH));
  store().updateDefaultValues({
    pokemon1: PIKACHU,
    pokemon2: CHARIZARD,
    move1_1: THUNDERBOLT,
    move1_2: TACKLE,
    ...EMPTY_SLOTS,
  });
});

function stripActions(state: AppState) {
  return Object.fromEntries(
    Object.entries(state).filter(([, value]) => typeof value !== 'function')
  ) as Partial<AppState>;
}

describe('useCalculate', () => {
  test("builds both pokemon from the selected game's form", () => {
    const { result } = renderHook(() => useCalculate());
    expect(result.current.pokemon1).toBeInstanceOf(Pokemon);
    expect(result.current.pokemon1.name).toBe('Pikachu');
    expect(result.current.pokemon2.name).toBe('Charizard');
    expect(result.current.pokemon1.gen.num).toBe(8);
  });

  test('calculates the chosen moves on each side and leaves empty slots null', () => {
    const { result } = renderHook(() => useCalculate());
    const { attackerResults, defenderResults } = result.current;

    expect(attackerResults).toHaveLength(4);
    expect(attackerResults[0].attacker.name).toBe('Pikachu');
    expect(attackerResults[0].defender.name).toBe('Charizard');
    expect(attackerResults[0].move.name).toBe('Thunderbolt');
    expect(attackerResults.slice(1)).toEqual([null, null, null]);

    expect(defenderResults[0].attacker.name).toBe('Charizard');
    expect(defenderResults[0].defender.name).toBe('Pikachu');
    expect(defenderResults[0].move.name).toBe('Tackle');
    expect(defenderResults.slice(1)).toEqual([null, null, null]);
  });

  test('crit, Z and Dynamax options reach the move', () => {
    update({ move1_crit1: true, move1_z2: true, isDynamaxed1: true });
    const { result } = renderHook(() => useCalculate());
    expect(result.current.attackerResults[0].move.isCrit).toBe(true);
    expect(result.current.attackerResults[0].move.useMax).toBe(true);
    expect(result.current.defenderResults[0].move.useZ).toBe(true);
    expect(result.current.defenderResults[0].move.useMax).toBeFalsy();
  });

  test('"None" weather and terrain are left unset, others are passed on', () => {
    const { result, rerender } = renderHook(() => useCalculate());
    expect(result.current.attackerResults[0].field.weather).toBeUndefined();
    expect(result.current.attackerResults[0].field.terrain).toBeUndefined();

    update({ weather: 'Rain', terrain: 'Electric', isGravity: true, gameType: 'Doubles' });
    rerender();
    const { field } = result.current.attackerResults[0];
    expect(field.weather).toBe('Rain');
    expect(field.terrain).toBe('Electric');
    expect(field.isGravity).toBe(true);
    expect(field.gameType).toBe('Doubles');
  });

  test('side 1 is the attacker side and side 2 the defender side', () => {
    update({ isReflect1: true, spikes2: 2, isSwitching1: true, isTailwind2: true });
    const { result } = renderHook(() => useCalculate());
    const { field } = result.current.attackerResults[0];
    expect(field.attackerSide.isReflect).toBe(true);
    expect(field.attackerSide.isSwitching).toBe('out');
    expect(field.attackerSide.spikes).toBe(0);
    expect(field.defenderSide.spikes).toBe(2);
    expect(field.defenderSide.isTailwind).toBe(true);
    expect(field.defenderSide.isSwitching).toBeUndefined();
  });

  // The field isn't swapped for the defender's moves, so side 2's screens still guard the
  // defender's target: here Reflect on Charizard's side halves Charizard's own Tackle
  test("the defender's moves use the same field, not a swapped one", () => {
    const { result, rerender } = renderHook(() => useCalculate());
    const plain = maxDamage(result.current.defenderResults[0]);
    expect(result.current.defenderResults[0].field.attackerSide.isReflect).toBeFalsy();

    update({ isReflect2: true });
    rerender();
    expect(result.current.defenderResults[0].field.defenderSide.isReflect).toBe(true);
    expect(maxDamage(result.current.defenderResults[0])).toBeLessThan(plain);
  });

  test('keeps the same pokemon until the form changes', () => {
    const { result, rerender } = renderHook(() => useCalculate());
    const { pokemon1, pokemon2 } = result.current;
    rerender();
    expect(result.current.pokemon1).toBe(pokemon1);
    expect(result.current.pokemon2).toBe(pokemon2);

    update({ level1: 50 });
    expect(result.current.pokemon1).not.toBe(pokemon1);
    expect(result.current.pokemon1.level).toBe(50);
  });

  // The return type promises pokemon, but without a game there is no form at all
  test('without a selected game, the pokemon are null and every result is null', () => {
    act(() => {
      store().selectGame(null);
    });
    const { result } = renderHook(() => useCalculate());
    expect(result.current).toEqual({
      pokemon1: null,
      pokemon2: null,
      attackerResults: [null, null, null, null],
      defenderResults: [null, null, null, null],
    });
  });
});
