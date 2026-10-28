# Tracker encounters

The main page: one row per location in the selected game. Each row records the Pokémon met, its
status (captured, team, fainted, …), nickname, nature and level, and opens a detail editor for
everything else (ability, item, gender, moves, IVs/EVs, met level, cause of fainting, soul link,
export to another game or the Builder).

## Sub-features

- `enc-pokemon`: choose the Pokémon met at a location from a searchable, filterable selector,
  with type effectiveness on its type icons.
- `enc-status`: set the status; "Team" adds it to the team (status value 7).
- `enc-nickname`: type a nickname, or roll a random one.
- `enc-nature`, `enc-level`: quick nature picker and level up/down buttons.
- `enc-detail`: the detail editor (`edit-encounter-N`): stats, moves, ability, item, gender, shiny,
  met level, cause of fainting, soul link, export to game, export to Builder.
- `enc-evolve`: evolve along the evolution chain (`evolve-N}`).
- `enc-swap`: swap the row's Pokémon between team and box (`swap-N`).
- `enc-add`, `enc-reset`, `enc-delete`: add a location, reset one row, reset all rows, delete a row.
- `enc-scroll`: the scroll list jumps to any location or the last one filled, and can skip rows.
- `enc-notes`: free-text notes per game.
- `enc-alerts`: rule alerts on a row (DUPE, FORBIDDEN TYPE/GEN, OVERLEVELED, TEAM OVER 6).

## How to get to it (user POV)

- `/` with a game selected. Rows render virtualized: only visible rows exist in the DOM.
- Row buttons: Pokémon box (`pokemon-N`), status dropdown (`status-N`), pencil (`edit-encounter-N`),
  ⋮ menu (`encounter-options-N` → `level-up-N`, `level-down-N`, `reset-encounter-N`,
  `delete-encounter-N`).
- Top bar: Share (`share-encounters`), Add (`add-encounter`), Reset (`reset-all`). On small screens
  they move into the FAB (`fab-tracker`).
- Bottom bar: scroll list (`open-scroll-list`), notes (`open-notes`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected` (FRLG) for a blank run, or `mid-run` for a populated one.

- **Pick a Pokémon.** Run `CLI click --testid pokemon-0`, then `CLI click --testid poke-Bulbasaur`.
  The row shows Bulbasaur; `state` has the Pokémon id on encounter 0.
- **Set a status.** Run `CLI pick status-0 Fainted`. The dropdown text reads "Fainted".
- **Edit details.** Run `CLI click --testid edit-encounter-0`, `CLI type level 15`, then
  `CLI click --text Save`. The row shows "Lv: 15".
- **Reset all.** Run `CLI click --testid reset-all`, then `CLI click --text Save`. Every status
  reads "Status...".
- **Proof.** `CLI screenshot --name tracker` and `CLI state --out verification/artifacts/tracker.json`.

## Gotchas

- Only rendered rows have test ids; scroll first (`open-scroll-list` → `scroll-to-encounter-N`).
- The row status and nature menus portal (test id plus `-options`), so they sit above the next row
  and the badge strip.
- The evolve button's test id really ends in a brace: `evolve-0}`.
- react-window 2 positions rows with a transform, so anything rendered inside a row is painted
  under the next row. Menus in a row must portal.
- Added encounters get timestamp ids (`Date.now()`), so ids differ between runs.
