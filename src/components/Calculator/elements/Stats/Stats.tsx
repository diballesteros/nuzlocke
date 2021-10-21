import { useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { Modifier, Range } from 'components/Calculator/elements';
import { TCalculatorForm } from 'constants/types';
import useCalculate from 'hooks/useCalculate';
import styles from './Stats.module.scss';

interface StatsProps {
  form: UseFormReturn<TCalculatorForm, object>;
  pokemon: '1' | '2';
}

const EV = {
  label: 'EV',
  max: 255,
};

const IV = {
  label: 'IV',
  max: 31,
};

const DV = {
  label: 'DV',
  max: 15,
};

function Stats({ form, pokemon }: StatsProps): JSX.Element {
  const { control, register, setValue } = form;
  const calcGen = useWatch({ control, name: 'calculatorGen' });
  const { pokemon1, pokemon2 } = useCalculate(control);
  const values = useWatch({ control, name: ['pokemon1', 'pokemon2'] });
  const currentPokemon = pokemon === '1' ? pokemon1 : pokemon2;
  const totalHp = currentPokemon?.stats?.hp;

  useEffect(() => {
    setValue(`currenthp${pokemon}`, totalHp);
  }, [pokemon, values, setValue, totalHp]);

  return (
    <section className={styles.container}>
      <div className={styles.currenthpContainer}>
        <label className={styles.label} htmlFor={`currenthp${pokemon}`}>
          Current Hp:
        </label>
        <input
          className={styles.currenthp}
          data-testid={`currenthp${pokemon}`}
          id={`currenthp${pokemon}`}
          type="number"
          {...register(`currenthp${pokemon}`, { valueAsNumber: true })}
        />
        <output>/{totalHp}</output>
      </div>
      <details open={false}>
        <summary data-testid={`hp${pokemon}-detail`}>
          HP <output>{totalHp}</output>
        </summary>
        {calcGen > 2 && (
          <fieldset className={styles.fieldset}>
            <Range control={control} name={`ivhp${pokemon}`} register={register} {...IV} />
            <Range control={control} name={`evhp${pokemon}`} register={register} {...EV} />
          </fieldset>
        )}
      </details>
      <details open={false}>
        <summary data-testid={`atk${pokemon}-detail`}>
          ATK <output>{currentPokemon?.stats?.atk ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {calcGen > 2 ? (
            <>
              <Range control={control} name={`ivatk${pokemon}`} register={register} {...IV} />
              <Range control={control} name={`evatk${pokemon}`} register={register} {...EV} />
            </>
          ) : (
            <Range control={control} name={`dvatk${pokemon}`} register={register} {...DV} />
          )}
          <Modifier control={control} name={`modatk${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary data-testid={`def${pokemon}-detail`}>
          DEF <output>{currentPokemon?.stats?.def ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {calcGen > 2 ? (
            <>
              <Range control={control} name={`ivdef${pokemon}`} register={register} {...IV} />
              <Range control={control} name={`evdef${pokemon}`} register={register} {...EV} />
            </>
          ) : (
            <Range control={control} name={`dvdef${pokemon}`} register={register} {...DV} />
          )}
          <Modifier control={control} name={`moddef${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary data-testid={`spatk${pokemon}-detail`}>
          {calcGen > 2 ? 'SP. ATK' : 'SPECIAL'} <output>{currentPokemon?.stats?.spa ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {calcGen > 2 ? (
            <>
              <Range control={control} name={`ivspatk${pokemon}`} register={register} {...IV} />
              <Range control={control} name={`evspatk${pokemon}`} register={register} {...EV} />
            </>
          ) : (
            <Range control={control} name={`dvspc${pokemon}`} register={register} {...DV} />
          )}
          <Modifier control={control} name={`modspatk${pokemon}`} />
        </fieldset>
      </details>
      {calcGen > 2 && (
        <details open={false}>
          <summary data-testid={`spdef${pokemon}-detail`}>
            SP. DEF <output>{currentPokemon?.stats?.spd ?? 0}</output>
          </summary>
          <fieldset className={styles.fieldset}>
            <Range control={control} name={`ivspdef${pokemon}`} register={register} {...IV} />
            <Range control={control} name={`evspdef${pokemon}`} register={register} {...EV} />
            <Modifier control={control} name={`modspdef${pokemon}`} />
          </fieldset>
        </details>
      )}
      <details open={false}>
        <summary data-testid={`speed${pokemon}-detail`}>
          SPEED <output>{currentPokemon?.stats?.spe ?? 0}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          {calcGen > 2 ? (
            <>
              <Range control={control} name={`ivspeed${pokemon}`} register={register} {...IV} />
              <Range control={control} name={`evspeed${pokemon}`} register={register} {...EV} />
            </>
          ) : (
            <Range control={control} name={`dvspeed${pokemon}`} register={register} {...DV} />
          )}
          <Modifier control={control} name={`modspeed${pokemon}`} />
        </fieldset>
      </details>
    </section>
  );
}

export default Stats;
