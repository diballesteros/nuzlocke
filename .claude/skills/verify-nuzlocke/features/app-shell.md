# App shell and navigation

The frame around every page: a 48px header with the menu button, game picker, game actions
(outlined + and ✎, and a red trash for custom games, at every width) and title; a slide-in 260px
menu with every page in three groups; the page nav; a dark/light theme; and a red "!" mark when the
installed version has unseen changelog entries.

## Sub-features

- `shell-sidebar`: the menu opens from the header button and lists Tracker, Rules, Stats,
  Builder, Calculator | Settings, Export, Import | Report, Changelog, About. Items are buttons; the
  current page's has `aria-current="page"`.
- `shell-nav`: the page nav (Tracker, Rules, Stats, Builder, Calculator): a column from 1148px, a
  row above the page from 571px, a tab bar below. Tab names wrap and hyphenate.
- `shell-theme`: dark mode follows the system theme on first visit, then the Settings toggle.
- `shell-version`: a red "!" on the menu button and the Changelog item until the changelog is
  opened; both buttons' names add ", new version".
- `shell-title`: the "Nuzlocke Tracker" title, centred from 1200px; below 860px it is visually
  hidden (sr-only) and taken out of the bar's flow.

## How to get to it (user POV)

- Click the header button (accessible name "Menu", or "Menu, new version") to open the menu; click
  outside to close it.
- On a wide screen, use the left nav.

## Driving it with control-nuzlocke

Preconditions:

- Any seed; `game-selected` for a populated header.

- **Open the sidebar.** Run `CLI click --testid options`. The sidebar shows the items above, each
  with a test id: `tracker`, `rules`, `stats`, `builder`, `calculator`, `settings`, `export`,
  `import`, `report`, `changelog`, `about`.
- **Navigate.** Run `CLI click --testid rules`. The URL ends in `/rules` and the sidebar closes.
- **Wide nav.** Run `CLI viewport desktop` (1280px), then `CLI snapshot`. A `navigation` landmark
  lists the five main pages.
- **Theme.** Run `CLI theme light`, then `CLI screenshot`. `[data-testid="app"]` has a white
  background; `theme dark` gives `rgb(33, 33, 33)`.

## Gotchas

- Menu items are buttons, not links. The menu isn't modal and doesn't take focus, so the keyboard
  reaches its items by tabbing on from the header. Choosing an item with focus inside the menu
  puts focus back on the menu button.
- The custom-game trash keeps the `aria-label="deletegame"` attribute that `CustomGame.spec.ts`
  selects by; its accessible name is "Delete game" (`aria-labelledby`).
- The sidebar is a non-modal Radix dialog (`[data-slot="sheet-content"]`, role `dialog`), like
  Semantic's: focus stays put, Escape does nothing, and a click outside closes it and still reaches
  its target. A click on the game select (or its menu) leaves it open, as Semantic's did. It stays
  in the page for its 500ms slide-out, so count dialogs without it.
- The game select's menu is portalled (`game-select-options`); `CLI pick game-select …` finds it.
- The dark-mode-on-first-visit check runs only when the stored `newVersion` differs from the app
  version.
- The service worker is blocked in all verification browsers; PWA install/offline behaviour is not
  covered.
