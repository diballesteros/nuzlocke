# PokéStats summary card

A shareable image of the run: header with title and status, team, encounter completion and types,
stats, boxed and fainted Pokémon, rules and a description. Tabs list caught, team, failed and
fainted Pokémon with details.

## Sub-features

- `stats-card`: the summary card, downloadable as `nuzlocke.png` (`download-image`) or shared
  through the system share sheet (`share-image`).
- `stats-settings`: display settings (`display-settings`): title (`summary-title`), status
  (`summary-status`), section toggles (`summary-encounters`, `summary-stats`, `summary-boxed`,
  `summary-fainted`, `summary-rules`, `summary-show-description`), description
  (`summary-description`).
- `stats-tabs`: Summary, Team, Caught, Failed and Fainted tabs with counts; each Pokémon expands
  (`caught-N`, `team-N`, `failed-N`, `fainted-N`).

## How to get to it (user POV)

- Sidebar → Stats (`stats`), or `/stats`.

## Driving it with control-nuzlocke

Preconditions:

- Seed `mid-run`.

- **Card.** Run `CLI goto stats`, `CLI screenshot --name stats`. The card shows the team and
  "18%" completion.
- **Hide a section.** Run `CLI click --testid display-settings`, open the third `<details>` group,
  `CLI toggle summary-boxed`, close settings. The card no longer has a "Boxed" section.
- **Fainted details.** Open the Fainted tab and run `CLI click --testid fainted-0`. Details list the
  level, met location, nature, ability, item and cause of fainting.

## Gotchas

- Card headings are uppercase only through CSS; the DOM text is title case.
- The card renders twice (`-true` and `-false` test id suffixes) for responsive and export
  layouts.
- Download and share render the card with `html-to-image`; share needs `navigator.canShare`.
