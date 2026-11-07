import { useCallback } from 'react';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import { cn } from '@/lib/utils';

// Semantic's grey track filled in the badge colour up to the value (a background sized by the
// value), with a round thumb that glows on hover and press
export const SLIDER =
  'm-0 h-(--spacing-2) cursor-pointer appearance-none self-center rounded-[5px] bg-[grey] [background-image:linear-gradient(var(--badge),var(--badge))] bg-no-repeat [&::-webkit-slider-runnable-track]:appearance-none [&::-webkit-slider-runnable-track]:border-none [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-runnable-track]:shadow-none [&::-webkit-slider-thumb]:size-[1.429rem] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-badge [&::-webkit-slider-thumb]:shadow-[0_0_2px_0_var(--color-slider-shadow)] [&::-webkit-slider-thumb]:transition-[background] [&::-webkit-slider-thumb]:duration-300 [&::-webkit-slider-thumb]:ease-in-out [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_8px_var(--color-badgeopac)] [&::-webkit-slider-thumb]:active:shadow-[0_0_0_11px_var(--color-badgeopac)] [&::-webkit-slider-thumb]:active:transition-[box-shadow,left,bottom] [&::-webkit-slider-thumb]:active:duration-350 [&::-webkit-slider-thumb]:active:ease-[cubic-bezier(0.4,0,0.2,1)]';

// SLIDER in the primary blue (5s, and the encounter editor's): the filled track and the thumb
export const PRIMARY_SLIDER = cn(
  SLIDER,
  'min-w-[3rem] flex-1 bg-contrast-border [background-image:linear-gradient(var(--color-primary),var(--color-primary))] [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_8px_color-mix(in_srgb,var(--color-primary)_20%,transparent)] [&::-webkit-slider-thumb]:active:shadow-[0_0_0_11px_color-mix(in_srgb,var(--color-primary)_20%,transparent)]'
);

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
      <label
        className="text-(length:--font-size-1) font-bold text-row-muted select-none"
        htmlFor={name}
      >
        {label}
      </label>
      <input
        className={PRIMARY_SLIDER}
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
      <output
        className="text-right text-(length:--font-size-2) font-bold text-foreground tabular-nums select-none"
        htmlFor={name}
      >
        {fieldValue}
      </output>
    </>
  );
}

export default Range;
