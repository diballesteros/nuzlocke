import { Switch as SwitchPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `fitted toggle` Checkbox: a 3.5rem × 1.5rem pill, faint grey when off and
// blue when on, with a white knob that slides across. Radix gives it role="switch"; name it with
// aria-labelledby or aria-label, since Semantic's had no label of its own.
function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Semantic's reset styles every <button>, so its margin needs !
        'relative m-0! block h-[1.5rem] min-h-[1.5rem] w-[3.5rem] shrink-0 cursor-pointer rounded-full border-0 bg-[rgba(0,0,0,0.05)] p-0 outline-none transition-[background] duration-300 ease-in-out hover:bg-[rgba(0,0,0,0.15)] focus-visible:bg-[rgba(0,0,0,0.15)] data-[state=checked]:bg-primary',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="absolute top-0 -left-[0.05rem] size-[1.5rem] rounded-full bg-white [background-image:linear-gradient(transparent,rgba(0,0,0,0.05))] shadow-[0_1px_2px_0_rgba(34,36,38,0.15),inset_0_0_0_1px_rgba(34,36,38,0.15)] transition-[left] duration-300 ease-in-out data-[state=checked]:left-[2.15rem]"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
