# Team builder and coverage

Plan a team of up to six Pokémon with nature, ability, item and four moves, and see its type
coverage.

## Sub-features

- `builder-team`: add members (`builder-add`), expand one (`expand-<Name>`), set nature
  (`team-nature-<Name>`), ability (`team-ability-<Name>`), item (`team-item-<Name>`) and moves,
  delete members (`delete-team-N`).
- `builder-coverage`: the Coverage tab counts super-effective coverage per type ("ICE 4").
- `builder-export`: the encounter detail editor's "Export to Builder" copies a tracked Pokémon in.

## How to get to it (user POV)

- Sidebar → Builder (`builder`), or `/builder`. Two tabs: Builder and Coverage.

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`, then `CLI pick game-select "Sword and Shield"`.

- **Add a member.** Run `CLI goto builder`, `CLI click --testid builder-add`,
  `CLI click --testid poke-Bulbasaur`. A Bulbasaur card appears (`team-poke-Bulbasaur`).
- **Set its moves.** Run `CLI click --testid expand-Bulbasaur`, then click "Select a move..." in
  its details (`team-details-Bulbasaur`) and `CLI click --testid move-Pound`.
- **Coverage.** Run `CLI click --text Coverage`. Counts per type appear.

## Gotchas

- With six members the add button is disabled.
- The Builder shows "Please select a game" until one is picked.
