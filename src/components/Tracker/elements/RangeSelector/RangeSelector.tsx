import { useCallback } from 'react';
import { SLIDER } from 'components/Calculator/elements/Range/Range';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { ROW_ICON } from '../buttons';

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

function RangeSelector({ name, onChange, value }: RangeSelectorProps): React.JSX.Element {
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

  const handleTextChange = (newValue: string) => {
    const parsedNumber = Number(newValue);

    if (newValue && !isNaN(parsedNumber) && parsedNumber >= 0 && parsedNumber <= type.max) {
      onChange(Number(newValue));
    } else if (newValue === '') {
      onChange(0);
    }
  };

  return (
    <>
      <label className="grid place-content-center select-none" htmlFor={name}>
        {type.label}:
      </label>
      <input
        className={SLIDER}
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
        data-testid={`${name}-substract`}
        onClick={handleDecrement}
        size="icon"
        variant="secondary"
      >
        <MinusIcon className={ROW_ICON} />
      </Button>
      {/* The page's font stays normalize's, as before: only the weight and colours are set */}
      <input
        className="grid place-content-center rounded-[4px] border border-solid border-foreground bg-transparent px-(--spacing-1) py-(--spacing-0) text-center font-bold text-foreground select-none"
        data-testid={`input-${name}`}
        inputMode="numeric"
        onChange={(e) => handleTextChange(e.target.value)}
        value={value}
      />
      <Button
        aria-label="add"
        data-testid={`${name}-add`}
        onClick={handleIncrement}
        size="icon"
        variant="secondary"
      >
        <PlusIcon className={ROW_ICON} />
      </Button>
    </>
  );
}

export default RangeSelector;
