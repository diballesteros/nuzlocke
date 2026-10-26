import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

// Parity with Semantic UI's Dropdown without search. Radix Select gives the listbox, keyboard handling
// and positioning (it portals the menu, so it isn't clipped). Four looks:
// - `field` (default): the `selection` Dropdown, a white field showing the value and a caret, over a
//   white menu attached below it;
// - `inline`: the `inline selection` Dropdown, the same in the page's font with a bold value;
// - `button`: the `button` Dropdown, a grey button with fixed text (the placeholder; keep `value`
//   empty) and a caret, over a free-standing menu. Picking an option runs an action;
// - `text`: the `inline` Dropdown, just the bold value and a caret, over a free-standing menu.

type SelectLook = 'button' | 'field' | 'inline' | 'text';

// Semantic's reset styles every <button>, so font, size, line height and margin need !
const FIELD =
  'group relative inline-block min-h-[2.71428571em] min-w-[14em] cursor-pointer rounded-[0.28571429rem] border border-solid border-field-border bg-white py-[0.78571429em] pr-[2.1em] pl-[1em] text-left text-[1rem]! leading-[1em]! wrap-break-word whitespace-normal text-field-foreground outline-none m-0! transition-[box-shadow] duration-100 hover:border-field-border-hover focus-visible:border-dropdown-active-border data-[state=open]:z-10 data-[state=open]:rounded-b-none data-[state=open]:border-dropdown-active-border data-[state=open]:shadow-[0_2px_3px_0_rgba(34,36,38,0.15)]';

const TRIGGER: Record<SelectLook, string> = {
  button: cn(buttonVariants({ variant: 'secondary' }), 'group relative'),
  field: cn(FIELD, 'font-control!'),
  inline: cn(FIELD, '[font-family:inherit]! font-bold'),
  text: 'group relative m-0! inline-block cursor-pointer border-0 bg-transparent p-0 text-left [font-family:inherit]! text-[1rem]! leading-[1em]! font-bold text-inherit outline-none',
};

const CARET: Record<SelectLook, string> = {
  button: 'ml-[1em] inline-block align-middle',
  field: 'absolute top-[16px] right-[13px]',
  inline: 'absolute top-[16px] right-[25.67px]',
  text: 'mx-[0.21428571em] inline-block align-middle',
};

// The selection looks' menu hangs from the field; the others float below their trigger
const ATTACHED = (look: SelectLook) => look === 'field' || look === 'inline';

export interface SelectOption {
  text: string;
  value: string;
}

interface SelectProps {
  'aria-label'?: string;
  className?: string;
  // Render the menu inside the element carrying data-testid, as Semantic did, instead of portalling
  // it: specs that look for options inside the dropdown keep working
  contained?: boolean;
  'data-testid'?: string;
  look?: SelectLook;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  value: string;
}

function Select({
  'aria-label': ariaLabel,
  className,
  contained = false,
  'data-testid': dataTestId,
  look = 'field',
  onChange,
  options,
  placeholder,
  value,
}: SelectProps) {
  const content = (
    <SelectPrimitive.Content
      align="start"
      className={cn(
        'z-1100 overflow-hidden bg-white shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] outline-none',
        ATTACHED(look)
          ? 'w-(--radix-select-trigger-width) rounded-b-[0.28571429rem] border border-t-0 border-solid border-dropdown-active-border'
          : 'min-w-(--radix-select-trigger-width) rounded-md border border-solid border-field-border'
      )}
      position="popper"
      side="bottom"
    >
      <SelectPrimitive.Viewport className="max-h-[8.01428571rem] min-[768px]:max-h-[10.68571429rem] min-[992px]:max-h-[16.02857143rem] min-[1920px]:max-h-[21.37142857rem]">
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            className="relative block cursor-pointer border-0 border-t border-solid border-dropdown-item-border px-[1.14285714rem] py-[0.78571429rem] text-left text-[1rem] leading-[1em] text-field-foreground outline-none first:border-t-0 data-highlighted:bg-[rgba(0,0,0,0.05)] data-highlighted:text-[rgba(0,0,0,0.95)] data-[state=checked]:font-bold data-[state=checked]:text-[rgba(0,0,0,0.95)]"
            value={option.value}
          >
            <SelectPrimitive.ItemText>{option.text}</SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  );

  const trigger = (
    <SelectPrimitive.Trigger
      aria-label={ariaLabel}
      className={cn(TRIGGER[look], contained ? 'w-full' : className)}
      data-slot="select"
      data-testid={contained ? undefined : dataTestId}
    >
      <span
        className={ATTACHED(look) ? 'group-data-[state=open]:text-[rgba(0,0,0,0.8)]' : undefined}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
      </span>
      {/* Semantic's caret, drawn where its icon font put it (after the text on a button) */}
      <svg
        aria-hidden
        className={cn('opacity-80', CARET[look])}
        fill="currentColor"
        height="3.8"
        viewBox="0 0 7.5 3.8"
        width="7.5"
      >
        <polygon points="0,0 7.5,0 3.75,3.8" />
      </svg>
    </SelectPrimitive.Trigger>
  );

  return (
    <SelectPrimitive.Root onValueChange={onChange} value={value}>
      {contained ? (
        <div className={cn('relative', className)} data-testid={dataTestId}>
          {trigger}
          {content}
        </div>
      ) : (
        <>
          {trigger}
          <SelectPrimitive.Portal>{content}</SelectPrimitive.Portal>
        </>
      )}
    </SelectPrimitive.Root>
  );
}

export { Select };
