# App shell and navigation

The frame around every page: a header with the sidebar button, game picker, game actions and
title; a slide-in sidebar with every page; a left nav on wide screens; a dark/light theme; and a
"!" marker when the installed version has unseen changelog entries.

## Sub-features

- `shell-sidebar`: the sidebar opens from the header button and lists Tracker, Rules, Stats,
  Builder, Calculator, Settings, Export, Import, Report, Changelog, About.
- `shell-nav`: the left nav (Tracker, Rules, Stats, Builder, Calculator) shows at widths ≥ 1005px.
- `shell-theme`: dark mode follows the system theme on first visit, then the Settings toggle.
- `shell-version`: a red "!" on the sidebar button and the Changelog item until the changelog is
  opened.
- `shell-title`: the "Nuzlocke Tracker" title, hidden at ≤ 750px.

## How to get to it (user POV)

- Click the header button (accessible name "sidebar-button") to open the sidebar; click outside to
  close it.
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

- Sidebar items are `div`s with click handlers, not links; there is no keyboard path to them yet.
- The sidebar is a non-modal Radix dialog (`[data-slot="sheet-content"]`, role `dialog`), like
  Semantic's: focus stays put, Escape does nothing, and a click outside closes it and still reaches
  its target. A click on the game select (or its menu) leaves it open, as Semantic's did. It stays
  in the page for its 500ms slide-out, so count dialogs without it.
- The game select's menu is portalled (`game-select-options`); `CLI pick game-select …` finds it.
- The dark-mode-on-first-visit check runs only when the stored `newVersion` differs from the app
  version.
- The service worker is blocked in all verification browsers; PWA install/offline behaviour is not
  covered.
