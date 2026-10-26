import { Popover as PopoverPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `<Popup on="click" pinned position="top center" inverted={darkMode}>`:
// a white bubble above its trigger with a small arrow, dark in dark mode. A click on the trigger
// toggles it and a click anywhere else closes it. Radix Popover portals it, so it isn't clipped.

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align="center"
        side="top"
        sideOffset={10}
        className={cn(
          'relative z-1900 max-w-[250px] rounded-[0.28571429rem] border border-solid border-popup-border bg-white px-[1em] py-[0.833em] text-[1rem] leading-[1.4285em] font-normal text-field-foreground shadow-[0_2px_4px_0_rgba(34,36,38,0.12),0_2px_10px_0_rgba(34,36,38,0.15)] outline-none dark:border-0 dark:bg-popup-inverted dark:text-white dark:shadow-none',
          className
        )}
        {...props}
      >
        {children}
        {/* Semantic's arrow: a rotated square half under the bubble's bottom edge */}
        <span
          aria-hidden
          className="absolute -bottom-[0.30714286em] left-1/2 -ml-[0.30714286em] size-[0.71428571em] rotate-45 bg-white shadow-[1px_1px_0_0_var(--color-popup-arrow)] dark:bg-popup-inverted dark:shadow-none"
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
