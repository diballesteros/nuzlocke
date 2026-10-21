# Filter and search

Narrowing the tracker's rows by text (Pokémon, location or status) and narrowing Pokémon and move
selectors by generation and type.

## Sub-features

- `filter-text`: the tracker search box matches Pokémon, location or status.
- `filter-help`: the "?" on the search box explains what it matches.
- `filter-selector`: the filter button in Pokémon and move selectors toggles generation
  (`filter-gen-N`) and type (`filter-type-TYPE`) chips.

## How to get to it (user POV)

- The search box above the tracker rows (`filter`).
- Inside any Pokémon or move selector: the filter button (`filter-button`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`, then `CLI pick game-select "Sword and Shield"`.

- **Search.** Run `CLI type filter "Slumbering Weald"`. One row remains.
- **Help.** Hovering or clicking the "?" in the search box shows "Search by Pokémon, location, or
  status".
- **Selector filters.** Run `CLI click --testid pokemon-0`, `CLI click --testid filter-button`,
  `CLI click --testid filter-type-FIRE`. Only Fire-type Pokémon remain in the list.

## Gotchas

- The selector's text filter (`filter` inside the dialog) uppercases what you type in move
  selectors ("punch" shows as "PUNCH").
- Both the tracker and the selectors use the test id `filter`; scope to the open dialog when one is
  open.
