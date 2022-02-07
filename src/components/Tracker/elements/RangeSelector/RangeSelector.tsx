import { useCallback } from 'react';
import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
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

  const handleIncrement = () => {
    if (type.label === 'EV' && value + 1 <= EV.max) {
      onChange(value + 1);
    }
    if (type.label === 'IV' && value + 1 <= IV.max) {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value - 1 >= 0) {
      onChange(value - 1);
    }
  };

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
      <Button
        aria-label="substract"
        className={styles.button}
        data-testid={`${name}-substract`}
        icon
        onClick={handleDecrement}
      >
        <Icon name="minus" />
      </Button>
      <output className={styles.output}>{value}</output>
      <Button
        aria-label="add"
        className={styles.button}
        data-testid={`${name}-add`}
        icon
        onClick={handleIncrement}
      >
        <Icon name="plus" />
      </Button>
    </>
  );
}

export default RangeSelector;
