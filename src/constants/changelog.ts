import { TReleaseNotes } from 'constants/types';

const CHANGELOG: TReleaseNotes = [
  {
    name: 'Version 3.12.2',
    date: 1636415060205,
    notes: [
      {
        description:
          'Fixed an error causing the app to crash when deleting a move from the defender in the calculator',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.12.1',
    date: 1636207154586,
    notes: [
      {
        description:
          'Fixed suggestions not working for some types and some suggestions. This caused the app to crash in some situations.',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.12.0',
    date: 1636149509458,
    notes: [
      {
        description:
          'Encounter suggestions! In encounter lists offensive-minded compliments to your team (Pokemon with the current status of Team) will appear as a suggested encounter at the top of the list. This feature can be turned off in the settings.',
        type: 'FEATURE',
      },
      {
        description: 'Fixed Route 4 encounters for Heart Gold and Soul Silver',
        type: 'FIX',
      },
      {
        description: 'Fixed type effectiveness for GRASS and POISON types',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.11.0',
    date: 1635333468470,
    notes: [
      {
        description:
          'Added button to export pokémon to different game (useful for genlockes!). Can be found in the pokémon details popup',
        type: 'FEATURE',
      },
      {
        description:
          'Improved error tracking for the app. This uses a cookie to track errors and send them to the server',
        type: 'UPDATE',
      },
      {
        description: 'Style fixes for moves in stats tab on smaller screens',
        type: 'FIX',
      },
      {
        description: 'Added Amaura to Ambrette Town encounter in X and Y',
        type: 'FIX',
      },
      {
        description:
          'Show all toggle should no longer appear on top of the field settings in the calculator',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.10.0',
    date: 1634784076107,
    notes: [
      {
        description:
          '[BETA] Damage Calculator! This comes fully integrated with the app, check out your entire caught collection of pokemon (excluding fainted) as available options or optionally calculate damage with any pokemon.',
        type: 'FEATURE',
      },
      {
        description: 'Check out badge detail/level cap gym leaders inside of the calculator!',
        type: 'FEATURE',
      },
      {
        description: 'Various dark mode fixes',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.9.3',
    date: 1634495380559,
    notes: [
      {
        description: "Fixed moveset for Clair's Gyarados in Heart Gold and Soul Silver",
        type: 'FIX',
      },
      {
        description: 'Omega Ruby and Alpha Sapphire Route 110 encounters fix',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.9.2',
    date: 1633655488519,
    notes: [
      {
        description: 'Responsive fix for team tip in the Stats tab on smaller screens',
        type: 'FIX',
      },
      {
        description: 'Omega Ruby and Alpha Sapphire Route 101 encounters fix',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.9.1',
    date: 1633405396418,
    notes: [
      {
        description:
          'Encounters no longer have to be reset to see the latest encounter tables! Rejoice!',
        type: 'UPDATE',
      },
      {
        description: 'Added horde/ambush encounters for all respective X and Y encounters',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.9.0',
    date: 1633295020079,
    notes: [
      {
        description:
          'Import PkHeX tables to automatically populate the tracker. Click on Import in the sidebar to see how it works!',
        type: 'FEATURE',
      },
      {
        description: 'Relocated "Edit Badges" button on smaller screens',
        type: 'UPDATE',
      },
      {
        description:
          'Included a tip to indicate what status is needed for the pokemon to show up in the respective Stats tab',
        type: 'UPDATE',
      },
      {
        description:
          'HeartGold and SoulSilver routes were incorrectly mapped to regular Gold and Silver (Reset all encounters to see)',
        type: 'FIX',
      },
      {
        description:
          'Added Bug Catching Contest encounters to National Park in Gold, Silver and Crystal (Reset all encounters to see)',
        type: 'FIX',
      },
      {
        description:
          'Added missing encounters to Route 4, 6, 7 and 8 for X and Y (Reset all encounters to see)',
        type: 'FIX',
      },
      {
        description: 'Sidebar now correctly dims the rest and closes when selecting an option',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.8.0',
    date: 1632702001639,
    notes: [
      {
        description:
          'Notifications! These should pop up when breaking rules and on a variety of actions',
        type: 'FEATURE',
      },
      {
        description:
          'Added button to pokemon details that lets you directly export it to the Team Builder',
        type: 'FEATURE',
      },
      {
        description:
          'Tracker now has a filter for generation/type! As a reminder the searchbar also works for status',
        type: 'FEATURE',
      },
      {
        description: 'Creating a game now automatically selects it',
        type: 'UPDATE',
      },
      {
        description: 'See more button for Changelog',
        type: 'UPDATE',
      },
      {
        description: 'Added button to directly go to Settings page from tracker',
        type: 'UPDATE',
      },
      {
        description: 'Fixed stats for older custom games',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.7.1',
    date: 1632269766819,
    notes: [
      {
        description: 'Spinarak should now show up in all locations where it can be found',
        type: 'FIX',
      },
      {
        description:
          'Mawile, Sableye and Nosepass now show up in Granite Cave for Ruby, Sapphire, Emerald, OmegaRuby and AlphaSapphire (Reset all encounters to see)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.7.0',
    date: 1632193286534,
    notes: [
      {
        description: 'Now available on the Amazon Appstore',
        type: 'FEATURE',
      },
      {
        description:
          "Summary image display settings now save per game so they don't have to be re-entered everytime",
        type: 'FEATURE',
      },
      {
        description: 'Loading icon when generating the summary image',
        type: 'UPDATE',
      },
      {
        description: 'Summary image is now much more responsive on smaller screens',
        type: 'UPDATE',
      },
      {
        description:
          'Added Route 46 to HeartGold, SoulSilver, Gold, Silver and Crystal (Reset all encounters to see)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.6.3',
    date: 1631847543576,
    notes: [
      {
        description:
          'Custom encounters can now be edited properly in SW/SH (They will have to be remade for this to take effect)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.6.0',
    date: 1631750976504,
    notes: [
      {
        description: 'Revamped interface for better accessibility and mobile responsiveness',
        type: 'UPDATE',
      },
      {
        description: 'Dark mode now applies to modals',
        type: 'UPDATE',
      },
      {
        description:
          'Sword and Shield: Rookidee should now show up on Route 1 (Encounters must be reset for this to be seen)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.5.0',
    date: 1630617340278,
    notes: [
      {
        description:
          'Revamped share button for the tracker, rules and summary sections can now share directly to various social media apps or other apps.(REQUIREMENT: Safari 15 or later on macOS and iOS. Chrome 75 or later on Android, and 89 or later on Chrome OS and Windows.)',
        type: 'FEATURE',
      },
      {
        description: 'Various accessibility fixes for buttons and icons',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.4.0',
    date: 1630551581923,
    notes: [
      {
        description: 'New Team Builder - access from Builder tab - create your ideal team!',
        type: 'FEATURE',
      },
      {
        description: "Click on a pokemon type (new look!) to see a breakdown of it's effectiveness",
        type: 'FEATURE',
      },
      {
        description: 'Click on question mark next to nature to see nature chart',
        type: 'FEATURE',
      },
      {
        description: 'Fixed share rules text formatting',
        type: 'FIX',
      },
      {
        description: 'Fixed bug when typing inside report option',
        type: 'FIX',
      },
      {
        description: 'App is now available on Google Play',
        type: 'UPDATE',
      },
      {
        description: 'Changed top left menu into a sidebar',
        type: 'UPDATE',
      },
      {
        description: 'Split about and changelog sections',
        type: 'UPDATE',
      },
      {
        description:
          'Revamped Pokemon details - now with more dynamic move selector and expandable sections',
        type: 'UPDATE',
      },
      {
        description: 'New icons for app',
        type: 'UPDATE',
      },
    ],
  },
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
        description: 'App is now available in the Microsoft Store',
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
