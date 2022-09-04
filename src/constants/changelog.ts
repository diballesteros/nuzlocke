import type { TReleaseNotes } from 'constants/types';

const CHANGELOG: TReleaseNotes = [
  {
    name: 'Version 5.2.1',
    date: 1662301999577,
    notes: [
      {
        description:
          'Fixed a bug where the app would crash when switching generations in the calculator',
        type: 'FIX',
      },
      {
        description: 'Fixed encounters for Route 119 in Ruby, Sapphire, and Emerald',
        type: 'FIX',
      },
      {
        description:
          'In order to see Route 16 or Lostlorn Forest for Black and White please reset all the encounters',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.2.0',
    date: 1661609675029,
    notes: [
      {
        description: 'Search now works with nicknames',
        type: 'UPDATE',
      },
      {
        description: 'Fire is no longer listed as having no effect on Ghost types',
        type: 'FIX',
      },
      {
        description: 'Flabébé should now correctly work with the calculator',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.5',
    date: 1657764871402,
    notes: [
      {
        description: 'Added the EXP share as a selectable item',
        type: 'FIX',
      },
      {
        description: 'Added Abundant Shrine as an encounter to BW2',
        type: 'FIX',
      },
      {
        description: 'Fixed National Park encounters for Heart Gold and Soul Silver',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.4',
    date: 1655340103831,
    notes: [
      {
        description: 'Fixed Route 112 encounters for ORAS',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.3',
    date: 1654655777582,
    notes: [
      {
        description: 'Fixed Route 112 encounters for ORAS',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 113 encounters for ORAS',
        type: 'FIX',
      },
      {
        description: "Fixed Roark's Onix's Ability for ORAS (It is now sturdy)",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.2',
    date: 1654547437623,
    notes: [
      {
        description: "Fixed Tynamo's evolution line",
        type: 'FIX',
      },
      {
        description: 'Fixed Route 104 encounters for ORAS',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 102 encounters for ORAS',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.1',
    date: 1654037686586,
    notes: [
      {
        description: 'Added small gender symbol to the pokemon in the tracker',
        type: 'UPDATE',
      },
      {
        description: 'Added Poni Wilds to USUM (needs reset to see)',
        type: 'FIX',
      },
      {
        description: "Fixed Suicune's typing",
        type: 'FIX',
      },
      {
        description: 'Added Heracross to Safari Zone encounters in ORAS',
        type: 'FIX',
      },
      {
        description: "Hide last updated date in nuzlocke backup window if it doesn't exist yet",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.1.0',
    date: 1653172680861,
    notes: [
      {
        description:
          'In case the calculator is an unrecoverable state a button has been added to reset it to the default state',
        type: 'UPDATE',
      },
      {
        description:
          'EV/IV inputs in the pokemon details can now be edited directly by typing in a value',
        type: 'UPDATE',
      },
      {
        description: 'Added Pinsir to Lush Jungle encounters in Sun and Moon',
        type: 'FIX',
      },
      {
        description: 'Fixed Dragonspiral Tower encounters in BW',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 5.0.0',
    date: 1652903071306,
    notes: [
      {
        description:
          'Added a way to back up your nuzlocke data online and access from other devices. This feature is in ALPHA. Please report any bugs you may find. This is accessible from the top right where the dark mode toggle used to be.',
        type: 'FEATURE',
      },
      {
        description: 'Darkmode toggle was moved to the settings page',
        type: 'UPDATE',
      },
      {
        description: 'Added Parfum Palace to encounters in X and Y (requires reset)',
        type: 'FIX',
      },
      {
        description: 'Added Sableye to Granite Cave in RSE and ORAS',
        type: 'FIX',
      },
      {
        description: 'Added headbutt encounters to Illex Forest in HGSS',
        type: 'FIX',
      },
      {
        description: 'Added headbutt encounters to Route 34 in HGSS',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.11',
    date: 1652708168548,
    notes: [
      {
        description: "Fixed Roxanne's pokemon's abilities in Omega Ruby and Alpha Sapphire",
        type: 'FIX',
      },
      {
        description: 'Fixed Pokemon Mansion encounters in RBY and FRLG',
        type: 'FIX',
      },
      {
        description: 'Fixed art mapping incorrectly for Marsh and Soul badges in RBY and FRLG',
        type: 'FIX',
      },
      {
        description: "Fixed Red's Blastoise's moveset in HGSS",
        type: 'FIX',
      },
      {
        description:
          "Changing the generation in the Calculator for custom games now reset's calculator values to due a bug that would cause the app the crash",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.10',
    date: 1652326223276,
    notes: [
      {
        description: 'Added Route 26 to Gold, Silver, and Crystal (requires an encounter reset)',
        type: 'FIX',
      },
      {
        description: 'Added Cliff Cave to Heart Gold and Soul Silver (requires an encounter reset)',
        type: 'FIX',
      },
      {
        description:
          'Selecting a pokemon that has no IVs/EVs will now set the IV/EV to 0 in the calculator',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.9',
    date: 1651871797363,
    notes: [
      {
        description:
          'Adjusted encounters for Team Magma Hideout and Team Aqua Hideout in Ruby, Sapphire, and Emerald.',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.8',
    date: 1651338690304,
    notes: [
      {
        description:
          'Fixed encounters for Cinnabar Island in Red, Blue, and Yellow and Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description: 'Fixed the color of button in the pokemon selector tooltip in light mode',
        type: 'FIX',
      },
      {
        description: 'Fixed encounters for Ecruteak City in HGSS',
        type: 'FIX',
      },
      {
        description: 'Added Route 26 to HGSS (Requires encounters reset to appear)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.7',
    date: 1650657707242,
    notes: [
      {
        description:
          'Added a tooltip in the Pokemon selector for added clarity on how to make all pokemon appear',
        type: 'UPDATE',
      },
      {
        description: 'Fixed encounters for Ten Carat Hills in Ultra Sun and Ultra Moon',
        type: 'FIX',
      },
      {
        description: 'Fixed encounters for Pallet Town in Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description: 'Removed Big Wave Beach from the encounters in Ultra Sun and Ultra Moon',
        type: 'FIX',
      },
      {
        description:
          'Fixed a bug where the app would crash when selecting Aegislash in the calculator',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.6',
    date: 1650120336488,
    notes: [
      {
        description: "Fixed Drayden's Drudigon's moveset in Challenge mode",
        type: 'FIX',
      },
      {
        description: 'Added Yamask Galarian Form',
        type: 'FIX',
      },
      {
        description:
          'Fixed a bug where the game would crash when selecting PSN Cure Berry as an item',
        type: 'FIX',
      },
      {
        description: "Fixed Vulpix's type in earlier generations",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.5',
    date: 1649374478404,

    notes: [
      {
        description: 'Resetting encounters also resets badges now',
        type: 'FIX',
      },
      {
        description:
          'Added Pewter City as a location in Red, Blue, and Yellow (requires a reset to encounters to see)',
        type: 'FIX',
      },
      {
        description: 'Added Zubat and Golbat to Iron Island encounters in BDSP',
        type: 'FIX',
      },
      {
        description: "Fixed Cranidos' level in Diamond, Pearl, and Platinum",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.4',
    date: 1648869568970,
    notes: [
      {
        description: 'Added outline to searchbar when its active',
        type: 'UPDATE',
      },
      {
        description:
          'To the person reporting missing encounters in the first gen games. Its not a waste of time. I appreciate every bug report and everyone using the app!',
        type: 'UPDATE',
      },
      {
        description: 'Fixed encounters for Route 4 in Red, Blue, and Yellow',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.3',
    date: 1648527206427,
    notes: [
      {
        description: "Fixed Bibarel's typing",
        type: 'FIX',
      },
      {
        description: 'Fixed Route 1 (Trainer school) encounters for Ultra Sun and Ultra Moon',
        type: 'FIX',
      },
      {
        description: 'Added Route 16 to X and Y (This requires a reset to all encounters to see)',
        type: 'FIX',
      },
      {
        description:
          'Added Honey tree encounters to Route 208, 209, 211, 212, 214, 222 and Eterna Forest in Brilliant Diamond and Shining Pearl',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.2',
    date: 1648207797540,
    notes: [
      {
        description: 'Fixed Route 24 encounters in Fire Red and Leaf Green',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.1',
    date: 1648066699394,
    notes: [
      {
        description: 'Added Aerodactyl to Ambrette town encounters in X and Y',
        type: 'FIX',
      },
      {
        description: 'Fixed Oreburgh City encounters in DPP and BDSP',
        type: 'FIX',
      },
      {
        description:
          'Added Happiny as an encounter in Hearthrome City  in Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.9.0',
    date: 1647346617887,
    notes: [
      {
        description:
          'Added a notes section which is accessible at the bottom from the pencil button. This is stored per game.',
        type: 'FEATURE',
      },
      {
        description: 'Added level text to encounter',
        type: 'UPDATE',
      },
      {
        description:
          'Added level up and down buttons to encounter for quick access. Note these only appears on larger screens',
        type: 'UPDATE',
      },
      {
        description: 'Encounters that have fainted now show up as grayed out',
        type: 'UPDATE',
      },
      {
        description:
          'The quick access list at the bottom now shows regardless of all encounters being completed',
        type: 'FIX',
      },
      {
        description:
          'Added Valor Cavern, Acuity Cavern, Spear Pillar, and Mining Museum encounters to BDSP and BDP (This requires a reset to all encounters to see).',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.8.3',
    date: 1646603938101,
    notes: [
      {
        description:
          'Added Route 16, Lostlorn Forest, and P2 Laboratory to the encounters for Black and White (This requires a reset to all encounters to see).',
        type: 'FIX',
      },
      {
        description: "Fixed the levels and movesets of Giovanni's team in Yellow",
        type: 'FIX',
      },
      {
        description:
          'Added Gamecorner encounters for Goldenrod City for Heart Gold and Soul Silver',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.8.2',
    date: 1646393856707,
    notes: [
      {
        description:
          'Added Eevee and game corner encounters to Celadon City in Red, Blue, and Yellow',
        type: 'FIX',
      },
      {
        description:
          'Added Scraggy and Darmanitan to encounters in Desert Resort in Black and White',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.8.1',
    date: 1646340625635,
    notes: [
      {
        description: 'Added Eevee as an encounter in Celadon City in FireRed and LeafGreen',
        type: 'FIX',
      },
      {
        description:
          'Fixed Marsh and Soul badge pointing to the wrong Gym leaders in FireRed and LeafGreen',
        type: 'FIX',
      },
      {
        description:
          'Added Pikachu as an encounter in Slateport City in Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.8.0',
    date: 1646095120885,
    notes: [
      {
        description:
          'Added question mark button next to ability selector to find added details on what the ability actually does.',
        type: 'FEATURE',
      },
      {
        description:
          'Just wanted to say thank you to everyone who uses the report a bug feature to send kind words for developing the app! I really appreciate it and it means a lot.',
        type: 'UPDATE',
      },
      {
        description: 'Increased the contrast of the color of the scrollbar on the badges',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 4.7.0',
    date: 1644277706865,
    notes: [
      {
        description:
          'You can now increment or decrement EV/IVs in the details by 1 with newly added buttons',
        type: 'UPDATE',
      },
      {
        description:
          'You can now edit pokemon details from the Teams Tab in the stats page by clicking the pencil button',
        type: 'UPDATE',
      },
      {
        description:
          'Added Meowth (Alolan) as an encounter to Malie Garden in Sun and Moon and Ultra Sun and Ultra Moon',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.6.0',
    date: 1643974875632,
    notes: [
      {
        description:
          'From the settings page you can now enable Soul Link functionality. Once the setting is enabled in the details of an encounter you can now select a soul link pokemon associated to the encounter',
        type: 'FEATURE',
      },
      {
        description:
          'Fixed a bug with the level and met level inputs where it was possible to input invalid characters',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.5.0',
    date: 1643809787295,
    notes: [
      {
        description:
          'You can now directly edit a pokemons EVs/IVs from their details (clicking the pencil icon in the encounter entry) under the Stats section',
        type: 'FEATURE',
      },
      {
        description: 'Added small tooltip to the calculator to explain how Show my Pokemon works',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 4.4.9',
    date: 1643576683241,
    notes: [
      {
        description:
          'Added game corner purchases to Celadon City encounters in Fire Red and Leaf Green',
        type: 'FIX',
      },
      {
        description:
          'Move selector now shows moves respective to that generation (not applicable to custom games)',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.8',
    date: 1643373757644,
    notes: [
      {
        description: 'Fixed encounters for route 210 in Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
      {
        description:
          'Added Drifloon as an encounter in Valley Windworks in Diamond, Pearl, and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.7',
    date: 1643233523198,
    notes: [
      {
        description: 'Fixed Togekiss and Togetic typing in games before Fairy was introduced',
        type: 'FIX',
      },
      {
        description: 'Fainted pokemon now count towards the dupes',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.6',
    date: 1643068534175,
    notes: [
      {
        description:
          'Fixed encounters for Route 103 and Route 124 for Omega Ruby and Alpha Sapphire',
        type: 'FIX',
      },
      {
        description: "Fixed Taillow and Swellow's evolution line",
        type: 'FIX',
      },
      {
        description: "Fixed Glameow and Purugly's evolution line",
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.5',
    date: 1642866238646,
    notes: [
      {
        description:
          'Fixed a crash when assigning amulet coin as an item and opening the calculator',
        type: 'FIX',
      },
      {
        description: 'Added Soothe Bell as a selectable item',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.4',
    date: 1642765220441,
    notes: [
      {
        description: 'Added Mime Jr. to encounters for Route 210 and Trophy Garden in BDSP',
        type: 'FIX',
      },
      {
        description: 'Added Mime Jr. to encounters for Route 210 in Diamond, Pearl and Platinum',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.3',
    date: 1642596533630,
    notes: [
      {
        description: 'Small update to error tracking in the Calculator',
        type: 'UPDATE',
      },
    ],
  },
  {
    name: 'Version 4.4.2',
    date: 1642530601617,
    notes: [
      {
        description: 'Added amulet coin to selectable items',
        type: 'UPDATE',
      },
      {
        description: 'Pokemon now show up as dupes for the entire evolution line',
        type: 'UPDATE',
      },
      {
        description:
          'Nature, Gender, Ability, and Item selectors now only show for the appropiate generations',
        type: 'UPDATE',
      },
      {
        description:
          'Added Sandy Cave as an encounter in Ultra Sun and Ultra Moon, encounters must be reset for them to appear',
        type: 'FIX',
      },
      {
        description: 'Fixed evolution line for Doduo and Dodrio',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.1',
    date: 1641507134643,
    notes: [
      {
        description:
          'Included a small update in the About section with a link that explains how the data storage works (and has always worked)',
        type: 'UPDATE',
      },
      {
        description:
          'Fixed where Moltres is located in FireRed and LeafGreen. Moved from Victory Road to Mt Ember in the Sevii Islands',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.4.0',
    date: 1641420227154,
    notes: [
      {
        description: 'Added informational message about how data for the tracker is stored',
        type: 'UPDATE',
      },
      {
        description:
          'Added Route 47, 48 and Safari Zone to Heart Gold and Soul Silver, encounters must be reset for them to appear',
        type: 'FIX',
      },
      {
        description: 'Fixed the evolution chain for Nosepass and Probopass',
        type: 'FIX',
      },
      {
        description:
          'Added Togepi as an encounter in Eterna City as you can get the egg from there',
        type: 'FIX',
      },
      {
        description: 'Fixed localization for the "Reset Encounters" label in smaller screens',
        type: 'FIX',
      },
      {
        description: 'Fixed encounters for Route 4 for Black and White 2',
        type: 'FIX',
      },
      {
        description:
          'Added Hidden Grotto as an encounter for Black and White 2, encounters must be reset for them to appear',
        type: 'FIX',
      },
      {
        description: 'Fixed Route 24 encounters for FireRed and LeafGreen',
        type: 'FIX',
      },
    ],
  },
  {
    name: 'Version 4.3.1',
    date: 1640782623391,
    notes: [
      {
        description:
          'Fix to new version causing some crashs on the stats and tracker screen for some users',
        type: 'FIX',
      },
    ],
  },
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
