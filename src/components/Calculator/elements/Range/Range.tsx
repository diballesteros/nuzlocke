import { useCallback } from 'react';
import { Control, UseFormRegister, useWatch } from 'react-hook-form';
import { TCalculatorForm } from 'constants/types';
import styles from './Range.module.scss';

interface RangeProps {
  control: Control<TCalculatorForm>;
  label: string;
  name: keyof TCalculatorForm;
  max: number;
  register: UseFormRegister<TCalculatorForm>;
}

function Range({ control, label, name, max, register }: RangeProps): JSX.Element {
  const fieldValue = useWatch({ control, name });

  const getBarFill = useCallback(() => {
    return { backgroundSize: `${((fieldValue as number) * 100) / max || 0}% 100%` };
  }, [fieldValue, max]);

  return (
    <>
      <label className={styles.label} htmlFor={name}>
        {label}:
      </label>
      <input
        className={styles.input}
        data-testid={name}
        id={name}
        style={getBarFill()}
        type="range"
        min="0"
        max={max}
        {...register(name, { valueAsNumber: true })}
      />
      <output className={styles.output}>{fieldValue}</output>
    </>
  );
}

export default Range;
