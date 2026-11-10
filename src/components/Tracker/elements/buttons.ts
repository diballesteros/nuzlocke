import { BUTTON_ICON } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

// Semantic's button radius, exactly 4px: `rounded-md` resolves to 3.9998px, which anti-aliases the
// corners of outlined and basic buttons a grey level differently
export const RADIUS = 'rounded-[0.28571429rem]';

// The encounter row's outlined buttons (Evolve, Swap, Nature and the level buttons): Semantic buttons
// whose SCSS made them transparent with a 1px --contrast ring, inverted on hover. Use them with the
// `secondary` variant, which has no dark-mode ring of its own. Semantic's focus
// grey never showed through the transparent background, so focus keeps the resting look.
export const OUTLINE_BUTTON =
  'mr-0! rounded-[0.28571429rem] border border-solid border-foreground bg-transparent p-(--spacing-2) text-foreground shadow-none hover:bg-foreground hover:text-background focus-visible:bg-transparent focus-visible:text-foreground focus-visible:hover:bg-foreground focus-visible:hover:text-background';

// BUTTON_ICON with a hair more negative margin: at these buttons' sizes (12.25px, the 7.994px
// padding) the glyph's box otherwise rounds to 1/64px taller than the line, and the row grows
export const ROW_ICON = cn(BUTTON_ICON, '-my-[0.0805em]');

// The redesigned row's controls (5m): one outlined style at the row's 32px control height (40px on
// phones, `TALL`), and borderless icon buttons for the editor and the options menu. Focus shows the
// rows' ring, offset by 2px, which the row's padding leaves room for
const FOCUS =
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring';
export const ROW_CONTROL = cn(
  FOCUS,
  'm-0! inline-flex h-[2.286rem] shrink-0 cursor-pointer items-center justify-center gap-(--spacing-1) rounded-md border border-solid border-contrast-border bg-transparent px-(--spacing-2) [font-family:inherit]! text-(length:--font-size-2)! leading-none! font-bold whitespace-nowrap text-foreground hover:bg-foreground/8 disabled:cursor-default disabled:opacity-45 [&_svg]:size-[1.143rem] [&_svg]:shrink-0'
);
export const ROW_ICON_CONTROL = cn(ROW_CONTROL, 'w-[2.286rem] px-0');
export const ROW_GHOST = cn(
  FOCUS,
  'm-0! inline-flex size-[2.286rem] shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent p-0 text-foreground hover:bg-foreground/8 [&_svg]:size-[1.143rem]'
);
export const TALL = 'h-[2.857rem]';

// The tracker toolbar's Share, Add and Reset (5m): small outlined buttons on the search row, Reset
// outlined in red. The labels' strings are capitalised ("ADD"), so the first letter is kept
export const TOOLBAR_BUTTON = cn(
  ROW_CONTROL,
  'h-[2.571rem] gap-(--spacing-2) px-(--spacing-3) [&>span]:lowercase [&>span]:first-letter:uppercase'
);
export const TOOLBAR_DANGER =
  'border-destructive/50 text-destructive dark:border-red-inverted/50 dark:text-red-inverted';

// Focus after a dialog opened from a row's menu: the menu item is gone when the dialog closes, so
// focus goes back to the given element (the row's ⋮) instead of falling to the page. Radix calls
// this once the closing animation ends; if focus has moved somewhere by then (a click on the
// search field), it stays there
export const focusBack = (e: Event, target: HTMLElement | null | undefined) => {
  e.preventDefault();
  const active = document.activeElement;
  if (target?.isConnected && (!active || active === document.body)) target.focus();
};
export const returnFocusTo = (target?: React.RefObject<HTMLElement | null>) =>
  target ? { onCloseAutoFocus: (e: Event) => focusBack(e, target.current) } : {};
