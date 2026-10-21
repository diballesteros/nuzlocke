import { Field } from '@smogon/calc';
import { DEFAULT_VALUES } from 'constants/calculator';
import type { TCalculatorForm } from 'constants/types';
import { getPokemon, getResults } from 'hooks/useCalculate';

// Golden damage ranges through the app's own calculator wiring, one row per generation.
// A @smogon/calc upgrade that changes any number shows up here as an exact diff.
const MATCHUPS = [
  // [attacker, defender, moves] — Pikachu, Charizard, Gyarados, Clefairy, Squirtle, Onix
  [25, 7, [85, 33]], // Thunderbolt, Tackle
  [6, 130, [53, 89]], // Flamethrower, Earthquake
  [130, 6, [57, 89]], // Surf, Earthquake
  [35, 95, [85, 57]], // Thunderbolt, Surf
] as const;

const damageTable = (gen: number) =>
  MATCHUPS.map(([attacker, defender, moves]) => {
    const form = {
      ...DEFAULT_VALUES,
      calculatorGen: gen,
      pokemon1: attacker,
      pokemon2: defender,
      move1_1: moves[0],
      move2_1: moves[1],
      move3_1: undefined,
      move4_1: undefined,
    } as TCalculatorForm;
    const results = getResults(form, getPokemon(form, 1), getPokemon(form, 2), new Field(), 1);
    return results
      .filter(Boolean)
      .map((result) => result.range().join('-'))
      .join(' | ');
  });

describe('calculator golden damage ranges', () => {
  test.each([1, 2, 3, 4, 5, 6, 7, 8])('gen %i', (gen) => {
    expect(damageTable(gen)).toMatchSnapshot();
  });
});
