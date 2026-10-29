import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `.ui.button`. Semantic's reset styles every <button> outside cascade
// layers, which beats any utility, so font, size, line height and margin are marked important (!)
// until Phase 3 removes it.
const buttonVariants = cva(
  'inline-block min-h-[1em] cursor-pointer rounded-md border-none text-center align-baseline font-control! text-[1rem]! leading-[1em]! font-bold whitespace-nowrap no-underline outline-none select-none mr-[0.25em]! ml-0! my-0! transition-[opacity,background-color,color,box-shadow] duration-100 ease-in-out disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:inline-block',
  {
    variants: {
      variant: {
        // Grey in light mode, inverted (white ring) in dark mode, like Semantic's `inverted={darkMode}`
        default:
          'bg-button text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground focus-visible:bg-button-hover focus-visible:text-button-hover-foreground dark:bg-transparent dark:text-white dark:shadow-[inset_0_0_0_2px_var(--color-white)] dark:hover:bg-white dark:hover:text-button-hover-foreground dark:focus-visible:bg-white dark:focus-visible:text-button-hover-foreground',
        // Semantic's plain button, grey in both themes
        secondary:
          'bg-button text-button-foreground hover:bg-button-hover hover:text-button-hover-foreground focus-visible:bg-button-hover focus-visible:text-button-hover-foreground',
        // Semantic's `primary` and `color="grey"` buttons, the same in both themes
        primary:
          'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:bg-primary-focus active:bg-primary-active',
        // Semantic's `color="blue" inverted={darkMode}`: solid blue, outlined in dark mode
        blue: 'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:bg-primary-focus active:bg-primary-active dark:bg-transparent dark:text-blue-inverted dark:shadow-[inset_0_0_0_2px_var(--color-blue-inverted)] dark:hover:bg-blue-inverted-hover dark:hover:text-white dark:hover:shadow-none dark:focus-visible:bg-blue-inverted-focus dark:focus-visible:text-white dark:focus-visible:shadow-none dark:active:bg-blue-inverted-active dark:active:text-white dark:active:shadow-none',
        grey: 'bg-grey text-white hover:bg-grey-hover focus-visible:bg-grey-focus active:bg-grey-active',
        // Semantic's `color="green" inverted={darkMode}`: solid green, outlined in dark mode
        green:
          'bg-green text-white hover:bg-green-hover focus-visible:bg-green-focus active:bg-green-active dark:bg-transparent dark:text-green-inverted dark:shadow-[inset_0_0_0_2px_var(--color-green-inverted)] dark:hover:bg-green-inverted-hover dark:hover:text-white dark:hover:shadow-none dark:focus-visible:bg-green-inverted-focus dark:focus-visible:text-white dark:focus-visible:shadow-none dark:active:bg-green-inverted-active dark:active:text-white dark:active:shadow-none',
        // Semantic's `color="green"` without `inverted`: solid in both themes
        'solid-green':
          'bg-green text-white hover:bg-green-hover focus-visible:bg-green-focus active:bg-green-active',
        // Semantic's `color="red" inverted={darkMode}`: solid red, outlined in dark mode
        red: 'bg-destructive text-white hover:bg-red-hover focus-visible:bg-red-focus active:bg-red-active dark:bg-transparent dark:text-red-inverted dark:shadow-[inset_0_0_0_2px_var(--color-red-inverted)] dark:hover:bg-red-inverted-hover dark:hover:text-white dark:hover:shadow-none dark:focus-visible:bg-red-inverted-focus dark:focus-visible:text-white dark:focus-visible:shadow-none dark:active:bg-red-inverted-active dark:active:text-white dark:active:shadow-none',
        // Semantic's `basic inverted={darkMode}`: a thin outline on the page's background
        basic:
          'bg-transparent font-normal text-button-foreground shadow-[inset_0_0_0_1px_var(--color-field-border)] hover:bg-white hover:text-button-hover-foreground hover:shadow-[inset_0_0_0_1px_var(--color-field-border-hover)] focus-visible:bg-white focus-visible:text-button-hover-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--color-field-border-hover)] active:bg-basic-active dark:text-basic-inverted-foreground dark:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.5)] dark:hover:bg-transparent dark:hover:text-white dark:hover:shadow-[inset_0_0_0_2px_var(--color-white)] dark:focus-visible:bg-transparent dark:focus-visible:text-white dark:focus-visible:shadow-[inset_0_0_0_2px_var(--color-white)] dark:active:bg-[rgba(255,255,255,0.08)]',
        // Semantic's `basic` button without `inverted`: the same thin outline in both themes
        'basic-plain':
          'bg-transparent font-normal text-button-foreground shadow-[inset_0_0_0_1px_var(--color-field-border)] hover:bg-white hover:text-button-hover-foreground hover:shadow-[inset_0_0_0_1px_var(--color-field-border-hover)] focus-visible:bg-white focus-visible:text-button-hover-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--color-field-border-hover)] active:bg-basic-active',
      },
      size: {
        default: 'px-[1.5em] py-[0.78571429em]',
        // Semantic's `icon` button: square padding around a single icon
        icon: 'p-[0.78571429em]',
        // Semantic's `compact icon` button
        'compact-icon': 'p-[0.58928571em]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Semantic's `toggle` button while `active`: green whatever its variant, darker on hover. Set
// aria-pressed on the button
const TOGGLE_BUTTON =
  'aria-pressed:bg-green! aria-pressed:text-white! aria-pressed:shadow-none! aria-pressed:hover:bg-green-hover!';

// Semantic's `mini` size: the button's font (and so its padding and icon) at 0.78571429rem. cn()
// drops the base's line height when a later class sets the font size, so it's restated
const MINI_BUTTON = 'text-[0.78571429rem]! leading-[1em]!';

// On React 19 a function component takes `ref` as a prop, so it can be a Radix trigger
// (`<PopoverTrigger asChild>`), which needs the element to position its content
function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants, MINI_BUTTON, TOGGLE_BUTTON };
