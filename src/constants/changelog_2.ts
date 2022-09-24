import type { TReleaseNotes } from 'constants/types';

export const CHANGELOG2: TReleaseNotes = [
  {
    name: 'Version 5.2.4',
    date: 1664035513999,
    notes: [
      {
        description: 'Fixed Safari Zone encounters for Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description:
          'Fix encounters for Route 121, 123, Lilycove City, and Shoal Cave for Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description:
          'Added Scorched Slab as an encounter location for Omega Ruby and Alpha Sapphire, this requires an encounter reset to see',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.2.3',
    date: 1663512268548,
    notes: [
      {
        description: 'Fixed Rustboro City encoutners in Ruby, Sapphire, and Emerald',
        type: 'FIX',
      },
      {
        description:
          'Fixed Rustboro City, Route 119, Route 107, Route 126, Route 128, Route 129, and Route 130 encounters in Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 215 encounters for Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
    ],
  },
];
