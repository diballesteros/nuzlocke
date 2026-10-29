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
// where the 7.5px one is. `icon` replaces the caret with another glyph (the tracker's Nature button),
// `align="end"` lines the menu up with the trigger's right edge (`direction="left"`), and `scrolling`
// is Semantic's `scrolling` menu: no rules between items, which don't wrap, and a taller cap.

type SelectLook = 'button' | 'contrast' | 'field' | 'inline' | 'text';

// Semantic's reset styles every <button>, so font, size, line height and margin need !
const FIELD =
  'group relative inline-block min-h-[2.71428571em] min-w-[14em] cursor-pointer rounded-[0.28571429rem] border border-solid border-field-border bg-white py-[0.78571429em] pr-[2.1em] pl-[1em] text-left text-[1rem]! leading-[1em]! wrap-break-word whitespace-normal text-field-foreground outline-none m-0! transition-[box-shadow] duration-100 hover:border-field-border-hover focus-visible:border-dropdown-active-border data-[state=open]:z-10 data-[state=open]:rounded-b-none data-[state=open]:border-dropdown-active-border data-[state=open]:shadow-[0_2px_3px_0_rgba(34,36,38,0.15)]';

const TRIGGER: Record<SelectLook, string> = {
  button: cn(buttonVariants({ variant: 'secondary' }), 'group relative'),
  contrast: cn(
    FIELD,
    // Dropdown.module.scss's borders were important, so the open field keeps its hover border
    // instead of Semantic's blue (a click opens it, so the pointer is over it; Radix turns off
    // pointer events outside the menu, so :hover can't tell), and the value drops to normal weight
    '[font-family:inherit]! border-contrast-border bg-transparent font-bold text-foreground hover:border-foreground data-[state=open]:border-foreground data-[state=open]:font-normal'
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

// A Semantic selection menu that hits its max height (a long list, like the games): the max height
// counts its bottom border, and its first item keeps the rule above it. The viewport inside is
// clipped by that pixel. Pass it as menuClassName (the header's game select, Add game's template)
export const SELECTION_MENU =
  'max-h-[8.01428571rem] min-[768px]:max-h-[10.68571429rem] min-[992px]:max-h-[16.02857143rem] min-[1920px]:max-h-[21.37142857rem] [&_[role=option]:first-child]:border-t!';

// Radix hides the rest of the page from assistive tech while a menu is open (aria-hidden's
// hideOthers) but leaves it focusable, which axe reports as aria-hidden-focus. This makes the same
// elements inert: everything outside the menu's ancestors, except aria-live regions and scripts.
// Not aria-hidden's own inertOthers: it shares one counter with hideOthers, so whichever undo ran
// first would leave the other's attribute behind
function inertOthers(menu: Element) {
  const body = menu.ownerDocument.body;
  const targets = new Set([menu, ...body.querySelectorAll('[aria-live], script')]);
  const keep = new Set<Element>();
  for (const target of targets) {
    for (let el: Element | null = target; el && !keep.has(el); el = el.parentElement) keep.add(el);
  }
  const made: Element[] = [];
  const walk = (parent: Element) => {
    if (targets.has(parent)) return;
    for (const child of parent.children) {
      if (keep.has(child)) walk(child);
      else if (!child.hasAttribute('inert')) {
        child.setAttribute('inert', '');
        made.push(child);
      }
    }
  };
  walk(body);
  return () => made.forEach((el) => el.removeAttribute('inert'));
}

// The selection looks' menu hangs from the field; the others float below their trigger
const ATTACHED = (look: SelectLook) => look === 'contrast' || look === 'field' || look === 'inline';

export interface SelectOption {
  // Drawn before the text in the menu only, like a Semantic option's `icon`
  icon?: React.ReactNode;
  text: string;
  value: string;
}

interface SelectProps {
  align?: 'end' | 'start';
  'aria-label'?: string;
  className?: string;
  clearable?: boolean;
  // Render the menu inside the element carrying data-testid, as Semantic did, instead of portalling
  // it: specs that look for options inside the dropdown keep working
  contained?: boolean;
  caret?: 'font';
  // Moves the font caret right by a fraction of a pixel, inside its viewBox (Chrome snaps the
  // positioned SVG itself to whole pixels)
  caretShift?: number;
  'data-testid'?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  look?: SelectLook;
  // Extra classes for the menu, and its gap below the trigger (Semantic's `basic labeled` menus
  // hang 2px lower)
  menuClassName?: string;
  menuOffset?: number;
  // What takes up the fraction of a pixel Radix dropped: the whole menu (the default), or only its
  // content, so the menu's borders stay on whole pixels as a Semantic menu's did when it hung from
  // its field in the same layer (the header's game select)
  menuShift?: 'content' | 'menu';
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  scrolling?: boolean;
  text?: string;
  // With `contained`, className goes to the wrapper and this to the trigger
  triggerClassName?: string;
  value: string;
}

function Select({
  align = 'start',
  'aria-label': ariaLabel,
  caret,
  caretShift = 0,
  className,
  clearable = false,
  contained = false,
  'data-testid': dataTestId,
  disabled = false,
  icon,
  look = 'field',
  menuClassName,
  menuOffset = 0,
  menuShift = 'menu',
  onChange,
  options,
  placeholder,
  scrolling = false,
  text,
  triggerClassName,
  value,
}: SelectProps) {
  const t = useTranslation('common').t;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  // Radix places the menu on whole pixels; Semantic's hung exactly from the field, which in a row
  // can sit at a fraction of a pixel. Shift the menu by what the rounding dropped. While the menu is
  // open the rest of the page is inert, until the ref's cleanup runs as it closes
  const onMenu = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return undefined;
      requestAnimationFrame(() => {
        const field = triggerRef.current?.getBoundingClientRect();
        const menu = node.getBoundingClientRect();
        if (!field) return;
        const above = node.dataset.side === 'top';
        const dx = align === 'end' ? field.right - menu.right : field.left - menu.left;
        const dy = above
          ? field.top - menuOffset - menu.bottom
          : field.bottom + menuOffset - menu.top;
        if (Math.abs(dx) >= 1 || Math.abs(dy) >= 1) return;
        const target =
          menuShift === 'content'
            ? node.querySelector<HTMLElement>('[data-radix-select-viewport]')
            : node;
        if (target) target.style.translate = `${dx}px ${dy}px`;
      });
      return inertOthers(node);
    },
    [align, menuOffset, menuShift]
  );
  const content = (
    <SelectPrimitive.Content
      ref={onMenu}
      align={align}
      className={cn(
        'z-1100 overflow-hidden bg-white shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] outline-none',
        ATTACHED(look)
          ? 'w-(--radix-select-trigger-width) rounded-b-[0.28571429rem] border border-t-0 border-solid border-dropdown-active-border'
          : 'min-w-(--radix-select-trigger-width) rounded-md border border-solid border-field-border data-[side=top]:rounded-b-none data-[side=top]:shadow-[0_0_3px_0_rgba(0,0,0,0.08)]',
        menuClassName
      )}
      // A portalled menu carries the `-options` test id, which the helpers look in as well
      data-testid={!contained && dataTestId ? `${dataTestId}-options` : undefined}
      position="popper"
      side="bottom"
      sideOffset={menuOffset}
    >
      <SelectPrimitive.Viewport
        className={
          scrolling
            ? 'max-h-[10.28571429rem] min-[768px]:max-h-[15.42857143rem] min-[992px]:max-h-[20.57142857rem]'
            : 'max-h-[8.01428571rem] min-[768px]:max-h-[10.68571429rem] min-[992px]:max-h-[16.02857143rem] min-[1920px]:max-h-[21.37142857rem]'
        }
      >
        {/* Semantic shaded the keyboard's item at 0.03 and the hovered one at 0.05; Radix highlights
            both alike, so the hover shade comes from :hover */}
        {options.map((option) => (
          <SelectPrimitive.Item
            key={option.value}
            className={cn(
              'group/item relative block cursor-pointer border-0 border-t border-solid border-dropdown-item-border px-[1.14285714rem] py-[0.78571429rem] text-left text-[1rem] leading-[1em] text-field-foreground outline-none first:border-t-0 hover:bg-[rgba(0,0,0,0.05)] data-highlighted:bg-[rgba(0,0,0,0.03)] data-highlighted:text-[rgba(0,0,0,0.95)] data-[state=checked]:font-bold data-[state=checked]:text-[rgba(0,0,0,0.95)]',
              scrolling && 'border-t-0 whitespace-nowrap'
            )}
            value={option.value}
          >
            {option.icon}
            <SelectPrimitive.ItemText>{option.text}</SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  );

  const trigger = (
    <SelectPrimitive.Trigger
      aria-label={ariaLabel}
      ref={triggerRef}
      className={cn(
        TRIGGER[look],
        'disabled:pointer-events-none disabled:cursor-default disabled:opacity-45',
        contained ? 'w-full' : className,
        triggerClassName
      )}
      data-slot="select"
      data-testid={contained ? undefined : dataTestId}
    >
      <span
        className={
          ATTACHED(look) && look !== 'contrast'
            ? 'group-data-[state=open]:text-[rgba(0,0,0,0.8)]'
            : undefined
        }
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
        (icon ?? (
          // Semantic's caret, drawn where its icon font put it (after the text on a button)
          <svg
            aria-hidden
            className={cn('opacity-80', CARET[look], caret === 'font' && 'right-[25.48px]')}
            fill="currentColor"
            height={caret === 'font' ? 4.12 : 3.8}
            viewBox={caret === 'font' ? `${-0.15 - caretShift} 0 8.24 4.12` : '0 0 7.5 3.8'}
            width={caret === 'font' ? 8.24 : 7.5}
          >
            {caret === 'font' ? <path d={FONT_CARET} /> : <polygon points="0,0 7.5,0 3.75,3.8" />}
          </svg>
        ))
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
