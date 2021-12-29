import type { TReleaseNotes } from 'constants/types';

const CHANGELOG: TReleaseNotes = [
  {
    name: 'Version 4.3.0',
    date: 1640782623391,
    notes: [
      {
        description: 'Added quick access buttons for the nature in the Tracker',
        type: 'FEATURE',
      },
      {
        description: 'Added Wedlocke ruleset to the rules options',
        type: 'UPDATE',
      },
      {
        description: 'Badges can now be activated/unactivated independently of it being in order',
        type: 'UPDATE',
      },
      {
        description:
          'Pokemon whose types were changed after Fairy was introduced now show the correct typing in earlier games',
        type: 'UPDATE',
      },
      {
        description:
          'If you have set a preference for reduced motion the app will have reduced animations',
        type: 'UPDATE',
      },
      {
        description: 'Fixed encounters for Route 42 in Heart Gold and Soul Silver',
        type: 'FIX',
      },
      {
        description:
          'Tracker should now display correctly on Firefox when configured with different text sizes',
        type: 'FIX',
      },
      {
        description: 'App should no longer zoom on text inputs on iOS',
        type: 'FIX',
      },
      {
        description: "Fixed Igglybuff's typing",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.2.0',
    date: 1640536181278,
    notes: [
      {
        description: 'Added small tooltip on the calculator to help understand the result',
        type: 'UPDATE',
      },
      {
        description: 'Added more keyboard navigation options for the tracker and calculator',
        type: 'UPDATE',
      },
      {
        description: 'Added a small tooltip for duplicate pokemon',
        type: 'UPDATE',
      },
      {
        description:
          'Most inputs now have a max-length for the amount of characters. This is for a future update! No current text was modified',
        type: 'UPDATE',
      },
      {
        description:
          "'No move selected' is now correctly translated in German and Spanish in the calculator",
        type: 'FIX',
      },
      {
        description: 'Fixed encounters for Route 3 in Black and White',
        type: 'FIX',
      },
      {
        description: 'Added Honey tree encounters for Route 205 in Diamond, Pearl and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.1.0',
    date: 1640211458740,
    notes: [
      {
        description: 'Added Soulocke/Soul link ruleset to the rules options',
        type: 'UPDATE',
      },
      {
        description:
          'Badge level caps for the default games have been reset for everyone. Sorry for the inconvenience but this is crucial for a future update. As a result the exported file size is now about 90% smaller!',
        type: 'UPDATE',
      },
      {
        description:
          'Shiny is no longer a status and now appears as a toggleable status in the details. This now changes the sprite of the pokemon!',
        type: 'UPDATE',
      },
      {
        description:
          'Items now have a sprite in the item dropdown in the calculator, builder and details',
        type: 'UPDATE',
      },
      {
        description:
          'The inputs and dropdowns in the details, calculator and team builder now change according to dark mode',
        type: 'UPDATE',
      },
      {
        description: 'Added item sprite to details page for every battle (where applicable)',
        type: 'UPDATE',
      },
      {
        description: 'App no longer crashes when using Mr. Mime (Galarian) in the calculator',
        type: 'FIX',
      },
      {
        description:
          'Back button now displayed correctly on smaller screens in the Report Page - Thanks @Yondiame',
        type: 'FIX',
      },
      {
        description:
          'Added Berry Fields encounter to Ultra Sun and Ultra Moon (with Crabrawler as the encounter)',
        type: 'FIX',
      },
      {
        description:
          "Added Farfetch'd as an encounter in Vermillion City in FireRed and LeafGreen and Red, Blue and Yellow",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.0.0',
    date: 1639779207340,
    notes: [
      {
        description:
          'New button on every encounter to quickly swap a pokemon in and out of the team',
        type: 'FEATURE',
      },
      {
        description:
          'New button at the bottom of the tracker to quickly scroll down to the last missing encounter',
        type: 'FEATURE',
      },
      {
        description: 'Duplicate pokemon are now highlighted in the selector',
        type: 'FEATURE',
      },
      {
        description: 'Base stats are now viewable in the details for every gym battle',
        type: 'FEATURE',
      },
      {
        description:
          'New Button at the bottom of the tracker to scroll to any encounter as well as some quick stats',
        type: 'FEATURE',
      },
      {
        description: 'Status is now disabled until a pokemon is selected',
        type: 'UPDATE',
      },
      {
        description:
          'Broken rule alerts on the tracker now appear in the top right corner of the pokemon',
        type: 'UPDATE',
      },
      {
        description:
          "Changed the way the calculator works so now fields don't get cleared when you change the pokemon",
        type: 'UPDATE',
      },
      {
        description:
          'Fixed a bug in the damage calculator where dynamaxing the attacker would apply to the defender as well and it was not possible to dynamax the defender',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.5',
    date: 1639427729954,
    notes: [
      {
        description:
          'Added Wild Area Station to possible encounters for Sword and Shield (This requires a "reset to all encounters" to see)',
        type: 'UPDATE',
      },
      {
        description: 'Fixed Route 205 encounters for Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
      {
        description: 'Fixed Union Cave encounters for Heart Gold and Soul Silver',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.4',
    date: 1639343700325,
    notes: [
      {
        description:
          'Fixed Route 222 and Sunyshore City encounters for Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.3',
    date: 1639168419855,
    notes: [
      {
        description: 'Fixed Fuego Ironworks encounters in Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.2',
    date: 1638997697782,
    notes: [
      {
        description: 'Updated the way copying text works when sharing rules or encounters',
        type: 'UPDATE',
      },
      {
        description: 'Added Onix to Wayward Cave encounter in Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.1',
    date: 1638754449199,
    notes: [
      {
        description: 'Fixed how moves would appear in the Stats page if it had a lot of letters',
        type: 'FIX',
      },
      {
        description: "Fixed moveset for Roark's geodude",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.17.0',
    date: 1638717629294,
    notes: [
      {
        description:
          'When you create a game you can now select a base game to copy over the same encounters',
        type: 'FEATURE',
      },
      {
        description:
          'Fixed the bug that would cause the app to crash when using mega evolution stones in the calculator in some cases',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.16.0',
    date: 1638404552987,
    notes: [
      {
        description: 'Can now create custom statuses from the settings page',
        type: 'FEATURE',
      },
      {
        description:
          'Encounters now have a button with a popup with most former options and now two items to increase and decrease level',
        type: 'FEATURE',
      },
      {
        description:
          'Added Gen 2 starters to Littleroot Town encounter in Ruby, Sapphire, and Emerald',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.15.1',
    date: 1638074012441,
    notes: [
      {
        description: 'Added Route 14 to Black and White 2',
        type: 'UPDATE',
      },
      {
        description:
          'Fixed the ability to delete Brilliant Diamond and Shining Pearl. If you happened to delete the game it should reappear now',
        type: 'FIX',
      },
      {
        description: 'Added fossil encounters to Rustboro City for Ruby, Sapphire, and Emerald',
        type: 'FIX',
      },
      {
        description: 'Added underwater encounters to Route 124/126 for Ruby, Sapphire, and Emerald',
        type: 'FIX',
      },
      {
        description: 'Fixed Tangela/Tangrowth evolution line',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.15.0',
    date: 1638012419619,
    notes: [
      {
        description:
          'App is now available in german and spanish, can be changed from the settings page',
        type: 'FEATURE',
      },
      {
        description: 'App is now available for iOS in the App store!',
        type: 'UPDATE',
      },
      {
        description:
          'Added Trophy Garden to encounter list for Brilliant Diamond and Shining Pearl',
        type: 'UPDATE',
      },
      {
        description: "Added Pikachu to starter's list for Red, Blue and Yellow",
        type: 'FIX',
      },
      {
        description: "Changed Norman's second pokemon from Slaking to Vigoroth in Emerald",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.14.2',
    date: 1637597204585,
    notes: [
      {
        description:
          'Fix for when the app would sometimes crash checking the coverage in Team Builder for older generation games',
        type: 'FIX',
      },
      {
        description: 'Added Spiritomb to Route 209 encounters',
        type: 'FIX',
      },
      {
        description: 'Added encounters to Grand Underground',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.14.1',
    date: 1637597204585,
    notes: [
      {
        description:
          'New coverage tab in the Builder! This shows what strengths and weaknesses of the current built team',
        type: 'FEATURE',
      },
      {
        description: 'Fixed evolution line of Pidove, Tranquil and Unfezant',
        type: 'FIX',
      },
      {
        description: 'Added starters to Lake Verity in Brilliant Diamond and Shining Pearl',
        type: 'FIX',
      },
      {
        description: 'Added Pokémon Mansion to Brilliant Diamond and Shining Pearl encounters',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.14.0',
    date: 1637421850005,
    notes: [
      {
        description:
          'Added Brilliant Diamond and Shining Pearl with all caps, details and encounters! Some may be missing so please send in any missing info through the Report functionality',
        type: 'FEATURE',
      },
      {
        description:
          "Dropdown for gym leader in the calculator now always show until Show all is disabled to make it more clear it's an option",
        type: 'UPDATE',
      },
      {
        description: "Fixed all occurrences of Farfetch'd in encounters across all games",
        type: 'FIX',
      },
      {
        description: "Cynthia's Roserade now correctly has Poison Point as the ability",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 3.13.0',
    date: 1636415060205,
    notes: [
      {
        description:
          'Custom level caps for added games (Not available for base games)! Can be added and edited by the pencil in the top bar for custom games',
        type: 'FEATURE',
      },
      {
        description:
          "Standardized the styling of the app so now it looks more consistent. Also, the app is more accessible, correctly adjusting to the device's font size.",
        type: 'UPDATE',
      },
    ],
  },
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
