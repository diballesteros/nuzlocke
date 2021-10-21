import { Result } from '@smogon/calc';
import { assertIndex, assertResult } from 'hooks/useCalculate';
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

  test('Test invalid calculation', () => {
    const result = {
      fullDesc: function fullDesc() {
        throw Error('Invalid');
      },
    };
    const value = getDesc(result as unknown as Result);
    expect(value).toEqual('Invalid calculation');
  });
});
