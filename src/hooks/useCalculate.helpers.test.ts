import { Pokemon } from '@smogon/calc';
import { DEFAULT_VALUES } from 'constants/calculator';
import { SMOGON_NAMES } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import type { TCalculatorForm } from 'constants/types';
import { assertIndex, assertResult, getPokemon, getSmogonName } from 'hooks/useCalculate';

const form = (extra: Partial<TCalculatorForm> = {}): TCalculatorForm =>
  ({ ...DEFAULT_VALUES, calculatorGen: 8, pokemon1: 25, pokemon2: 6, ...extra }) as TCalculatorForm;

describe('assertions', () => {
  test('assertResult accepts exactly four results', () => {
    expect(() => assertResult([1, 2, 3, 4])).not.toThrow();
    expect(() => assertResult([1, 2, 3])).toThrow(TypeError);
  });

  test('assertIndex accepts 1 to 4', () => {
    expect(() => assertIndex(1)).not.toThrow();
    expect(() => assertIndex(4)).not.toThrow();
    expect(() => assertIndex(0)).toThrow('Invalid move index');
    expect(() => assertIndex(5)).toThrow(TypeError);
  });
});

describe('getSmogonName', () => {
  test('maps names that differ in @smogon/calc and passes the rest through', () => {
    const [name, smogon] = Object.entries(SMOGON_NAMES)[0];
    expect(getSmogonName(name)).toBe(smogon);
    expect(getSmogonName('Pikachu')).toBe('Pikachu');
  });
});

describe('getPokemon', () => {
  test('returns null without a generation or a pokemon', () => {
    expect(getPokemon(form({ calculatorGen: undefined }), 1)).toBeNull();
    expect(getPokemon(form({ pokemon1: undefined }), 1)).toBeNull();
    expect(getPokemon(undefined, 1)).toBeNull();
  });

  test('builds the pokemon for each side', () => {
    const one = getPokemon(form(), 1);
    const two = getPokemon(form(), 2);
    expect(one).toBeInstanceOf(Pokemon);
    expect(one.name).toBe(getSmogonName(POKEMAP.get(25).text));
    expect(two.name).toBe(getSmogonName(POKEMAP.get(6).text));
  });

  test('uses IVs and EVs in generation 3 and later', () => {
    const mon = getPokemon(form({ ivatk1: 20, evatk1: 100 }), 1);
    expect(mon.ivs.atk).toBe(20);
    expect(mon.evs.atk).toBe(100);
  });

  test('derives IVs from DVs and maxes EVs in generations 1 and 2', () => {
    const mon = getPokemon(form({ calculatorGen: 2, dvatk1: 7, evatk1: 0 }), 1);
    expect(mon.evs.atk).toBe(252);
    expect(mon.ivs.atk).toBe(15);
  });

  test('drops forbidden items and renames Silver Powder', () => {
    expect(getPokemon(form({ item1: 'Silver Powder' }), 1).item).toBe('SilverPowder');
    expect(getPokemon(form({ item1: 'Absolite' }), 1).item).toBeUndefined();
    expect(getPokemon(form({ item1: 'Leftovers' }), 1).item).toBe('Leftovers');
  });

  test('a "none" status is left unset', () => {
    expect(getPokemon(form({ status1: 'none' }), 1).status).toBe('');
    expect(getPokemon(form({ status1: 'brn' }), 1).status).toBe('brn');
  });
});
