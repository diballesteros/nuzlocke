import { Command as CommandPrimitive } from 'cmdk';
import { X } from 'lucide-react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `inline search selection` Dropdown plus the app's Dropdown.module.scss:
// the search input sits in the trigger, typing filters by substring in the original order, Enter
// picks the highlighted match, and the menu stays white in both themes. cmdk gives the listbox and
// keyboard handling, Radix Popover the positioning (it portals the menu, so it isn't clipped).

export interface ComboboxOption {
  image?: React.ReactNode;
  text: string;
  value: string;
}

interface ComboboxProps {
  'aria-label': string;
  className?: string;
  clearable?: boolean;
  'data-testid'?: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder: string;
  value: string;
}

// Like Semantic's search: a case-insensitive substring match that keeps the original order
const filterOptions = (options: ComboboxOption[], search: string) =>
  search
    ? options.filter((option) => option.text.toLowerCase().includes(search.toLowerCase()))
    : options;

// Semantic's `.ui.avatar.image` inside a dropdown: a 2em image that doesn't grow the line
function Avatar({ children }: { children: React.ReactNode }) {
  return (
    <span className="-my-[0.5em] mr-[0.78571429em] inline-block h-[2em] max-h-[2em] align-top">
      {children}
    </span>
  );
}

function Combobox({
  'aria-label': ariaLabel,
  className,
  clearable = false,
  'data-testid': dataTestId,
  onChange,
  options,
  placeholder,
  value,
}: ComboboxProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [highlighted, setHighlighted] = React.useState('');
  const listId = React.useId();
  const valueId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const selected = options.find((option) => option.value === value);

  const filtered = React.useMemo(() => filterOptions(options, query), [options, query]);

  const show = (next: boolean) => {
    setOpen(next);
    if (next) setHighlighted(value || filtered[0]?.value || '');
    else setQuery('');
  };

  const pick = (next: string) => {
    onChange(next);
    show(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={show}>
      <PopoverPrimitive.Anchor asChild>
        <CommandPrimitive
          shouldFilter={false}
          disablePointerSelection
          value={highlighted}
          onValueChange={setHighlighted}
          ref={rootRef}
          data-slot="combobox"
          data-testid={dataTestId}
          className={cn(
            'relative block min-w-[14em] cursor-pointer rounded-[4px] border border-solid border-contrast-border bg-transparent py-[0.78571429em] pr-[2.1em] pl-[1em] text-left text-[1rem] leading-[1em] text-foreground outline-none hover:border-foreground',
            open &&
              'z-10 rounded-b-none shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] [&>[data-slot=combobox-value]]:font-normal [&>[data-slot=combobox-value]]:text-[rgba(115,115,115,0.87)]',
            className
          )}
          onClick={() => {
            inputRef.current?.focus();
            if (!open) show(true);
          }}
        >
          <input
            ref={inputRef}
            aria-autocomplete="list"
            aria-controls={open ? listId : undefined}
            // The value is drawn over the input; announce it as the input's description
            aria-describedby={valueId}
            aria-expanded={open}
            aria-label={ariaLabel}
            autoComplete="off"
            className="absolute top-0 left-px z-2 m-0! h-full w-[calc(100%-var(--spacing-8))] cursor-text border-none bg-transparent py-[0.67857143em] pr-[2.1em] pl-[1em] leading-[1.21428571em]! text-foreground outline-none"
            role="combobox"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlighted(filterOptions(options, e.target.value)[0]?.value ?? '');
              if (!open) setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && open) {
                e.stopPropagation();
                show(false);
              } else if ((e.key === 'ArrowDown' || e.key === 'Enter') && !open) {
                e.preventDefault();
                e.stopPropagation();
                show(true);
              }
            }}
          />
          <div
            aria-hidden
            id={valueId}
            data-slot="combobox-value"
            className={cn(
              'pointer-events-none relative left-px z-3 inline-block font-bold',
              query && '[visibility:hidden]'
            )}
          >
            {selected ? (
              <>
                {selected.image && <Avatar>{selected.image}</Avatar>}
                {selected.text}
              </>
            ) : (
              placeholder
            )}
          </div>
          {clearable && selected ? (
            <button
              aria-label={t('clear')}
              className="absolute top-0 right-[12px] z-3 m-0! flex h-full w-[31px] cursor-pointer items-center justify-center border-none bg-transparent p-0 text-foreground opacity-80 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                pick('');
              }}
              type="button"
            >
              <X aria-hidden className="size-[0.9em]" strokeWidth={4} />
            </button>
          ) : (
            // Semantic's caret, drawn where its icon font put it
            <svg
              aria-hidden
              className="absolute top-[16px] right-[25.9px] z-3 opacity-80"
              fill="currentColor"
              height="3.8"
              viewBox="0 0 6.5 3.8"
              width="6.5"
            >
              <polygon points="0,0 6.5,0 3.25,3.8" />
            </svg>
          )}
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              align="start"
              className="z-1100 w-(--radix-popover-trigger-width) rounded-b-[4px] border border-t-0 border-solid border-dropdown-active-border bg-white shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] outline-none"
              onInteractOutside={(e) => {
                // The input lives in the trigger, outside this content
                if (rootRef.current?.contains(e.target as Node)) e.preventDefault();
              }}
              onOpenAutoFocus={(e) => {
                e.preventDefault();
                // Like Semantic, open with the current value in view
                (e.currentTarget as HTMLElement)
                  .querySelector('[data-selected="true"]')
                  ?.scrollIntoView({ block: 'nearest' });
              }}
              side="bottom"
              sideOffset={2}
            >
              <CommandPrimitive.List
                id={listId}
                className="max-h-[8.01428571rem] overflow-x-hidden overflow-y-auto min-[768px]:max-h-[10.68571429rem] min-[992px]:max-h-[16.02857143rem] min-[1920px]:max-h-[21.37142857rem]"
                data-testid={dataTestId && `${dataTestId}-options`}
              >
                <CommandPrimitive.Empty className="px-[1.14285714em] py-[0.78571429em] text-[rgba(0,0,0,0.87)]">
                  {t('no_results')}
                </CommandPrimitive.Empty>
                {filtered.map((option) => (
                  <CommandPrimitive.Item
                    key={option.value}
                    className={cn(
                      'block cursor-pointer border-0 border-t border-solid border-dropdown-item-border px-[1.14285714rem] py-[0.78571429rem] text-[1rem] leading-[1em] text-[rgba(0,0,0,0.87)] hover:bg-[rgba(0,0,0,0.05)] hover:text-[rgba(0,0,0,0.95)] data-[selected=true]:bg-[rgba(0,0,0,0.03)] data-[selected=true]:text-[rgba(0,0,0,0.95)]',
                      option.value === value && 'font-bold text-[rgba(0,0,0,0.95)]'
                    )}
                    onSelect={() => pick(option.value)}
                    value={option.value}
                  >
                    {option.image && <Avatar>{option.image}</Avatar>}
                    <span>{option.text}</span>
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.List>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </CommandPrimitive>
      </PopoverPrimitive.Anchor>
    </PopoverPrimitive.Root>
  );
}

export { Combobox };
