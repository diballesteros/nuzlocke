## Version 3.10.0

🚀 New features

- [BETA] Damage Calculator! This comes fully integrated with the app, check out your entire caught collection of pokemon (excluding fainted) as available options or optionally calculate damage with any pokemon
- Export gym opponent to damage calculator from the badge details!

💅 Enhancement

- Various performance improvements
- Styled primary buttons in modals

🐛 Bug Fix

- Darkmode now correctly applies to display settings popup in Stats

🏠 Internal

- Updated PR templates to use comments for instruction text
- Bumped Zustand to 3.5.13
- Bumped html-to-image to 1.9.0
- Added react-hook-form to 7.17.2
- Bumped @testing-library/react 12.1.12
- Bumped @testing-library/user-event 13.5.0
- Bumped @types/react 17.0.30
- Bumped @types/react-router-dom 5.3.1
- Bumped @types/node to 16.11.1
- Bumped cypress to 8.6.0
- Bumped Typescript to 4.4.4
- Bumped sass-loader to 12.2.0
- Bumped @typescript-eslint/eslint-plugin 5.1.0
- Bumped @typescript-eslint/parser 5.1.0
- Bumped eslint-plugin-import to 2.25.2

## Version 3.9.3

🐛 Bug Fix

- Fixed moveset for Clair's Gyarados in Heart Gold and Soul Silver
- Omega Ruby and Alpha Sapphire Route 110 encounters fix

## Version 3.9.2

🐛 Bug Fix

- Responsive fix for team tip in the Stats tab on smaller screens
- Omega Ruby and Alpha Sapphire Route 101 encounters fix

## Version 3.9.1

💅 Enhancement

- Encounters no longer have to be reset to see the latest encounter rates! Rejoice!

🐛 Bug Fix

- Added horde/ambush encounters for all respective X and Y encounters

## Version 3.9.0

🚀 New features

- Import PkHeX tables to automatically populate the tracker. Click on Import in the sidebar to see how it works!

🐛 Bug Fix

- HeartGold and SoulSilver routes were incorrectly mapped to regular Gold and Silver (Reset all encounters to see)
- Added Bug Catching Contest encounters to National Park in Gold, Silver and Crystal (Reset all encounters to see)
- Added missing encounters to Route 4, 6, 7 and 8 for X and Y (Reset all encounters to see)
- Sidebar now correctly dims the screen and closes when selecting an option

💅 Enhancement

- Relocated "Edit Badges" button on smaller screens
- Included a tip to indicate what status is needed for the pokemon to show up in the respective Stats tab

🏠 Internal

- Bumped Zustand to 3.5.12
- Bumped @testing-library/react to 12.1.1
- Bumped @types/lodash 4.14.175
- Bumped @types/node 16.10.2
- Bumped @types/react 17.0.26
- Bumped @types/react-router-dom 5.3.0
- Bumped @typescript-eslint/eslint-plugin 4.32.0
- Bumped @typescript-eslint/parser 4.32.0
- Bumped cypress to 8.5.0
- Bumped @eslint-plugin-react 7.26.1
- Bumped semantic-ui-react 2.0.4
- Updated README
- Added Emojis to main.yml

## Version 3.8.0

🚀 New features

- Notifications! These should pop up when breaking rules and on a variety of actions
- Added button to pokemon details that lets you directly export it to the Team Builder
- Tracker now has a filter for generation/type! As a reminder the searchbar also works for status

🐛 Bug Fix

- Fixed stats for older custom games

💅 Enhancement

- Creating a game now automatically selects it
- See more button for Changelog
- Added button to directly go to Settings page from tracker

🏠 Internal

- Added react-toastify 8.0.3

## Version 3.7.1

🐛 Bug Fix

- Spinarak should now show up in all locations where it can be found
- Mawile, Sableye and Nosepass now show up in Granite Cave for Ruby, Sapphire, Emerald, OmegaRuby and AlphaSapphire

## Version 3.7.0

🚀 New features

- App now available on the Amazon AppStore
- Summary image display settings now save per game so they don't have to be re-entered everytime

🐛 Bug Fix

- Added Route 46 to HeartGold, SoulSilver, Gold, Silver and Crystal

💅 Enhancement

- Loading icon when generating the summary image for sharing
- Summary image is now much more responsive on smaller screens

🏠 Internal

- Bumped html-to-image to 1.8.5
- Bumped @types/lodash to 4.14.173
- Bumped @types/node to 16.9.2
- Bumped @types/react to 17.0.21
- Bumped @types/react-router-dom to 5.1.9
- Bumped cypress to 8.4.1
- Bumped node-sass to 6.0.1
- Added sass-loader 12.1.0

## Version 3.6.3

🐛 Bug Fix

- Custom encounters can now be edited properly in SW/SH (They will most likely have to be remade)

🏠 Internal

- Improved workflow to include firefox tests in parallel
- Included code coverage
- Added @cypress/code-coverage 3.9.11
- Added @cypress/instrument-cra 1.4.0

## Version 3.6.2

🐛 Bug Fix

- Show rookidee on Route 1 encounter in Sword and Shield
- Improved error management

## Version 3.6.0

💅 Enhancement

- Revamped interface for better accessibility and mobile responsiveness
- Dark mode now applies to modals

🏠 Internal

- Added react-router 5.3.0
- Bumped cypress to 8.4.0
- Bumped @types/node to 16.9.1
- Bumped @types/react to 17.0.20
- Bumped @typescript-eslint/eslint-plugin to 4.31.1
- Bumped @typescript-eslint/parser to 4.31.1

## Version 3.5.0

🚀 New features

- Share button in the tracker, rules and summary sections can now share directly to various social media apps or other apps.
  - Safari 15 or later on macOS and iOS.
  - Chrome 75 or later on Android, and 89 or later on Chrome OS and Windows.

🐛 Bug Fix

- Various accessibility fixes

## Version 3.4.1

🚀 New features

- Revamped pokémon selector

🐛 Bug Fix

- Fixed type selection in selector window

📝 Documentation

- README updates

## Version 3.4.0

🚀 New features

- New Team Builder - access from Builder tab - create your ideal team!
- Click on type to see a breakdown of the effectiveness
- Click on question mark next to nature to see nature chart
- App is now available on Google Play

🐛 Bug Fix

- Fixed share rules text formatting
- Fixed bug when typing inside report option

💅 Enhancement

- Changed top left menu into a sidebar - @RyoMasumura1201
- Split about and changelog - @RyoMasumura1201
- Pokemon details now has expandible sections
- Pokemon details move selector revamped
- Revamped the look of pokemon types
- New icons for app

📝 Documentation

- README updates
- Included pull request template
- CONTRIBUTING updates

🏠 Internal

- Bumped immer to 9.0.6
- Bumped @types/node to 16.7.10
- Bumped @typescript-eslint/eslint-plugin to 4.30.0
- Bumped @typescript-eslint/parser to 4.30.0
- Bumped eslint-plugin-react to 7.25.1

## Version 3.3.0

🚀 New features

- New smart rule option - add custom logic to rules which then alerts if they're being broken in the tracker
- Revamped look of about section, included link for Microsoft Store

💅 Enhancement

- Added default rulesets for Genlockes, Egglockes and Wonderlockes
- Error handling improvements
- New sections in summary page to show all fainted and boxed pokemon

📝 Documentation

- README updates

🏠 Internal

- Bumped zustand to 3.5.10
- Bumped @types/node to 16.7.4
- Bumped @typescript-eslint/eslint-plugin to 4.29.3
- Bumped @typescript-eslint/parser to 4.29.3
- Bumped cypress to 8.3.1
- Bumped eslint-plugin-import to 2.24.2

## Version 3.2.1

🚀 New features

- New buttons in footer and about section to support project. Completely **optional**
- The app will soon be available on Google Play and Microsoft Store

💅 Enhancement

- Various adjustments for performance

📝 Documentation

- README updates

## Version 3.2.0

🚀 New features

- Rematch information for Elite 4 for HGSS in badge details

🐛 Bug Fix

- Fixed Route 114 encounters for Ruby, Sapphire, Emerald, Omega Ruby and Alpha Sapphire
- Summary image cards now adapt to full size of row incase something is hidden
- Bruno HGSS detail fixes

💅 Enhancement

- Various adjustments for performance
- New alert when team has over 6 pokémon
- Usability improvements to scrolling on mobile

📝 Documentation

- README updates
- SECURITY updates

🏠 Internal

- Included Docker files

## Version 3.1.0

🚀 New features

- Evolve pokémon - button to the right of the pokémon name that lets you evolve or devolve
- Record your encounters with detailed information, including: pokemon, level, gender, ability, nature, item and more
- Summary Tab in **PokéStats** - Includes downloadable and customizable summary image

🐛 Bug Fix

- Various spelling fixes in About and ReadMe
- Fix to correctly show the selected pokémon if the location filter is enabled and it is not found in the filtered list
- Fixed Route 19 encounters for Red, Blue and Yellow

💅 Enhancement

- Twitter link
- Styling change for gym details button
- Included encounter details in the pokemon popup in the PokéStats tab

📝 Documentation

- README updates

🏠 Internal

- Added html-to-image 1.7.0
- Bumped zustand to 3.5.9
- Bumped @types/node to 16.7.1
- Bumped @typescript-eslint/eslint-plugin to 4.29.2
- Bumped @typescript-eslint/parser to 4.29.2
- Bumped @types/react to 17.0.19
- Bumped cypress to 8.3.0
- Bumped eslint-plugin-import to 2.24.1
- Bumped eslint-plugin-prettier to 3.4.1

## Version 3.0.0

🚀 New features

- Nickname generator - Generate a random word or reorder the letters of the pokémon's name
- Gym leader details - New button that shows details of every gym leader

🐛 Bug Fix

- Various spelling fixes with location names

💅 Enhancement

- Red, blue and yellow: Removed Pewter city and Lavendar town
- Gold, silver and crystal: Removed Mahogany town, Indigo Plateau and Saffron City. Reworked Rocket HQ and Goldenrod city.
- Fire Red and Leaf Green: Removed Pewter City and Lavendar town. Reworked SS Anne.
- Ruby, sapphire and emerald: Removed Evergrande city. Reworked Altering Cave, Fortree city, Safari zone and Magma Hideout.
- Diamond, pearl and platinum: Removed Sandgem town, Jubilife City, Floaroma town and Solaeceon Town. Reworked Oreburgh city, Floaroma meadow.
- Heart gold and Soul Silver: Removed Mahogany town and Indigo Plateau. Reworked Goldenrod City and Rocket HQ.
- Black and white: Removed Nimbasa City, Mistralton City and Opelucid City, Reworked Floccessy Town, Castelia City, Nacrene City.
- Black and White 2: Removed Mistralton City. Reworked Aspertia City and Flocessy Town.
- X and Y: Reworked Santalune City, Camphrier Town, Geosenge Town, Sea spirit's den and Snowbelle City
- Omega Ruby and Alpha Sapphire: Removed Altering Cave, Evergrande City. Reworked Safari Zone, Mirage Island, Team Magma/Aqua Hideout, Fortree City.
- Sun and Moon: Removed berry fields
- Ultra Sun and Ultra Moon: Removed Berry fields
- New visual design for PokéStats Team tab

🏠 Internal

- Bumped zustand to 3.5.8
- Bumped @types/node to 16.6.1
- Bumped @typescript-eslint/eslint-plugin to 4.29.1
- Bumped @typescript-eslint/parser to 4.29.1
- Bumped @types/react to 17.0.17
- Bumped eslint-plugin-import to 2.23.4

## Version 2.7.1

🐛 Bug Fix

- Positioning fix for FAB
- Prop fix for Reset encounters button

📝 Documentation

- README updates

## Version 2.7.0

🚀 New features

- Encounters now show accurate droptables, this can be turned off from **Settings** by showing all pokémon. **IMPORTANT** If you've visited this page before use the **Reset Button** to enable this feature Note this will delete existing encounter data
- Set Pokemon Yellow, Emerald, Platinum, Black/White 2 different level caps from the **pencil** next to the game selector. In the emerging window, select an option from **Set Default**

🐛 Bug Fix

- Split level caps for Yellow, Emerald and Platinum
- Various spelling fixes with location names

💅 Enhancement

- On smaller screens replaced the Share, Add Encounter and Reset encounters options with a floating action button containing the same options
- Removed most post game locations from Fire Red/Leaf Green

🏠 Internal

- Bumped @typescript-eslint/eslint-plugin to 4.29.0
- Bumped @typescript-eslint/parser to 4.29.0
- Bumped @types/node to 16.4.13
- Bumped @types/react to 17.0.16
- Bumped cypress to 8.2.0

## Version 2.6.1

🐛 Bug Fix

- Accessibility fixes for github link
- Accessiblity fixes for pokemon images

💅 Enhancement

- Masked icon for PWA
- Improved icons for PWA

## Version 2.6.0

🚀 New features

- Show only missing encounters by enabling the option in **Settings**
- Edit already created rules
- PWA implementation
- Initial analytics implementation

🐛 Bug Fix

- Responsive fixes for header
- Format fix for sitemap

💅 Enhancement

- Close windows by clicking on the overlay
- Icons for status options

🏠 Internal

- Bumped Cypress to 8.1.0
- Bumped Eslint to 7.32.0
- Bumped @types/node to 16.4.10

## Version 2.5.1

🐛 Bug Fix

- Fix to form field connection to Netlify

💅 Enhancement

- Meta tag updates
- Footer and header included in page
- Changed location of **Github** link to footer

📝 Documentation

- Changelog
- Contribution guide
- Code of Conduct
- Change of license

## Version 2.5.0

🚀 New features

- Rules Tab - Create, edit and share custom rulesets for your nuzlocke or use some popular defaults
- PokéStats Tab - At a glance view of all captured, fainted, in-team, and failed to captured pokémon. Click on the pokémon to see more details!
- New Team option in Status of pokémon. This links to the new Pokéstats Tab!

🐛 Bug Fix

- Duplicate pokémon alert no longer shows up on failed encounters

💅 Enhancement

- Share option is now a button inside the tracker

## Version 2.4.0

🐛 Bug Fix

- Sword and Shield edit level caps
- Custom game Reset all fix

💅 Enhancement

- More options to better report a bug or suggest a feature
- Disabled inputs and placeholder if no game is selected

## Version 2.3.0

🚀 New features

- Nickname option for encounters - can be found in Settings
- Edit level caps for base games - from the pencil next to the game select
- Report a bug or suggestion option!

🐛 Bug Fix

- Yellow level cap adjustments
- Several bug fixes related to eliminating encounter locations

## Version 2.2.0

🚀 New features

- New share option for copy and pasting
- New settings option to enable duplicate clause - alerts on dupes!
- New Team option in Status of pokémon. This links to the new Pokéstats Tab!

🐛 Bug Fix

- SWSH encounters/level caps bug fix - if it still does not appear please delete
  site cache from your browser (IMPORTANT this will delete your other encounters
  saved on the site)

💅 Enhancement

- BW2 Easy/Normal/Challenge mode level caps - separated by slashes
- HGSS and GSC Level caps up till Red
