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
    new Field({ attackerSide: {} })
  );

  return result;
}

export default useCalculate;
