import { Result } from '@smogon/calc';
import { assertIndex, assertResult, getPokemon, getResults } from 'hooks/useCalculate';
import { getDesc } from './elements/CalculatorHeader/CalculatorHeader';

describe('Calculator function tests', () => {
  test('Index assertion', () => {
    expect(() => assertIndex(5)).toThrow(TypeError);
    expect(() => assertIndex(5)).toThrow('Invalid move index');
  });

  test('Result assertion', () => {
    expect(() => assertResult([null, null, null, null, null])).toThrow(TypeError);
    expect(() => assertResult([null, null, null, null, null])).toThrow(
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
    const value = getDesc(result as unknown as Result, mockTFunction);
    expect(value).toEqual('Invalid calculation');
  });

  test('Invalid pokemon', () => {
    const value = getPokemon(null, 1);
    expect(value).toStrictEqual(null);
  });

  test('Invalid results', () => {
    const value = getResults(null, null, null, null, 1);
    expect(value).toStrictEqual([null, null, null, null]);
  });
});
