import { useCallback } from 'react';
import type { TCalculatorForm } from 'constants/types';
import useStore from 'store';
import { cn } from '@/lib/utils';

interface ButtonControllerProps {
  'aria-label'?: string;
  className?: string;
  label: string;
  name: keyof TCalculatorForm;
}

// A small outlined toggle (5s): tinted and ringed in the primary blue while it's on, and pressed
// for assistive tech
export const CHIP =
  'm-0! inline-flex min-h-[1.857rem] shrink-0 cursor-pointer items-center justify-center rounded-md border border-solid border-contrast-border bg-transparent px-(--spacing-2) py-[0.214rem] text-center [font-family:inherit]! text-(length:--font-size-1)! leading-[1.2]! font-bold text-row-muted outline-none hover:bg-foreground/8 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring aria-pressed:border-primary aria-pressed:bg-primary/12 aria-pressed:text-row-link';

function ButtonController({
  'aria-label': ariaLabel,
  className,
  label,
  name,
}: ButtonControllerProps): React.JSX.Element {
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const toggle = () => {
    update({ [name]: !form[name] });
  };

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={!!form[name]}
      className={cn(CHIP, className)}
      data-testid={name}
      onClick={toggle}
      type="button"
    >
      {label}
    </button>
  );
}

export default ButtonController;
