# Damage calculator

A two-sided damage calculator (powered by `@smogon/calc`) for the selected game's generation:
attacker and defender with level, nature, ability, item, status, stats and moves, plus field
conditions. Results read like Smogon's ("… 29-35 (12.5 - 15.1%) -- possible 7HKO").

## Sub-features

- `calc-pokemon`: pick each side's Pokémon (`pokecontroller-pokemon1|2`), from your tracked
  Pokémon or all (`show-all-pokemon1|2`), or a gym leader's team (`gym-filter`).
- `calc-inputs`: level (`level-input1`, `minus-level1`, `plus-level1`), gender, nature, ability,
  item, status (`<field>1|2` dropdowns), stats per stat (`hp1-detail` …), boosts (`modatk1`).
- `calc-moves`: four moves per side (`move1_1` … `move4_2`), crit (`move1_crit1`) and Z/Max toggles.
- `calc-field`: field settings (`field-settings`): singles/doubles, terrain, weather, gravity,
  spikes and side conditions.
- `calc-results`: the main result (`primary-damage`) and every move's result
  (`expand-moves`, `attacker-result-N`, `defender-result-N`).
- `calc-reset`: reset everything (`reset-calculator`).

## How to get to it (user POV)

- Sidebar → Calculator (`calculator`), or `/calculator`. On mobile, tabs switch sides
  (`pokemon1-tab`, `pokemon2-tab`).

## Driving it with control-nuzlocke

Preconditions:

- Seed `game-selected`, then `CLI pick game-select "Sword and Shield"`.

- **Default result.** Run `CLI goto calculator`. The header reads
  "0 Atk Bulbasaur Pound vs. 0 HP / 0 Def Bulbasaur: 29-35 (12.5 - 15.1%) -- possible 7HKO".
- **Change level.** Run `CLI type level-input1 10`. The result starts "Lvl 10".
- **Field.** Run `CLI click --testid field-settings`, `CLI toggle weather-Rain`. Results update.

## Gotchas

- An empty IV field becomes `NaN` stats (known bug, pinned in
  `src/components/Calculator/Calculator.test.ts`).
- Since `@smogon/calc` 0.11, "possible nHKO" texts no longer say "after Spikes".
- Custom games ask for a generation (`gen-selector`).
