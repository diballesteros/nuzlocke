import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

// Parity with the tracker FAB's round buttons: Semantic's `circular icon` Button with a colour, 4rem
// across (the old shared iconButton style, and the FAB's own toggle). The colours are solid in both
// themes; `toggle` is the FAB's own button, the badge colour and green while `active`.
const COLOURS = {
  blue: 'bg-primary hover:bg-primary-hover focus-visible:bg-primary-focus active:bg-primary-active',
  green: 'bg-green hover:bg-green-hover focus-visible:bg-green-focus active:bg-green-active',
  red: 'bg-destructive hover:bg-red-hover focus-visible:bg-red-focus active:bg-red-active',
  yellow: 'bg-yellow hover:bg-yellow-hover focus-visible:bg-yellow-focus active:bg-yellow-active',
  toggle:
    'bg-badge transition-all duration-500 hover:bg-badge focus-visible:bg-badge active:bg-badge aria-pressed:bg-green aria-pressed:hover:bg-green-hover',
};

function FabButton({
  active,
  children,
  className,
  colour,
  ...props
}: React.ComponentProps<'button'> & { active?: boolean; colour: keyof typeof COLOURS }) {
  return (
    <Button
      aria-pressed={colour === 'toggle' ? !!active : undefined}
      className={cn(
        'relative size-[4rem] rounded-[10em] p-0 text-white hover:text-white focus-visible:text-white',
        COLOURS[colour],
        className
      )}
      type="button"
      variant="primary"
      {...props}
    >
      {children}
    </Button>
  );
}

// The glyph inside, centred like the icon font's (lucide draws inside a padded box, so it's set a
// little larger than the font's 2rem)
export const FAB_ICON = 'absolute top-1/2 left-1/2 size-[2.3rem] -translate-1/2 opacity-90';

export { FabButton };
