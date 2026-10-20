import {
  getRuleContent,
  getSmogonItemName,
  getTypeCountParams,
  getTypeParams,
  TYPE_COUNT,
} from 'constants/constant';

describe('getRuleContent', () => {
  test.each([
    ['TYPE', ['FIRE', 'WATER'], 'Allowed types: FIRE, WATER'],
    ['GENERATION', [1, 2], 'Allowed generations: 1, 2'],
    ['LEVEL', 50, 'Max level 50'],
    ['TEXT', 'Only one catch per route', 'Only one catch per route'],
  ] as const)('%s', (type, content, expected) => {
    expect(getRuleContent(content as never, type)).toBe(expected);
  });
});

describe('type chart parameters by game', () => {
  test.each([
    ['1', 15, 'Gen 1'],
    ['2', 17, 'Gen 2 - 5'],
    ['8', 17, 'Gen 2 - 5'],
    ['9', 18, 'Gen 6 - 8'],
    ['13.1', 18, 'Gen 6 - 8'],
    ['custom', 18, 'Gen 6 - 8'],
  ])('game %s has %i types on chart %s', (game, typeCount, chart) => {
    const [types, range] = getTypeParams(game);
    expect(types).toHaveLength(typeCount);
    expect(range).toBe(chart);
    const [counts, countRange] = getTypeCountParams(game);
    expect(Object.keys(counts)).toHaveLength(typeCount);
    expect(Object.values(counts).every((count) => count === 0)).toBe(true);
    expect(countRange).toBe(chart);
  });

  test('returns fresh counters so selectors can mutate them', () => {
    const [first] = getTypeCountParams('13');
    first.FIRE = 5;
    expect(getTypeCountParams('13')[0].FIRE).toBe(0);
    expect(TYPE_COUNT.FIRE).toBe(0);
  });
});

describe('getSmogonItemName', () => {
  test('converts item names to Smogon ids', () => {
    expect(getSmogonItemName('Choice Scarf')).toBe('choice-scarf');
    expect(getSmogonItemName("King's Rock")).toBe('kings-rock');
  });
});
