import { Field } from '@smogon/calc';
import { DEFAULT_VALUES } from 'constants/calculator';
import type { TCalculatorForm } from 'constants/types';
import { getFields, getPokemon, getResults } from 'hooks/useCalculate';

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

describe('calculator side conditions', () => {
  // Pikachu and Charizard both use Tackle, so Reflect halves either direction
  const damage = (reflect1: boolean, reflect2: boolean) => {
    const form = {
      ...DEFAULT_VALUES,
      calculatorGen: 8,
      pokemon1: 25,
      pokemon2: 7,
      move1_1: 33,
      move1_2: 33,
      isReflect1: reflect1,
      isReflect2: reflect2,
    } as TCalculatorForm;
    const [attackerField, defenderField] = getFields(form);
    const pokemon1 = getPokemon(form, 1);
    const pokemon2 = getPokemon(form, 2);
    return {
      toPokemon2: getResults(form, pokemon1, pokemon2, attackerField, 1)[0].range().join('-'),
      toPokemon1: getResults(form, pokemon2, pokemon1, defenderField, 2)[0].range().join('-'),
    };
  };

  test("each side's Reflect only reduces the damage that side takes", () => {
    const none = damage(false, false);
    const reflect1 = damage(true, false);
    const reflect2 = damage(false, true);

    expect(reflect1.toPokemon2).toBe(none.toPokemon2);
    expect(reflect1.toPokemon1).not.toBe(none.toPokemon1);
    expect(reflect2.toPokemon1).toBe(none.toPokemon1);
    expect(reflect2.toPokemon2).not.toBe(none.toPokemon2);
    expect({ none, reflect1, reflect2 }).toMatchInlineSnapshot(`
      {
        "none": {
          "toPokemon1": "34-40",
          "toPokemon2": "26-31",
        },
        "reflect1": {
          "toPokemon1": "17-20",
          "toPokemon2": "26-31",
        },
        "reflect2": {
          "toPokemon1": "34-40",
          "toPokemon2": "13-15",
        },
      }
    `);
  });
});
