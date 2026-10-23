import { Check } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's checkbox: a white 17px box with a 3px radius at the start of the label's
// 17px line, and a check mark once checked. Label it with a sibling <label htmlFor> (see
// CheckboxOption).
function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer absolute top-0 left-0 m-0! size-[17px] cursor-pointer rounded-[0.21428571rem] border border-solid border-toggle-border bg-white p-0 text-toggle-mark outline-none transition-[border-color] duration-100 hover:border-toggle-checked-border focus-visible:border-dropdown-active-border disabled:cursor-default! data-[state=checked]:border-toggle-checked-border',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="absolute inset-0 flex items-center justify-center"
      >
        <Check aria-hidden className="size-[14.5px] translate-[0.5px]" strokeWidth={4.5} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

// A checkbox with its label, laid out like Semantic's `<Checkbox label>`: the label is indented past
// the box, and clicking anywhere on the row toggles it.
function CheckboxOption({
  className,
  'data-testid': dataTestId,
  label,
  labelClassName,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  'data-testid'?: string;
  label: React.ReactNode;
  labelClassName?: string;
}) {
  const id = React.useId();

  return (
    <div
      className={cn('relative min-h-[17px] text-[1rem] leading-[17px]', className)}
      data-testid={dataTestId}
    >
      <Checkbox id={id} {...props} />
      <label
        className={cn(
          'block cursor-pointer pl-[1.85714em] select-none peer-disabled:cursor-default peer-disabled:opacity-50',
          labelClassName
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
}

export { Checkbox, CheckboxOption };
