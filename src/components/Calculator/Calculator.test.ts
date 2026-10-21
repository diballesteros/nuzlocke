import { Result } from '@smogon/calc';
import { TFunction } from 'i18next';
import { DEFAULT_VALUES } from 'constants/calculator';
import type { TCalculatorForm } from 'constants/types';
import { assertIndex, assertResult, getPokemon, getResults } from 'hooks/useCalculate';
import { getDesc } from './elements/CalculatorHeader/CalculatorHeader';

describe('Calculator function tests', () => {
  test('Index assertion', () => {
    expect(() => assertIndex(5)).to.throw(TypeError);
    expect(() => assertIndex(5)).to.throw('Invalid move index');
  });

  test('Result assertion', () => {
    expect(() => assertResult([null, null, null, null, null])).to.throw(TypeError);
    expect(() => assertResult([null, null, null, null, null])).to.throw(
      'Result should have been an array of calculations'
    );
  });

  test('Invalid calculation', () => {
    const result = {
      fullDesc: function fullDesc() {
        throw Error('Invalid');
      },
    };

    function mockTFunction() {
      return 'Invalid calculation';
    }
    const value = getDesc(result as unknown as Result, mockTFunction as unknown as TFunction);
    expect(value).to.equal('Invalid calculation');
  });

  // Known issue (kept as-is while behaviour is frozen): unset IVs reach @smogon/calc as undefined,
  // so every stat is NaN. Update this test when fixing it
  test('Unset IVs are passed through as undefined (stats become NaN)', () => {
    const form = {
      ...DEFAULT_VALUES,
      calculatorGen: 8,
      pokemon1: 25,
      pokemon2: 1,
      ivhp1: undefined,
      ivatk1: undefined,
      ivdef1: undefined,
      ivspatk1: undefined,
      ivspdef1: undefined,
      ivspeed1: undefined,
    } as TCalculatorForm;
    const pokemon = getPokemon(form, 1);
    expect(pokemon.name).to.equal('Pikachu');
    expect(Object.values(pokemon.ivs).every((iv) => iv === undefined)).to.equal(true);
    expect(Number.isNaN(pokemon.stats.hp)).to.equal(true);
  });

  test('Invalid pokemon', () => {
    const value = getPokemon(null, 1);
    expect(value).to.deep.equal(null);
  });

  test('Invalid results', () => {
    const value = getResults(null, null, null, null, 1);
    expect(value).to.deep.equal([null, null, null, null]);
  });
});
