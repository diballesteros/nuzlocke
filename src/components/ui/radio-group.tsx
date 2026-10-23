import { RadioGroup as RadioGroupPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return <RadioGroupPrimitive.Root data-slot="radio-group" className={className} {...props} />;
}

// Parity with Semantic UI's radio checkbox: a 15px white ring, 1px below the top of the label's
// 17px line, and a 7px bullet. Like Semantic's, the ring inherits box-sizing, so it grows to 17px
// inside a content-box parent, and the bullet then sits 1px up and left of centre, as it did.
// Label it with a sibling <label htmlFor> (see RadioGroupOption).
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'peer absolute top-px left-0 m-0! size-[15px] cursor-pointer rounded-full border border-solid border-toggle-border bg-white p-0 outline-none transition-[border-color] duration-100 hover:border-toggle-checked-border focus-visible:border-dropdown-active-border disabled:cursor-default! data-[state=checked]:border-toggle-checked-border',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="absolute top-[3px] left-[3px] size-[7px] rounded-full bg-toggle-mark"
      />
    </RadioGroupPrimitive.Item>
  );
}

// An item with its label, laid out like Semantic's `<Radio label>`: the label is indented past the
// ring, and dims with it when disabled.
function RadioGroupOption({
  className,
  'data-testid': dataTestId,
  id,
  label,
  labelClassName,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & {
  'data-testid'?: string;
  label: React.ReactNode;
  labelClassName?: string;
}) {
  const generatedId = React.useId();
  const itemId = id ?? generatedId;

  return (
    <div
      className={cn('relative min-h-[15px] text-[1rem] leading-[17px]', className)}
      data-testid={dataTestId}
    >
      <RadioGroupItem id={itemId} {...props} />
      <label
        className={cn(
          'block cursor-pointer pl-[1.85714em] select-none peer-disabled:cursor-default peer-disabled:opacity-50',
          labelClassName
        )}
        htmlFor={itemId}
      >
        {label}
      </label>
    </div>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupOption };
