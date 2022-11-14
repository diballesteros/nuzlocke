import type { TReleaseNotes } from 'constants/types';

export const CHANGELOG2: TReleaseNotes = [
  {
    name: 'Version 5.4.1',
    date: 1668459228974,
    notes: [
      {
        description: "Corrected typo with Ghetsis's name",
        type: 'FIX',
      },
      {
        description: 'Fixed Magma Hideout encounters for Emerald',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 209 encounters for Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
      {
        description: 'Added Liberty Garden encounter to Black and White',
        type: 'FIX',
      },
      {
        description:
          'Added Trial Chamber, Guidance Chamber, Rumination Field and P2 Laboratory encounters for Black and White 2',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.4.0',
    date: 1665923670722,
    notes: [
      {
        description:
          'Added support to skip encounters so it does not show up as the next available encounter by popping out the list and clicking on the eye icon',
        type: 'FEATURE',
      },
      {
        description: 'Added Axew to encounters in Rolling Fields in Sword and Shield',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.3.0',
    date: 1665245743186,
    notes: [
      {
        description: 'Added support for importing EV/IVs from games in the import menu',
        type: 'UPDATE',
      },
      {
        description: 'Added EV/IV information to some of the USUM trials',
        type: 'UPDATE',
      },
      {
        description:
          'Added postgame encounters for FireRed and LeafGreen (requires an encounter reset)',
        type: 'UPDATE',
      },
      {
        description: 'Silver Powder should now correctly factor into damage calculations',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.2.5',
    date: 1664625343125,
    notes: [
      {
        description: 'Added genders to pokemon in Emerald gym fight details',
        type: 'UPDATE',
      },
    ],
  },
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
