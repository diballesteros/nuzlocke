import { useCallback } from 'react';
import styles from 'components/Calculator/elements/Range/Range.module.scss';

interface RangeSelectorProps {
  name: string;
  onChange: (newValue: number) => void;
  value: number;
}

const EV = {
  label: 'EV',
  max: 255,
};

const IV = {
  label: 'IV',
  max: 31,
};

function RangeSelector({ name, onChange, value }: RangeSelectorProps): JSX.Element {
  const type = name.includes('ev') ? EV : IV;

  const getBarFill = useCallback(() => {
    return { backgroundSize: `${(value * 100) / type.max || 0}% 100%` };
  }, [value, type.max]);

  return (
    <>
      <label className={styles.label} htmlFor={name}>
        {type.label}:
      </label>
      <input
        className={styles.input}
        data-testid={name}
        id={name}
        style={getBarFill()}
        type="range"
        min="0"
        max={type.max}
        onChange={(e) => onChange(Number(e.target.value))}
        value={value}
      />
      <output className={styles.output}>{value}</output>
    </>
  );
}

export default RangeSelector;
