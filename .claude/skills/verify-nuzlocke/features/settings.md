# Settings and custom statuses

App-wide preferences: language, dark mode, rule checks, nickname and suggestion behaviour, Soul
Link, and user-defined encounter statuses.

## Sub-features

- `settings-toggles`: dark mode (`settings-darkmode`), duplicate clause (`settings-dupes`),
  nicknames (`settings-nickname`), missing-encounter alerts (`settings-missing`), show all Pokémon
  (`settings-showall`), suggestions (`settings-suggestions`), Soul Link (`settings-soulink`).
- `settings-language`: English, Español, Deutsch (`settings-language`).
- `settings-statuses`: add and remove custom statuses (`edit-custom-statuses`,
  `custom-status-input`, `add-status`, `remove-custom-status-N`); they appear at the end of every
  status dropdown.

## How to get to it (user POV)

- Sidebar → Settings (`settings`), `/settings`, or the wrench next to the tracker search
  (`search-options`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`.

- **Dark mode.** Run `CLI goto settings`, `CLI toggle settings-darkmode`. The background changes
  between `rgb(33, 33, 33)` and white.
- **Language.** Run `CLI click --testid settings-language`, `CLI click --text Español`. The page
  title reads "Ajustes".
- **Custom status.** Run `CLI click --testid edit-custom-statuses`,
  `CLI type custom-status-input Traded`, `CLI click --testid add-status`, `CLI click --text Cancel`.
  On the tracker, `CLI pick status-0 Traded` works.

## Gotchas

- Settings toggles are Semantic UI checkboxes: click the label (`toggle` does).
- The Spanish locale's `syncing` key is misspelled (`sincronizando`); see `KNOWN_ISSUES`.
