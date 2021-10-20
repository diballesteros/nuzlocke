import { calculate, Field, Move, Pokemon, Result } from '@smogon/calc';
import { useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { GenderCalc } from 'constants/calculator';
import { MOVEMAP } from 'constants/moves';
import { POKEMAP } from 'constants/pokemon';
import { TCalculatorForm } from 'constants/types';

function assertResult(val: unknown[]): asserts val is [Result, Result, Result, Result] {
  if (val.length !== 4) {
    throw new TypeError('Result should have been an array of calculations');
  }
}

function assertIndex(val: number): asserts val is 1 | 2 | 3 | 4 {
  if (![1, 2, 3, 4].includes(val)) {
    throw new TypeError('Invalid move index');
  }
}

function useCalculate(control: Control<TCalculatorForm>): {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  attackerResults: [Result, Result, Result, Result];
  defenderResults: [Result, Result, Result, Result];
} {
  const all = useWatch({ control });

  const pokemon1 = useMemo(() => {
    if (all.calculatorGen && all.pokemon1) {
      const getDVorIV = (iv: number, dv: number) => {
        return all.calculatorGen > 2 ? iv : dv * 2 + 1;
      };

      return new Pokemon(all.calculatorGen, POKEMAP.get(all.pokemon1)?.text, {
        ability: all.ability1,
        abilityOn: true,
        ivs: {
          hp: getDVorIV(all.ivhp1, 15) ?? undefined,
          atk: getDVorIV(all.ivatk1, all.dvatk1) ?? undefined,
          def: getDVorIV(all.ivdef1, all.dvdef1) ?? undefined,
          spa: getDVorIV(all.ivspatk1, all.dvspc1) ?? undefined,
          spd: getDVorIV(all.ivspdef1, all.dvspc1) ?? undefined,
          spe: getDVorIV(all.ivspeed1, all.dvspeed1) ?? undefined,
        },
        evs: {
          hp: all.evhp1,
          atk: all.evatk1,
          def: all.evdef1,
          spa: all.evspatk1,
          spd: all.evspdef1,
          spe: all.evspeed1,
        },
        boosts: {
          atk: all.modatk1,
          def: all.moddef1,
          spa: all.modspatk1,
          spd: all.modspdef1,
          spe: all.modspeed1,
        },
        curHP: all.currenthp1,
        isDynamaxed: all.isDynamaxed1,
        item: all.item1,
        gender: GenderCalc[all.gender1],
        level: all.level1,
        nature: all.nature1,
        status: all.status1 === 'none' ? undefined : all.status1,
      });
    }
    return null;
  }, [all]);

  const pokemon2 = useMemo(() => {
    if (all.calculatorGen && all.pokemon2) {
      const getDVorIV = (iv: number, dv: number) => {
        return all.calculatorGen > 2 ? iv : dv * 2 + 1;
      };

      return new Pokemon(all.calculatorGen, POKEMAP.get(all.pokemon2)?.text, {
        ability: all.ability2,
        abilityOn: true,
        boosts: {
          atk: all.modatk2,
          def: all.moddef2,
          spa: all.modspatk2,
          spd: all.modspdef2,
          spe: all.modspeed2,
        },
        curHP: all.currenthp2,
        evs: {
          hp: all.evhp2,
          atk: all.evatk2,
          def: all.evdef2,
          spa: all.evspatk2,
          spd: all.evspdef2,
          spe: all.evspeed2,
        },
        gender: GenderCalc[all.gender2],
        ivs: {
          hp: getDVorIV(all.ivhp2, 15) ?? undefined,
          atk: getDVorIV(all.ivatk2, all.dvatk2) ?? undefined,
          def: getDVorIV(all.ivdef2, all.dvdef2) ?? undefined,
          spa: getDVorIV(all.ivspatk2, all.dvspc2) ?? undefined,
          spd: getDVorIV(all.ivspdef2, all.dvspc2) ?? undefined,
          spe: getDVorIV(all.ivspeed2, all.dvspeed2) ?? undefined,
        },
        isDynamaxed: all.isDynamaxed1,
        item: all.item2,
        level: all.level2,
        nature: all.nature2,
        status: all.status2 === 'none' ? undefined : all.status2,
      });
    }
    return null;
  }, [all]);

  const field = useMemo(() => {
    return new Field({
      attackerSide: {
        cannonade: all.cannonade1,
        isAuroraVeil: all.isAuroraVeil1,
        isBattery: all.isBattery1,
        isForesight: all.isForesight1,
        isFriendGuard: all.isFriendGuard1,
        isHelpingHand: all.isHelpingHand1,
        isLightScreen: all.isLightScreen1,
        isProtected: all.isProtected1,
        isReflect: all.isReflect1,
        isSeeded: all.isSeeded1,
        isSR: all.isSR1,
        isSwitching: all.isSwitching1 ? 'out' : undefined,
        isTailwind: all.isTailwind1,
        spikes: all.spikes1,
        steelsurge: all.steelsurge1,
        vinelash: all.vinelash1,
        volcalith: all.volcalith1,
        wildfire: all.wildfire1,
      },
      defenderSide: {
        cannonade: all.cannonade2,
        isAuroraVeil: all.isAuroraVeil2,
        isBattery: all.isBattery2,
        isForesight: all.isForesight2,
        isFriendGuard: all.isFriendGuard2,
        isHelpingHand: all.isHelpingHand2,
        isLightScreen: all.isLightScreen2,
        isProtected: all.isProtected2,
        isReflect: all.isReflect2,
        isSeeded: all.isSeeded2,
        isSR: all.isSR2,
        isSwitching: all.isSwitching2 ? 'out' : undefined,
        isTailwind: all.isTailwind2,
        spikes: all.spikes2,
        steelsurge: all.steelsurge2,
        vinelash: all.vinelash2,
        volcalith: all.volcalith2,
        wildfire: all.wildfire2,
      },
      gameType: all.gameType,
      isGravity: all.isGravity,
      terrain: all.terrain === 'None' ? undefined : all.terrain,
      weather: all.weather === 'None' ? undefined : all.weather,
    });
  }, [all]);

  const attackerResults = Array.from(Array(4)).map((val, i) => {
    const moveIndex = i + 1;
    assertIndex(moveIndex);
    if (all.calculatorGen && all[`move${moveIndex}_1`]) {
      return calculate(
        all.calculatorGen,
        pokemon1,
        pokemon2,
        new Move(all.calculatorGen, MOVEMAP.get(all[`move${moveIndex}_1`])?.name, {
          isCrit: all[`move${moveIndex}_crit1`],
          useZ: all[`move${moveIndex}_z1`],
          useMax: all.isDynamaxed1,
        }),
        field
      );
    }
    return null;
  });

  const defenderResults = Array.from(Array(4)).map((val, i) => {
    const moveIndex = i + 1;
    assertIndex(moveIndex);
    if (all.calculatorGen && all[`move${moveIndex}_1`]) {
      return calculate(
        all.calculatorGen,
        pokemon2,
        pokemon1,
        new Move(all.calculatorGen, MOVEMAP.get(all[`move${moveIndex}_2`])?.name, {
          isCrit: all[`move${moveIndex}_crit2`],
          useZ: all[`move${moveIndex}_z2`],
          useMax: all.isDynamaxed2,
        }),
        field
      );
    }
    return null;
  });

  assertResult(attackerResults);
  assertResult(defenderResults);

  return { pokemon1, pokemon2, attackerResults, defenderResults };
}

export default useCalculate;
