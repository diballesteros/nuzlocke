import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PRIMARY_SLIDER } from 'components/Calculator/elements/Range/Range';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ROW_GHOST } from '../buttons';

interface RangeSelectorProps {
  name: string;
  onChange: (newValue: number) => void;
  // The stat's short name ("HP", "Atk"), which the controls' names start with
  stat: string;
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

// The steppers draw muted so the number reads first; 36px on phones, the rows' touch floor
const STEP = cn(
  ROW_GHOST,
  'size-[1.857rem] text-row-muted hover:text-foreground max-sm:size-[2.571rem] [&_svg]:size-[1rem]'
);
// One IV or EV (5m): the slider, then the value between its − and + steppers. On phones a tag in
// front says which it is; wider, the stats table's column header does
function RangeSelector({ name, onChange, stat, value }: RangeSelectorProps): React.JSX.Element {
  const { t } = useTranslation('tracker');
  const type = name.includes('ev') ? EV : IV;
  const label = `${stat} ${type.label}`;

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
    <div className="flex min-w-0 items-center gap-(--spacing-1)">
      <span
        aria-hidden
        className="w-[1.714rem] shrink-0 text-(length:--font-size-1) font-bold text-row-muted sm:hidden"
      >
        {type.label}
      </span>
      <input
        aria-label={label}
        className={PRIMARY_SLIDER}
        data-testid={name}
        id={name}
        style={getBarFill()}
        type="range"
        min="0"
        max={type.max}
        onChange={(e) => onChange(Number(e.target.value))}
        value={value}
      />
      <button
        aria-label={t('lower', { name: label })}
        className={cn(STEP, 'ml-(--spacing-1)')}
        data-testid={`${name}-substract`}
        onClick={handleDecrement}
        title={t('lower', { name: label })}
        type="button"
      >
        <MinusIcon aria-hidden />
      </button>
      <input
        aria-label={label}
        className="h-[2.143rem] w-[3rem] shrink-0 max-sm:h-[2.571rem] rounded-md border border-solid border-contrast-border bg-transparent p-0 text-center text-(length:--font-size-2) font-bold text-foreground tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"
        data-testid={`input-${name}`}
        inputMode="numeric"
        onChange={(e) => handleTextChange(e.target.value)}
        value={value}
      />
      <button
        aria-label={t('raise', { name: label })}
        className={STEP}
        data-testid={`${name}-add`}
        onClick={handleIncrement}
        title={t('raise', { name: label })}
        type="button"
      >
        <PlusIcon aria-hidden />
      </button>
    </div>
  );
}

export default RangeSelector;
