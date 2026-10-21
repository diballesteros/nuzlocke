# Game management

Choosing which game the run tracks, and creating, editing and deleting custom games. Every page
shows data for the selected game.

## Sub-features

- `game-select`: pick one of the 14 base games from the header dropdown.
- `game-add`: create a custom game, optionally starting from a base game's encounter list.
- `game-delete`: delete the selected custom game after confirming.
- `game-custom-badges`: add, edit and remove level caps for a custom game.

## How to get to it (user POV)

- The header dropdown (accessible name "games").
- The "+" header button (`add-game`) opens the new-game dialog.
- The trash header button ("deletegame") appears for custom games.
- The pencil header button (`custom-edit-badges`) edits a custom game's level caps. On small
  screens the tracker FAB (`fab-tracker`) holds it as `fab-add-edit-badges`.

## Driving it with control-nuzlocke

Preconditions:

- Seed `empty` for adding; seed `custom-game` for editing or deleting.

- **Select a game.** Run `CLI pick game-select "Sword and Shield"`. The tracker lists Sword and
  Shield locations, starting with "Starter".
- **Add a game.** Run `CLI click --testid add-game`, `CLI type add-game-input "Emerald Kaizo"`,
  optionally `CLI pick encounter-template 1` (template list), then `CLI click --text Save`. The
  header shows "Emerald Kaizo"; `state` has a new `gamesList` entry with value `14.1`.
- **Add a level cap.** Run `CLI click --testid custom-edit-badges`, `CLI click --testid add-cap`,
  `CLI type custom-badge-input-0 12`, `CLI click --text Cancel`. The badge strip shows "12".
- **Delete a game.** Run `CLI click --role button --name deletegame`, then `CLI click --text OK`.
  The game disappears from the dropdown.

## Gotchas

- Custom game keys continue from the last key: `14.1`, `15.1`, … Saved data depends on this.
- Level-cap edits apply as you type; the dialog's only button is Cancel (it just closes).
- Choosing a template copies the base game's encounter list; the custom game then shows
  "14"-style encounter counts.
