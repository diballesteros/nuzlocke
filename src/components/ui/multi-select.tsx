import * as React from 'react';
import { cn } from '@/lib/utils';
import { XIcon } from './icons';

// Parity with Semantic UI's `fluid multiple selection` Dropdown without search: a white field
// holding a grey label per chosen value, and a menu of the values not chosen yet that stays open
// while you pick. Like Semantic, the menu renders inside the element carrying data-testid, below
// the field. The field is a combobox and the menu a listbox, so the field can hold the labels.

export interface MultiSelectOption<T extends number | string> {
  text: string;
  value: T;
}

interface MultiSelectProps<T extends number | string> {
  'aria-label': string;
  className?: string;
  'data-testid'?: string;
  disabled?: boolean;
  onChange: (value: T[]) => void;
  options: MultiSelectOption<T>[];
  placeholder: string;
  value: T[];
}

function MultiSelect<T extends number | string>({
  'aria-label': ariaLabel,
  className,
  'data-testid': dataTestId,
  disabled = false,
  onChange,
  options,
  placeholder,
  value,
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const remaining = options.filter((option) => !value.includes(option.value));
  const textOf = (item: T) => options.find((option) => option.value === item)?.text ?? String(item);

  // A click anywhere else closes the menu, as Semantic's does
  React.useEffect(() => {
    if (!open) return undefined;
    const close = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const show = (next: boolean) => {
    setOpen(next);
    setHighlighted(0);
  };

  // The menu stays open, and the highlight stays on the same row, now the next value
  const add = (index: number) => {
    const option = remaining[index];
    if (!option) return;
    onChange([...value, option.value]);
    setHighlighted(Math.min(index, remaining.length - 2));
  };

  const remove = (item: T) => onChange(value.filter((chosen) => chosen !== item));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        e.preventDefault();
        if (!open) {
          show(true);
          break;
        }
        const step = e.key === 'ArrowDown' ? 1 : -1;
        setHighlighted((i) => Math.max(0, Math.min(remaining.length - 1, i + step)));
        break;
      }
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) add(highlighted);
        else show(true);
        break;
      case 'Backspace':
        if (value.length) remove(value[value.length - 1]);
        break;
      case 'Escape':
        // Close the menu without closing the dialog it sits in
        if (open) {
          e.stopPropagation();
          show(false);
        }
        break;
      case 'Tab':
        show(false);
        break;
      default:
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative w-full', disabled && 'pointer-events-none opacity-45', className)}
      data-slot="multi-select"
      data-testid={dataTestId}
    >
      <div
        aria-activedescendant={open && remaining.length ? `${listId}-${highlighted}` : undefined}
        aria-controls={listId}
        aria-disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          'relative min-h-[2.71428571em] cursor-pointer rounded-[0.28571429rem] border border-solid border-field-border bg-white py-[0.22619048em] pr-[2.1em] pl-[0.35714286em] text-left text-[1rem] leading-[1em] wrap-break-word whitespace-normal text-field-foreground outline-none transition-[box-shadow] duration-100 hover:border-field-border-hover focus-visible:border-dropdown-active-border',
          open &&
            'z-10 rounded-b-none border-dropdown-active-border shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] hover:border-dropdown-active-border'
        )}
        onClick={() => show(!open)}
        onKeyDown={handleKeyDown}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
      >
        {value.map((item) => (
          <span
            key={item}
            className="my-[0.14285714rem] mr-[0.28571429rem] ml-0 inline-block rounded-[0.28571429rem] bg-field-label px-[0.78571429em] py-[0.35714286em] align-top leading-none font-bold whitespace-normal text-field-label-foreground shadow-[inset_0_0_0_1px_var(--color-field-border)] select-none"
          >
            {textOf(item)}
            <XIcon
              className="ml-[0.5em] inline-block size-[0.92857143em] cursor-pointer align-[-0.1em] opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                remove(item);
              }}
            />
          </span>
        ))}
        {!value.length && (
          <span className="my-[0.45238095em] mr-0 ml-[0.64285714em] inline-block leading-[1.21428571em] text-field-placeholder">
            {placeholder}
          </span>
        )}
        {/* Semantic's caret, drawn where its icon font put it */}
        <svg
          aria-hidden
          className="absolute top-[16px] right-[13px] opacity-80"
          fill="currentColor"
          height="3.8"
          viewBox="0 0 7.5 3.8"
          width="7.5"
        >
          <polygon points="0,0 7.5,0 3.75,3.8" />
        </svg>
      </div>
      {open && (
        <div
          aria-label={ariaLabel}
          aria-multiselectable
          className="absolute top-full left-0 z-11 -mx-px max-h-[8.01428571rem] w-[calc(100%+2px)] overflow-x-hidden overflow-y-auto rounded-b-[0.28571429rem] border border-t-0 border-solid border-dropdown-active-border bg-white shadow-[0_2px_3px_0_rgba(34,36,38,0.15)] min-[768px]:max-h-[10.68571429rem] min-[992px]:max-h-[16.02857143rem] min-[1920px]:max-h-[21.37142857rem]"
          id={listId}
          role="listbox"
        >
          {remaining.map((option, i) => (
            <div
              key={option.value}
              aria-selected={i === highlighted}
              className={cn(
                'relative block cursor-pointer border-0 border-t border-solid border-dropdown-item-border px-[1.14285714rem] py-[0.78571429rem] text-left text-[1rem] leading-[1em] text-field-foreground first:border-t-0 hover:bg-[rgba(0,0,0,0.05)] hover:text-[rgba(0,0,0,0.95)]',
                i === highlighted && 'bg-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.95)]'
              )}
              id={`${listId}-${i}`}
              onClick={() => add(i)}
              onMouseEnter={() => setHighlighted(i)}
              role="option"
            >
              {option.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { MultiSelect };
