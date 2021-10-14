import { calculate, Field, Move, Pokemon, Result } from '@smogon/calc';
import { Control, useWatch } from 'react-hook-form';
import { GenderCalc } from 'constants/constant';
import { POKEMAP } from 'constants/pokemon';
import { TCalculatorForm } from 'constants/types';

function useCalculate(control: Control<TCalculatorForm>): Result {
  const all = useWatch({ control });
  const result = calculate(
    5,
    new Pokemon(all.calculatorGen, POKEMAP.get(all.pokemon1)?.text, {
      ability: all.ability1,
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
      item: all.item1,
      gender: GenderCalc[all.gender1],
      level: all.level1,
      nature: all.nature1,
      status: all.status1,
    }),
    new Pokemon(all.calculatorGen, POKEMAP.get(all.pokemon2)?.text, {
      item: 'Eviolite',
      nature: 'Calm',
      evs: { spd: 252 },
    }),
    new Move(all.calculatorGen, 'Wood Hammer'),
    new Field({
      attackerSide: {
        cannonade: all.cannonade1,
        isAuroraVeil: all.isAuroraVeil1,
        isBattery: all.isBattery1,
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
    })
  );

  return result;
}

export default useCalculate;
