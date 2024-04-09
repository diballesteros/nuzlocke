import { useCallback } from 'react';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import styles from './Range.module.scss';

interface RangeProps {
  label: string;
  name: keyof TCalculatorForm;
  max: number;
}

function Range({ label, name, max }: RangeProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const fieldValue = form[name] as number;

  const getBarFill = useCallback(() => {
    return { backgroundSize: `${(fieldValue * 100) / max || 0}% 100%` };
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
        onChange={(e) => {
          update({ [name]: Number(e.target.value) });
        }}
        value={fieldValue}
      />
      <output className={styles.output}>{fieldValue}</output>
    </>
  );
}

export default Range;
