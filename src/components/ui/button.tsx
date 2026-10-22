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
        grey: 'bg-grey text-white hover:bg-grey-hover focus-visible:bg-grey-focus active:bg-grey-active',
      },
      size: {
        default: 'px-[1.5em] py-[0.78571429em]',
        // Semantic's `icon` button: square padding around a single icon
        icon: 'p-[0.78571429em]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

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

export { Button, buttonVariants };
