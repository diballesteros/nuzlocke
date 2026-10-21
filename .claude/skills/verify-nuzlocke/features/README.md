# Nuzlocke Tracker feature map

The maintained source for verifying user-facing behaviour. Read this index, then the matching
feature file as the recipe.

## Baseline preconditions

- The app runs from `control-nuzlocke.mjs launch` at `http://127.0.0.1:3100` and `doctor` passes.
- Each recipe starts from a seed (`seed <name>`), listed in its Preconditions.
- Never drive an instance this run did not launch.

## Driving conventions

- `CLI` means `node .claude/skills/verify-nuzlocke/control-nuzlocke.mjs`.
- Handles are `data-testid` values unless a role or text is named. Indexes in test ids are
  0-based row positions (`status-0` is the first encounter).
- Dropdown options: `pick <testid> <text|index>`.
- Restore state by re-seeding; never edit localStorage by hand during a proof.

## Proof and skip reporting

- Capture the action and the resulting state: a screenshot or ARIA snapshot, plus `state` for any
  mutation.
- Record the feature file and entry point with every artifact.
- Report an unreachable path with the attempted command and the unmet precondition.

## Feature entry contract

Each feature file has an H1, one paragraph on the user-visible behaviour, then four H2s in order:
`Sub-features`, `How to get to it (user POV)`, `Driving it with control-nuzlocke` (starts with
`Preconditions:`), `Gotchas`. No implementation details beyond stable handles.

## Features

| Feature                                       | File                                           | Route                                        |
| --------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| App shell and navigation                      | [app-shell.md](app-shell.md)                   | all                                          |
| Game management (select, custom games)        | [game-management.md](game-management.md)       | header                                       |
| Tracker encounters                            | [tracker-encounters.md](tracker-encounters.md) | `/`                                          |
| Filter and search                             | [filter-search.md](filter-search.md)           | `/`                                          |
| Badges and level caps                         | [badges.md](badges.md)                         | `/`, `/badgedetail/:game/:badge`             |
| Rules and rulesets                            | [rules.md](rules.md)                           | `/rules`                                     |
| PokéStats summary card                        | [pokestats.md](pokestats.md)                   | `/stats`                                     |
| Team builder and coverage                     | [builder.md](builder.md)                       | `/builder`                                   |
| Damage calculator                             | [calculator.md](calculator.md)                 | `/calculator`                                |
| Settings and custom statuses                  | [settings.md](settings.md)                     | `/settings`                                  |
| Import and export                             | [import-export.md](import-export.md)           | `/import`, sidebar                           |
| Info pages (changelog, about, report, delete) | [info-pages.md](info-pages.md)                 | `/changelog`, `/about`, `/report`, `/delete` |
