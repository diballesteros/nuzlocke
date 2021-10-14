import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
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

const T: Record<string, 'attacker' | 'defender'> = {
  '1': 'attacker',
  '2': 'defender',
};

function Stats({ form, pokemon }: StatsProps): JSX.Element {
  const { control, register, setValue } = form;
  const result = useCalculate(control);
  const totalHp = result[T[pokemon]].stats.hp;

  useEffect(() => {
    setValue(`currenthp${pokemon}`, totalHp);
  }, [pokemon, setValue, totalHp]);

  return (
    <section className={styles.container}>
      <div className={styles.currenthpContainer}>
        <label className={styles.label} htmlFor={`currenthp${pokemon}`}>
          Current Hp:
        </label>
        <input
          className={styles.currenthp}
          id={`currenthp${pokemon}`}
          type="number"
          {...register(`currenthp${pokemon}`, { valueAsNumber: true })}
        />
        <output>/{result[T[pokemon]].stats.hp}</output>
      </div>
      <details open={false}>
        <summary>
          HP <output>{totalHp}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivhp${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evhp${pokemon}`} register={register} {...EV} />
        </fieldset>
      </details>
      <details open={false}>
        <summary>
          ATK <output>{result[T[pokemon]].stats.atk}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivatk${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evatk${pokemon}`} register={register} {...EV} />
          <Modifier control={control} name={`modatk${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary>
          DEF <output>{result[T[pokemon]].stats.def}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivdef${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evdef${pokemon}`} register={register} {...EV} />
          <Modifier control={control} name={`moddef${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary>
          SP. ATK <output>{result[T[pokemon]].stats.spa}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivspatk${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evspatk${pokemon}`} register={register} {...EV} />
          <Modifier control={control} name={`modspatk${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary>
          SP. DEF <output>{result[T[pokemon]].stats.spd}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivspdef${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evspdef${pokemon}`} register={register} {...EV} />
          <Modifier control={control} name={`modspdef${pokemon}`} />
        </fieldset>
      </details>
      <details open={false}>
        <summary>
          SPEED <output>{result[T[pokemon]].stats.spe}</output>
        </summary>
        <fieldset className={styles.fieldset}>
          <Range control={control} name={`ivspeed${pokemon}`} register={register} {...IV} />
          <Range control={control} name={`evspeed${pokemon}`} register={register} {...EV} />
          <Modifier control={control} name={`modspeed${pokemon}`} />
        </fieldset>
      </details>
    </section>
  );
}

export default Stats;
