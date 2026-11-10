import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// `toggle` (the default): parity with Semantic UI's `fitted toggle` Checkbox, a 3.5rem × 1.5rem pill,
// faint grey when off and blue when on, with a white knob that slides across.
// `row` (Settings, 5w): a 36 × 20px pill whose 1px border is the muted text colour when off (3:1 or
// more against the card in both themes), filled blue when on, with the rows' focus ring.
// Radix gives it role="switch"; name it with aria-labelledby or aria-label.
const ROOT = {
  // Semantic's reset styles every <button>, so its margin needs !
  toggle:
    'relative m-0! block h-[1.5rem] min-h-[1.5rem] w-[3.5rem] shrink-0 cursor-pointer rounded-full border-0 bg-[rgba(0,0,0,0.05)] p-0 outline-none transition-[background] duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.15)] focus-visible:bg-[rgba(0,0,0,0.15)] data-[state=checked]:bg-primary',
  row: 'relative m-0 block h-[1.429rem] w-[2.571rem] shrink-0 cursor-pointer rounded-full border border-solid border-row-muted bg-foreground/12 p-0 outline-none transition-[background,border-color] duration-200 ease-in-out data-[state=unchecked]:hover:bg-foreground/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary motion-reduce:transition-none',
};
const THUMB = {
  toggle:
    'absolute top-0 -left-[0.05rem] size-[1.5rem] rounded-full bg-white [background-image:linear-gradient(transparent,rgba(0,0,0,0.05))] shadow-[0_1px_2px_0_rgba(34,36,38,0.15),inset_0_0_0_1px_rgba(34,36,38,0.15)] transition-[left] duration-300 ease-in-out data-[state=checked]:left-[2.15rem]',
  row: 'absolute top-px left-px size-[1.143rem] rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-transform duration-200 ease-in-out data-[state=checked]:translate-x-[1.143rem] motion-reduce:transition-none',
};

function Switch({
  className,
  look = 'toggle',
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { look?: 'row' | 'toggle' }) {
  return (
    <SwitchPrimitive.Root data-slot="switch" className={cn(ROOT[look], className)} {...props}>
      <SwitchPrimitive.Thumb data-slot="switch-thumb" className={THUMB[look]} />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
