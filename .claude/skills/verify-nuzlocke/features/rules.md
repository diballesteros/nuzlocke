# Rules and rulesets

The run's rules, grouped in rulesets (Nuzlocke, Wedlocke, Soul Link and custom ones). Rules are
text or "smart" rules (allowed types, allowed generations, max level) that raise alerts on tracker
rows. Rules can be shared as text.

## Sub-features

- `rules-crud`: add (`add-rule`), edit (`edit-rule-N`), delete (`delete-rule-N`) and reorder
  (`arrow-up-N`, `arrow-down-N`) rules.
- `rules-sets`: switch rulesets (`rule-select`), add (`add-ruleset`) and delete (`delete-ruleset`)
  custom ones.
- `rules-smart`: Type, Generation and Level tabs in the add/edit dialog; one of each per ruleset.
- `rules-share`: the Share button (`share-encounters`) opens editable text with a Copy button.

## How to get to it (user POV)

- Sidebar → Rules (`rules`), or `/rules`.

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`.

- **Add a rule.** Run `CLI goto rules`, `CLI click --testid add-rule`,
  `CLI type add-rule-input "No items in battle"`, `CLI click --text Save`. The list gains item 4.
- **Smart rule.** Run `CLI click --testid add-rule`, `CLI click --text Type`,
  `CLI pick add-rule-type GRASS`, `CLI click --text Save`. The list shows "Allowed types: GRASS".
  A non-Grass Pokémon on the tracker now shows a FORBIDDEN TYPE alert (`alert-N`).
- **Share.** Run `CLI click --testid share-encounters`, `CLI click --text Copy`. A toast says
  "Copied" (or "Unable to share" when the clipboard is refused).

## Gotchas

- The ruleset-name input warns while the typed name matches an existing ruleset, including partial
  names on the way to a new one ("Nuzlocke" while typing "Nuzlocke Custom").
- Adding a second smart rule of the same kind shows "<Kind> rule already exists".
- Copy needs clipboard permission; headless browsers may refuse it.
