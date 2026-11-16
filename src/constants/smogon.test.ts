import { ABILITIES as PACKAGE_ABILITIES, ITEMS as PACKAGE_ITEMS } from '@smogon/calc';
import { ABILITIES } from '@smogon/calc/dist/data/abilities';
import { ITEMS } from '@smogon/calc/dist/data/items';
import { EXTRA_ITEMS, MY_ITEMS } from 'constants/constant';

// The item and ability lists come from @smogon/calc's data files rather than its index, which
// would bring the whole calculator into every page that lists items or abilities
describe('@smogon/calc data imported by file', () => {
  it('is the data the package exports', () => {
    expect(ITEMS).toBe(PACKAGE_ITEMS);
    expect(ABILITIES).toBe(PACKAGE_ABILITIES);
  });

  it('gives the item list', () => {
    expect(MY_ITEMS).toEqual([
      ...[...new Set(PACKAGE_ITEMS[8])].filter((item) => !item.startsWith('TR')),
      ...EXTRA_ITEMS,
    ]);
  });
});
