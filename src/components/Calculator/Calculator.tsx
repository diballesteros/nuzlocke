import { calculate, Generations, ITEMS, Move, Pokemon } from '@smogon/calc';
import React from 'react';
import { useForm } from 'react-hook-form';
import styles from './Calculator.module.scss';

function Calculations({ watch }: any) {
  const allFields = watch();
  console.log(allFields);
  const result = calculate(
    5,
    new Pokemon(5, 'Gengar', {
      item: 'Choice Specs',
      nature: 'Timid',
      evs: { spa: 252 },
      boosts: { spa: 1 },
    }),
    new Pokemon(5, 'Chansey', {
      item: 'Eviolite',
      nature: 'Calm',
      evs: { hp: allFields.basehp1, spd: 252 },
    }),
    new Move(5, 'Wood Hammer')
  );
  return <div>{JSON.stringify(result)}</div>;
}

function Calculator(): JSX.Element {
  const { watch, register } = useForm();
  return (
    <form className={styles.container}>
      <Calculations watch={watch} />;
      <div className={styles.subcontainer}>
        <input placeholder="pokemon1" style={{ gridColumn: '1 / -1' }} />
        <input placeholder="level" style={{ gridColumn: '1 / 3' }} {...register('level1')} />
        <input placeholder="gender" style={{ gridColumn: '5 / -1' }} {...register('gender1')} />
        <span style={{ gridColumn: '3' }}>Base</span>
        <span style={{ gridColumn: '4' }}>IVs</span>
        <span style={{ gridColumn: '5' }}>EVs</span>
        <span style={{ gridColumn: '1' }}>HP</span>
        <input placeholder="basehp" {...register('basehp1')} />
        <input placeholder="IVHP" {...register('ivhp1')} />
        <input placeholder="EVHP" {...register('evhp1')} />
        <input placeholder="HPTotal" {...register('totalHP1')} />
        <span style={{ gridColumn: '1' }}>Attack</span>
        <input placeholder="baseattack" {...register('baseattack1')} />
        <input placeholder="IVattack" {...register('ivattack1')} />
        <input placeholder="EVattack" {...register('evattack1')} />
        <input placeholder="attacktotal" {...register('totalattack1')} />
        <input placeholder="attackmodifier" {...register('modifierattack1')} />
        <span style={{ gridColumn: '1' }}>Defense</span>
        <input placeholder="baseDefense" {...register('basedefense1')} />
        <input placeholder="IVDefense" {...register('ivdefense1')} />
        <input placeholder="EVDefense" {...register('evdefense1')} />
        <input placeholder="Defensetotal" {...register('totaldefense1')} />
        <input placeholder="Defensemodifier" {...register('modifierdefense1')} />
        <span style={{ gridColumn: '1' }}>SpAttack</span>
        <input placeholder="baseSpAttack" {...register('basespattack1')} />
        <input placeholder="IVSpAttack" {...register('ivspattack1')} />
        <input placeholder="EVSpAttack" {...register('evspattack1')} />
        <input placeholder="SpAttacktotal" {...register('totalspattack1')} />
        <input placeholder="SpAttackmodifier" {...register('modifierspattack1')} />
        <span style={{ gridColumn: '1' }}>SpDef</span>
        <input placeholder="baseSpDef" {...register('baseattack1')} />
        <input placeholder="IVSpDef" {...register('ivspdef1')} />
        <input placeholder="EVSpDef" {...register('evspdef1')} />
        <input placeholder="SpDeftotal" {...register('totalspdef1')} />
        <input placeholder="SpDefmodifier" {...register('modifierspdef1')} />
        <span style={{ gridColumn: '1' }}>Speed</span>
        <input placeholder="baseSpeed" {...register('basespeed1')} />
        <input placeholder="IVSpeed" {...register('ivspeed1')} />
        <input placeholder="EVSpeed" {...register('evspeed1')} />
        <input placeholder="Speedtotal" {...register('totalspeed1')} />
        <input placeholder="Speedmodifier" {...register('modifierspeed1')} />
        <span>Nature</span>
        <input placeholder="nature input" style={{ gridColumn: '2 / -1' }} />
        <span>Ability</span>
        <input placeholder="ability input" style={{ gridColumn: '2 / -1' }} />
        <span>Item</span>
        <input placeholder="item input" style={{ gridColumn: '2 / -1' }} />
        <span>Status</span>
        <input placeholder="status input" style={{ gridColumn: '2 / -1' }} />
        <span>Current HP</span>
        <input placeholder="status input" {...register('currenthp1')} />
        <span>/321</span>
      </div>
      <div>
        <input placeholder="pokemon2" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
        <input placeholder="pokemon" />
      </div>
    </form>
  );
}

export default Calculator;
