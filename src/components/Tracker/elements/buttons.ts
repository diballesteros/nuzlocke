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
