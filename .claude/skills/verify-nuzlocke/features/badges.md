# Badges and level caps

The strip of gym badges (or trials) at the top of the tracker. Each badge shows its level cap,
toggles between earned and not earned, and links to a detail page with the leader's teams.

## Sub-features

- `badge-toggle`: click a badge to mark it earned (full colour) or not (grayscale).
- `badge-caps`: edit the level caps (`edit-badges`), reset them ("Set default"), or pick a preset
  (`badge-multiple-default`, games with several cap sets).
- `badge-detail`: the "?" on a badge (`badge-detail-N`) opens `/badgedetail/:game/:badge` with the
  leader's teams, including rematch and version tabs (`badge-details-tabs`).

## How to get to it (user POV)

- `/` with a base game selected. On small screens the cap editor is in the FAB
  (`fab-add-edit-badges`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`, then `CLI pick game-select "Sword and Shield"`.

- **Earn a badge.** Run `CLI click --role button --name "Fire Badge"` (badges are buttons titled
  "<Name> Badge"). It turns full colour; `state` lists it under `badges`.
- **Edit a cap.** Run `CLI click --testid edit-badges`, type into the first field, close. The badge
  shows the new number.
- **Details.** Open `/badgedetail/13/0` with `CLI goto badgedetail/13/0`. The page lists Milo's
  Pokémon, including "Eldegoss".

## Gotchas

- Hovering a badge also removes the grayscale filter; move the pointer away before judging it.
- Invalid detail URLs (`/badgedetail/25/25`) redirect away from `/badgedetail`.
- The strip scrolls horizontally on narrow screens; later badges may be off-screen.
