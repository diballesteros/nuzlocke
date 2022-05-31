import { addBreadcrumb } from '@sentry/react';
import { calculate, Field, Move, Pokemon, Result } from '@smogon/calc';
import type { StatusName } from '@smogon/calc/dist/data/interface';
import { useCallback, useMemo } from 'react';
import { FORBIDDEN_ITEMS, GenderCalc } from 'constants/calculator';
import { SMOGON_NAMES } from 'constants/constant';
import { MOVEMAP } from 'constants/moves';
import { POKEMAP } from 'constants/pokemon';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';

export function assertResult(val: unknown[]): asserts val is [Result, Result, Result, Result] {
  if (val.length !== 4) {
    throw new TypeError('Result should have been an array of calculations');
  }
}

export function assertIndex(val: number): asserts val is 1 | 2 | 3 | 4 {
  if (![1, 2, 3, 4].includes(val)) {
    throw new TypeError('Invalid move index');
  }
}

export const getSmogonName = (pokemonName: string): string => {
  if (SMOGON_NAMES[pokemonName]) {
    return SMOGON_NAMES[pokemonName];
  }
  return pokemonName;
};

export function getPokemon(all: TCalculatorForm, id: 1 | 2) {
  if (all?.calculatorGen && all?.[`pokemon${id}`]) {
    const getDVorIV = (iv: number, dv: number) => {
      return all?.calculatorGen > 2 ? iv : dv * 2 + 1;
    };

    const getItem = (item: string) => {
      if (FORBIDDEN_ITEMS.includes(item)) {
        return undefined;
      }
      return item;
    };

    addBreadcrumb({
      category: 'Calculator',
      message: `Pokemon details: ${JSON.stringify(all)}`,
      level: 'log',
    });

    return new Pokemon(
      all?.calculatorGen,
      getSmogonName(POKEMAP.get(all?.[`pokemon${id}`])?.text),
      {
        ability: all?.[`ability${id}`],
        abilityOn: true,
        ivs: {
          hp: getDVorIV(all?.[`ivhp${id}`], 15) ?? undefined,
          atk: getDVorIV(all?.[`ivatk${id}`], all?.[`dvatk${id}`]) ?? undefined,
          def: getDVorIV(all?.[`ivdef${id}`], all?.[`dvdef${id}`]) ?? undefined,
          spa: getDVorIV(all?.[`ivspatk${id}`], all?.[`dvspc${id}`]) ?? undefined,
          spd: getDVorIV(all?.[`ivspdef${id}`], all?.[`dvspc${id}`]) ?? undefined,
          spe: getDVorIV(all?.[`ivspeed${id}`], all?.[`dvspeed${id}`]) ?? undefined,
        },
        evs: {
          hp: all?.[`evhp${id}`],
          atk: all?.[`evatk${id}`],
          def: all?.[`evdef${id}`],
          spa: all?.[`evspatk${id}`],
          spd: all?.[`evspdef${id}`],
          spe: all?.[`evspeed${id}`],
        },
        boosts: {
          atk: all?.[`modatk${id}`],
          def: all?.[`moddef${id}`],
          spa: all?.[`modspatk${id}`],
          spd: all?.[`modspdef${id}`],
          spe: all?.[`modspeed${id}`],
        },
        curHP: all?.[`currenthp${id}`],
        isDynamaxed: all?.[`isDynamaxed${id}`],
        item: getItem(all?.[`item${id}`]),
        gender: GenderCalc[all?.[`gender${id}`]],
        level: all?.[`level${id}`],
        nature: all?.[`nature${id}`],
        status: all?.[`status${id}`] === 'none' ? undefined : (all?.[`status${id}`] as StatusName),
      }
    );
  }
  return null;
}

export function getResults(
  all: TCalculatorForm,
  attacker: Pokemon,
  defender: Pokemon,
  field: Field,
  id: 1 | 2
) {
  return Array.from(Array(4)).map((val, i) => {
    const moveIndex = i + 1;
    assertIndex(moveIndex);
    if (all?.calculatorGen && all[`move${moveIndex}_${id}`]) {
      return calculate(
        all?.calculatorGen,
        attacker,
        defender,
        new Move(all?.calculatorGen, MOVEMAP.get(all[`move${moveIndex}_${id}`])?.name, {
          isCrit: all[`move${moveIndex}_crit${id}`],
          useZ: all[`move${moveIndex}_z${id}`],
          useMax: all?.[`isDynamaxed${id}`],
        }),
        field
      );
    }
    return null;
  });
}

function useCalculate(): {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  attackerResults: [Result, Result, Result, Result];
  defenderResults: [Result, Result, Result, Result];
} {
  const all = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));

  const pokemon1 = useMemo(() => {
    return getPokemon(all, 1);
  }, [all]);

  const pokemon2 = useMemo(() => {
    return getPokemon(all, 2);
  }, [all]);

  const field = useMemo(() => {
    return new Field({
      attackerSide: {
        cannonade: all?.cannonade1,
        isAuroraVeil: all?.isAuroraVeil1,
        isBattery: all?.isBattery1,
        isForesight: all?.isForesight1,
        isFriendGuard: all?.isFriendGuard1,
        isHelpingHand: all?.isHelpingHand1,
        isLightScreen: all?.isLightScreen1,
        isProtected: all?.isProtected1,
        isReflect: all?.isReflect1,
        isSeeded: all?.isSeeded1,
        isSR: all?.isSR1,
        isSwitching: all?.isSwitching1 ? 'out' : undefined,
        isTailwind: all?.isTailwind1,
        spikes: all?.spikes1,
        steelsurge: all?.steelsurge1,
        vinelash: all?.vinelash1,
        volcalith: all?.volcalith1,
        wildfire: all?.wildfire1,
      },
      defenderSide: {
        cannonade: all?.cannonade2,
        isAuroraVeil: all?.isAuroraVeil2,
        isBattery: all?.isBattery2,
        isForesight: all?.isForesight2,
        isFriendGuard: all?.isFriendGuard2,
        isHelpingHand: all?.isHelpingHand2,
        isLightScreen: all?.isLightScreen2,
        isProtected: all?.isProtected2,
        isReflect: all?.isReflect2,
        isSeeded: all?.isSeeded2,
        isSR: all?.isSR2,
        isSwitching: all?.isSwitching2 ? 'out' : undefined,
        isTailwind: all?.isTailwind2,
        spikes: all?.spikes2,
        steelsurge: all?.steelsurge2,
        vinelash: all?.vinelash2,
        volcalith: all?.volcalith2,
        wildfire: all?.wildfire2,
      },
      gameType: all?.gameType,
      isGravity: all?.isGravity,
      terrain: all?.terrain === 'None' ? undefined : all?.terrain,
      weather: all?.weather === 'None' ? undefined : all?.weather,
    });
  }, [all]);

  const attackerResults = getResults(all, pokemon1, pokemon2, field, 1);
  const defenderResults = getResults(all, pokemon2, pokemon1, field, 2);

  assertResult(attackerResults);
  assertResult(defenderResults);

  return { pokemon1, pokemon2, attackerResults, defenderResults };
}

export default useCalculate;
