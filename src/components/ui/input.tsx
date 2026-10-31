import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `<Input>`: a white field with a light border, and with `label`, the grey
// label attached on its left (`.ui.labeled.input`); `fluid` stretches it to its container's width.
// Semantic's reset styles every <input> outside cascade layers, so font, size, line height and
// margin are marked important (!). `inputClassName` restyles the <input> itself (className goes to the
// wrapper).
function Input({
  className,
  fluid = false,
  id,
  inputClassName,
  label,
  ...props
}: React.ComponentProps<'input'> & {
  fluid?: boolean;
  inputClassName?: string;
  label?: React.ReactNode;
}) {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  return (
    <div
      className={cn(
        'relative text-[1rem] text-field-foreground',
        fluid ? 'flex' : 'inline-flex',
        props.disabled && 'pointer-events-none opacity-45',
        className
      )}
      data-slot="input"
    >
      {label && (
        <label
          className="inline-block flex-none rounded-l-[0.28571429rem] bg-field-label px-[0.833em] py-[0.78571429em] leading-none font-bold text-field-label-foreground"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <input
        className={cn(
          'm-0! max-w-full flex-[1_0_auto] appearance-none rounded-[0.28571429rem] border border-solid border-field-border bg-white px-[1em] py-[0.67857143em] text-left font-control! text-[1em]! leading-[1.21428571em]! text-field-foreground outline-none transition-[box-shadow,border-color] duration-100 placeholder:text-field-placeholder focus:border-ring focus:text-[rgba(0,0,0,0.8)] focus:placeholder:text-field-placeholder-focus',
          inputClassName,
          fluid && 'w-0',
          label && 'rounded-l-none border-l-transparent'
        )}
        id={inputId}
        {...props}
      />
    </div>
  );
}

// The browser's own field, for the native controls the app never designed (Report's form, the
// calculator's number inputs, plain textareas). Preflight makes controls inherit their font and
// colour on a transparent fill; `revert` brings back the browser's fill, text colour, corners and
// placeholder (keeping the native appearance, which an author fill would turn off), with normalize's
// font. Text inputs also drop their native appearance, as normalize did.
const NATIVE_FIELD =
  'm-0 [background-color:revert] [border-radius:revert] font-[sans-serif] text-[100%] leading-[1.15] font-normal tracking-normal [color:revert] placeholder:[color:revert] placeholder:[opacity:revert]';
const NATIVE_TEXT_FIELD = `${NATIVE_FIELD} appearance-none`;

export { Input, NATIVE_FIELD, NATIVE_TEXT_FIELD };
