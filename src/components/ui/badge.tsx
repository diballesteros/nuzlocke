import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `<Label>`: a small bold grey tag in its parent's font, without its outer
// margin at the start or end of its parent. Inside a menu item Semantic spaced it 1em from the text
// and drew it darker and tighter; pass those as classes (see Pokestats).
function Badge({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="badge"
      className={cn(
        'mx-[0.14285714em] inline-block rounded-[0.28571429rem] bg-field-label px-[0.833em] py-[0.5833em] align-baseline text-[0.85714286rem] leading-none font-bold text-field-label-foreground first:ml-0 last:mr-0',
        className
      )}
      {...props}
    />
  );
}

export { Badge };
