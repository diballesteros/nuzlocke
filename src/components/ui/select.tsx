import { X } from 'lucide-react';
import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

// Parity with Semantic UI's Dropdown without search. Radix Select gives the listbox, keyboard handling
// and positioning (it portals the menu, so it isn't clipped). Four looks:
// - `field` (default): the `selection` Dropdown, a white field showing the value and a caret, over a
//   white menu attached below it;
// - `inline`: the `inline selection` Dropdown, the same in the page's font with a bold value;
// - `button`: the `button` Dropdown, a grey button with fixed text (the placeholder; keep `value`
//   empty) and a caret, over a free-standing menu. Picking an option runs an action;
// - `text`: the `inline` Dropdown, just the bold value and a caret, over a free-standing menu;
// - `contrast`: the `inline selection` Dropdown with the app's Dropdown.module.scss, a transparent
//   field with a faint border in the page's colours (the Calculator's gender).
// `clearable` swaps the caret for Semantic's clear icon once there's a value, `text` shows fixed text
// in place of the value (the custom game's generation), and `disabled` dims it like Semantic.
// `caret="font"` draws the caret at the icon font's own size (8.24 × 4.12px, the Calculator), centred
// where the 7.5px one is.

type SelectLook = 'button' | 'contrast' | 'field' | 'inline' | 'text';

// Semantic's reset styles every <button>, so font, size, line height and margin need !
const FIELD =
  'group relative inline-block min-h-[2.71428571em] min-w-[14em] cursor-pointer rounded-[0.28571429rem] border border-solid border-field-border bg-white py-[0.78571429em] pr-[2.1em] pl-[1em] text-left text-[1rem]! leading-[1em]! wrap-break-word whitespace-normal text-field-foreground outline-none m-0! transition-[box-shadow] duration-100 hover:border-field-border-hover focus-visible:border-dropdown-active-border data-[state=open]:z-10 data-[state=open]:rounded-b-none data-[state=open]:border-dropdown-active-border data-[state=open]:shadow-[0_2px_3px_0_rgba(34,36,38,0.15)]';

const TRIGGER: Record<SelectLook, string> = {
  button: cn(buttonVariants({ variant: 'secondary' }), 'group relative'),
  contrast: cn(
    FIELD,
    '[font-family:inherit]! border-contrast-border bg-transparent font-bold text-foreground hover:border-foreground'
  ),
  field: cn(FIELD, 'font-control!'),
  inline: cn(FIELD, '[font-family:inherit]! font-bold'),
  text: 'group relative m-0! inline-block cursor-pointer border-0 bg-transparent p-0 text-left [font-family:inherit]! text-[1rem]! leading-[1em]! font-bold text-inherit outline-none',
};

// The icon font's caret (`caret="font"`): 45° sides and slightly rounded top corners. Chrome snaps
// a positioned SVG to whole pixels, so its viewBox (FONT_CARET_BOX) carries the last 0.15px
export const FONT_CARET = 'M1.1,0H7.14Q8.24,0 7.47,0.77L4.12,4.12L0.77,0.77Q0,0 1.1,0Z';
export const FONT_CARET_BOX = '-0.15 0 8.24 4.12';

const CARET: Record<SelectLook, string> = {
  button: 'ml-[1em] inline-block align-middle',
  contrast: 'absolute top-[16px] right-[25.67px]',
  field: 'absolute top-[16px] right-[13px]',
  inline: 'absolute top-[16px] right-[25.67px]',
  text: 'mx-[0.21428571em] inline-block align-middle',
};

// The selection looks' menu hangs from the field; the others float below their trigger
const ATTACHED = (look: SelectLook) => look === 'contrast' || look === 'field' || look === 'inline';

export interface SelectOption {
  text: string;
  value: string;
}

interface SelectProps {
  'aria-label'?: string;
  className?: string;
  clearable?: boolean;
  // Render the menu inside the element carrying data-testid, as Semantic did, instead of portalling
  // it: specs that look for options inside the dropdown keep working
  contained?: boolean;
  caret?: 'font';
  'data-testid'?: string;
  disabled?: boolean;
  look?: SelectLook;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  text?: string;
  value: string;
}

function Select({
  'aria-label': ariaLabel,
  caret,
  className,
  clearable = false,
  contained = false,
  'data-testid': dataTestId,
  disabled = false,
  look = 'field',
  onChange,
  options,
  placeholder,
  text,
  value,
}: SelectProps) {
  const t = useTranslation('common').t;
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
      className={cn(
        TRIGGER[look],
        'disabled:pointer-events-none disabled:cursor-default disabled:opacity-45',
        contained ? 'w-full' : className
      )}
      data-slot="select"
      data-testid={contained ? undefined : dataTestId}
    >
      <span
        className={ATTACHED(look) ? 'group-data-[state=open]:text-[rgba(0,0,0,0.8)]' : undefined}
      >
        {text ?? <SelectPrimitive.Value placeholder={placeholder} />}
      </span>
      {clearable && value ? (
        // Semantic's clear icon. It can't be a button inside the trigger, so it acts on pointerdown,
        // before Radix opens the menu
        <span
          aria-label={t('clear')}
          className="absolute top-0 right-[12px] flex h-full w-[31px] cursor-pointer items-center justify-center opacity-80 hover:opacity-100"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onChange('');
          }}
          role="button"
        >
          <X aria-hidden className="size-[0.9em]" strokeWidth={4} />
        </span>
      ) : (
        // Semantic's caret, drawn where its icon font put it (after the text on a button)
        <svg
          aria-hidden
          className={cn('opacity-80', CARET[look], caret === 'font' && 'right-[25.48px]')}
          fill="currentColor"
          height={caret === 'font' ? 4.12 : 3.8}
          viewBox={caret === 'font' ? FONT_CARET_BOX : '0 0 7.5 3.8'}
          width={caret === 'font' ? 8.24 : 7.5}
        >
          {caret === 'font' ? <path d={FONT_CARET} /> : <polygon points="0,0 7.5,0 3.75,3.8" />}
        </svg>
      )}
    </SelectPrimitive.Trigger>
  );

  return (
    <SelectPrimitive.Root disabled={disabled} onValueChange={onChange} value={value}>
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
