import type { TReleaseNotes } from 'constants/types';

export const CHANGELOG2: TReleaseNotes = [
  {
    name: 'Version 5.6.0',
    date: 1712779602626,
    notes: [
      {
        description:
          'Added button to delete account from the account settings, note this is permanent',
        type: 'FEATURE',
      },
      {
        description: 'Fixed Totem Gumshoos moveset in Ultra Sun and Ultra Moon',
        type: 'FIX',
      },
      {
        description: "Fixed the levels for Olivia's pokemon in Sun and Moon",
        type: 'FIX',
      },
      {
        description:
          'Removed Larvesta from Route 18 encounters and added it to Treasure Hunter in Black and White',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.5.0',
    date: 1712707374313,
    notes: [
      {
        description: 'Added Jynx as an encounter to Cerulean City in Red Blue and Yellow',
        type: 'FIX',
      },
      {
        description: 'Added Slugma as an encounter to Route 16 in Gold Silver and Crystal',
        type: 'FIX',
      },
      {
        description: 'Added Mr. Mime as an encounter to Route 2 in Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description: 'Added Aron as an encounter to Guidance Chamber in Black and White 2',
        type: 'FIX',
      },
      {
        description:
          'Added Spearow to Route 35, Psyduck to the Safari Zone, and Combee to Route 5 as encounters in Heart Gold and Soul Silver',
        type: 'FIX',
      },
      {
        description:
          'Added Barboach to Rolling Fields and Wynaut to Stony Wilderness in Sword and Shield',
        type: 'FIX',
      },
      {
        description:
          'Added Geodude to Route 18 and Banette to Pokemon Village as encounters to X and Y',
        type: 'FIX',
      },
      {
        description:
          'Added Zubat to Meteor Falls and Geodude to Rusturf Tunnel in Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description:
          'Added Sea Mauville and Soaring in the Sky locations for Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description: "Fixed Whitney's Miltank moveset in Heart Gold and Soul Silver",
        type: 'FIX',
      },
      {
        description: "Changed Roxie's Grimer's ability to Stench in Black and White 2",
        type: 'FIX',
      },
      {
        description: 'Fixed the spelling of Cyllage City and Coumarine City in X and Y',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.4.5',
    date: 1688385563589,
    notes: [
      {
        description: 'Fixed encounter list for Safari Zone in Yellow',
        type: 'FIX',
      },
      {
        description: 'Fixed encounter list for Seafoam island in Fire Red and Leaf Green',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.4.3',
    date: 1685291528317,
    notes: [
      {
        description: "Fixed Fantina's Mismagius' moveset in Brilliant Diamong and Shining Pearl",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.4.2',
    date: 1682784141071,
    notes: [
      {
        description:
          'Fixed encounters for Cerulean City and Seafoam Islands in Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description: 'Added Cherubi to Watchtower Ruins in Sword and Shield',
        type: 'FIX',
      },
      {
        description:
          'Added Floaroma Town in Brilliant Diamond and Shining Pearl. This requires an encounter reset to see',
        type: 'FIX',
      },
      {
        description: 'Added Trophy Garden in Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
      {
        description: 'Added Cobalion to Mistralton Cave in Black and White',
        type: 'FIX',
      },
    ],
  },
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
