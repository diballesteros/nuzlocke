import { calculate, Field, Move, Pokemon, Result } from '@smogon/calc';
import { useMemo } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { GenderCalc } from 'constants/constant';
import { MOVEMAP } from 'constants/moves';
import { POKEMAP } from 'constants/pokemon';
import { TCalculatorForm } from 'constants/types';

function useCalculate(control: Control<TCalculatorForm>): {
  pokemon1: Pokemon;
  pokemon2: Pokemon;
  attackerResults: [Result, Result, Result, Result];
  defenderResults: [Result, Result, Result, Result];
} {
  const all = useWatch({ control });

  const pokemon1 = useMemo(() => {
    if (all.calculatorGen && all.pokemon1) {
      return new Pokemon(all.calculatorGen, POKEMAP.get(all.pokemon1)?.text, {
        ability: all.ability1,
        abilityOn: true,
        ivs: {
          hp: all.ivhp1 ?? undefined,
          atk: all.ivatk1 ?? undefined,
          def: all.ivdef1 ?? undefined,
          spa: all.ivspatk1 ?? undefined,
          spd: all.ivspdef1 ?? undefined,
          spe: all.ivspeed1 ?? undefined,
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
        status: all.status1,
      });
    }
    return null;
  }, [all]);

  const pokemon2 = useMemo(() => {
    if (all.calculatorGen && all.pokemon2) {
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
          hp: all.ivhp2 ?? undefined,
          atk: all.ivatk2 ?? undefined,
          def: all.ivdef2 ?? undefined,
          spa: all.ivspatk2 ?? undefined,
          spd: all.ivspdef2 ?? undefined,
          spe: all.ivspeed2 ?? undefined,
        },
        isDynamaxed: all.isDynamaxed1,
        item: all.item2,
        level: all.level2,
        nature: all.nature2,
        status: all.status2,
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

  const attackerOne =
    all.calculatorGen && all.move1_1
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move1_1)?.name),
          field
        )
      : null;

  const attackerTwo =
    all.calculatorGen && all.move1_2
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move2_1)?.name),
          field
        )
      : null;

  const attackerThree =
    all.calculatorGen && all.move3_1
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move3_1)?.name),
          field
        )
      : null;

  const attackerFour =
    all.calculatorGen && all.move4_1
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move4_1)?.name),
          field
        )
      : null;

  const defenderOne =
    all.calculatorGen && all.move1_2
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move1_2)?.name),
          field
        )
      : null;

  const defenderTwo =
    all.calculatorGen && all.move2_2
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move2_2)?.name),
          field
        )
      : null;

  const defenderThree =
    all.calculatorGen && all.move3_2
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move3_2)?.name),
          field
        )
      : null;

  const defenderFour =
    all.calculatorGen && all.move4_2
      ? calculate(
          all.calculatorGen,
          pokemon1,
          pokemon2,
          new Move(all.calculatorGen, MOVEMAP.get(all.move4_2)?.name),
          field
        )
      : null;

  return {
    pokemon1,
    pokemon2,
    attackerResults: [attackerOne, attackerTwo, attackerThree, attackerFour],
    defenderResults: [defenderOne, defenderTwo, defenderThree, defenderFour],
  };
}

export default useCalculate;
