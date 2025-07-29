import { Result } from '@smogon/calc';
import { TFunction } from 'i18next';
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

  test('Invalid pokemon', () => {
    const value = getPokemon(null, 1);
    expect(value).to.deep.equal(null);
  });

  test('Invalid results', () => {
    const value = getResults(null, null, null, null, 1);
    expect(value).to.deep.equal([null, null, null, null]);
  });
});
