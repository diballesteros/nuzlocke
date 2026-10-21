# Import and export

Back up and restore everything as JSON, and import a game's encounters from PkHeX text.

## Sub-features

- `export-json`: the sidebar's Export (`export`) downloads `PokemonList.json` with the whole store
  (`badges`, `games`, `gamesList`, …).
- `import-json`: `/import` loads such a file (`import-file-input`, `apply-import`); invalid files
  show "Invalid file".
- `import-pkhex`: paste PkHeX table text (`table-import-textarea`), choose "table" or "all"
  (`table-import-option`, `all-import-option`) and apply; the selected game's encounters are
  filled.

## How to get to it (user POV)

- Sidebar → Export (downloads at once) or Import (`import`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`. Import files live in `cypress/fixtures/` (`PokemonList.json`, `Team.json`,
  `over6.json`, `Coverage.json`, `Suggestions.json`, `Invalid.json`, `table.txt`).

- **Import.** `CLI goto import`; set the file input to `cypress/fixtures/PokemonList.json` (the
  e2e helper `importFile` does this), then `CLI click --testid apply-import`. The tracker shows
  "Emerald Kaizo".
- **Export.** In a Playwright test, wait for the download after clicking `export`; the JSON has
  `badges`, `games` and `gamesList`.

## Gotchas

- Importing replaces the whole store, including settings such as dark mode.
- The control CLI has no file-upload or download command; prove these through `tests/e2e`
  (`Import.spec.ts`, `Options.spec.ts`).
