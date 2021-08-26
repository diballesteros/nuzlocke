import { TReleaseNotes } from 'constants/types';

const CHANGELOG: TReleaseNotes = [
  {
    name: 'Version 3.3.0',
    date: 1630126800000,
    notes: [
      {
        description:
          "New custom rule types - create rules for pokemon type, generation level that alert if they're being broken",
        type: 'FEATURE',
      },
      {
        description: 'Revamped About section',
        type: 'UPDATE',
      },
      {
        description: 'New sections in summary page to show all fainted and boxed pokemon',
        type: 'UPDATE',
      },
      {
        description: 'New default rulesets for Genlocke, Egglocke and Wonderlocke',
        type: 'UPDATE',
      },
      {
        description: 'App is now availabe in the Microsoft Store and Playstore',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 3.2.1',
    date: 1629781200000,
    notes: [
      {
        description:
          'New buttons in footer and about section to support project. Completely optional',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 3.2.0',
    date: 1629694800000,
    notes: [
      {
        description: 'Rematch information for Elite 4 for HGSS in badge details',
        type: 'FEATURE',
      },
      {
        description:
          'Fixed Route 114 encounters for Ruby, Sapphire, Emerald, Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description: 'Summary image cards now adapt to full size of row incase something is hidden',
        type: 'FIX',
      },
      {
        description: 'Bruno HGSS detail fixes',
        type: 'FIX',
      },
      {
        description: 'New alert when team has over 6 pokémon',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 3.1.0',
    date: 1629522000000,
    notes: [
      {
        description:
          'Evolve pokémon - button to the right of the pokémon name that lets you evolve or devolve',
        type: 'FEATURE',
      },
      {
        description:
          'Record your encounters with detailed information, including: pokemon, level, gender, ability, nature, item and more',
        type: 'FEATURE',
      },
      {
        description:
          'Summary Tab in PokéStats - Includes downloadable and customizable summary image',
        type: 'UPDATE',
      },
      {
        description:
          'Fix to correctly show the selected pokémon if the location filter is enabled and it is not found in the filtered list',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 19 encounters for Red, Blue and Yellow',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.0.0',
    date: 1628917200000,
    notes: [
      {
        description:
          "Nickname generator - Generate a random word or reorder the letters of the pokémon's name",
        type: 'FEATURE',
      },
      {
        description: 'Gym leader details - New button that shows details of every gym leader',
        type: 'FEATURE',
      },
      {
        description: 'New visual design for PokéStats Team tab',
        type: 'UPDATE',
      },
      {
        description: 'Removed locations from every game with no encounter tables',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 2.7.0',
    date: 1628226000000,
    notes: [
      {
        description:
          "Encounters now show accurate droptables, this can be turned off from Settings by showing all pokémon. IMPORTANT If you've visited this page before use the Reset Button to enable this feature Note this will delete existing encounter data",
        type: 'FEATURE',
      },
      {
        description:
          'Set Pokemon Yellow, Emerald, Platinum, Black/White 2 different level caps from the pencil next to the game selector. In the emerging window, select an option from Set Default',
        type: 'FEATURE',
      },
      {
        description: 'Various spelling fixes with location names',
        type: 'FIX',
      },
      {
        description:
          'On smaller screens replaced the Share, Add Encounter and Reset encounters options with a floating action button containing the same options',
        type: 'UPDATE',
      },
      {
        description: 'Removed most post game locations from Fire Red/Leaf Green',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 2.6.0',
    date: 1627794000000,
    notes: [
      {
        description: 'Show only missing encounters by enabling the option in Settings',
        type: 'FEATURE',
      },
      {
        description: 'Edit exisiting created rules',
        type: 'UPDATE',
      },
      {
        description: 'PWA implementation - now works offline',
        type: 'FEATURE',
      },
      {
        description: 'Various visual and responsive fixes',
        type: 'FIX',
      },
      {
        description: 'Icons for status options',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 2.5.0',
    date: 1627621200000,
    notes: [
      {
        description: 'Share option is now a button inside the tracker',
        type: 'UPDATE',
      },
      {
        description: 'New Team option in Status of pokémon. This links to the new Pokéstats Tab!',
        type: 'UPDATE',
      },
      {
        description:
          'Rules Tab - Create, edit and share custom rulesets for your nuzlocke or use some popular defaults',
        type: 'FEATURE',
      },
      {
        description:
          'PokéStats Tab - At a glance view of all captured, fainted, in-team, and failed to captured pokémon. Click on the pokémon to see more details!',
        type: 'FEATURE',
      },
      {
        description: 'Duplicate pokémon alert no longer shows up on failed encounters',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 2.4.0',
    date: 1627189200000,
    notes: [
      {
        description: 'More options to better report a bug or suggest a feature',
        type: 'UPDATE',
      },
      {
        description: 'Disabled inputs and placeholder if no game is selected',
        type: 'FIX',
      },
      {
        description: 'Sword and Shield edit level caps',
        type: 'UPDATE',
      },
      {
        description: 'Custom game Reset all fix',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 2.3.0',
    date: 1627016400000,
    notes: [
      {
        description: 'Report a bug or suggestion option!',
        type: 'FEATURE',
      },
      {
        description: 'Edit level caps for base games - from the pencil next to the game select',
        type: 'FEATURE',
      },
      {
        description: 'Nickname option for encounters - can be found in Settings',
        type: 'FEATURE',
      },
      {
        description: 'Yellow level cap adjustments',
        type: 'UPDATE',
      },
      {
        description: 'Several bug fixes related to eliminating encounter locations',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 2.2.0',
    date: 1626670800000,
    notes: [
      {
        description: 'BW2 Easy/Normal/Challenge mode level caps - separated by slashes',
        type: 'FEATURE',
      },
      {
        description: 'HGSS and GSC Level caps up till Red',
        type: 'UPDATE',
      },
      {
        description: 'New share option for copy and pasting',
        type: 'FEATURE',
      },
      {
        description: 'New settings option to enable duplicate clause - alerts on dupes!',
        type: 'FEATURE',
      },
      {
        description:
          'SWSH encounters/level caps bug fix - if it still does not appear please delete site cache from your browser (IMPORTANT this will delete your other encounters saved on the site)',
        type: 'FIX',
      },
    ],
  },
];

export default CHANGELOG;
