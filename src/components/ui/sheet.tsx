import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// The app's menu, on a Radix Dialog. Like Semantic's overlay sidebar it replaced, it isn't modal: it
// leaves focus where it was, ignores Escape, and a click anywhere outside it closes it and still
// reaches what was clicked (the header's game select opens in the same click). The content isn't
// portalled: it slides in over the page below the header, inside the element that dims (see App).

// The trigger, for SheetContent to hand focus back to
const TriggerContext = React.createContext<React.RefObject<HTMLButtonElement | null> | null>(null);

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  return (
    <TriggerContext value={trigger}>
      <DialogPrimitive.Root data-slot="sheet" modal={false} {...props} />
    </TriggerContext>
  );
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return (
    <DialogPrimitive.Trigger data-slot="sheet-trigger" ref={React.use(TriggerContext)} {...props} />
  );
}

// The menu (5x): a 260px card, so "Damage Calculator" fits one line, holding groups of 40px rows.
// It is named by its SheetTitle
function SheetContent({
  className,
  onBlur,
  onFocus,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  // Focus stays where it was when the menu closes, unless it was on an item (a keyboard user chose a
  // page): then it goes back to the menu button, not to the page's start as the item unmounts.
  // Radix asks only after the content is gone, so whether focus was inside is noted as it comes and
  // goes. Radix's own return to the trigger is off once anything outside the menu had focus, as the
  // header's controls did on the way in
  const trigger = React.use(TriggerContext);
  const focusInside = React.useRef(false);
  return (
    <DialogPrimitive.Content
      aria-describedby={undefined}
      data-slot="sheet-content"
      {...props}
      className={cn(
        'absolute top-0 left-0 z-102 flex h-full w-[260px] max-w-[calc(100%-var(--spacing-8))] flex-col overflow-y-auto border-r border-solid border-contrast-border bg-card p-(--spacing-2) text-card-foreground shadow-[8px_0_24px_rgba(0,0,0,0.2)] outline-none will-change-transform [backface-visibility:hidden] data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left',
        // It slides for 500ms, as Semantic's did
        '[--tw-duration:500ms] [--tw-ease:ease]',
        className
      )}
      // Chrome also sends a blur, with nowhere to go, when the focused item unmounts, so only focus
      // that moves somewhere, or a press outside, counts as leaving
      onBlur={(e) => {
        onBlur?.(e);
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget))
          focusInside.current = false;
      }}
      onCloseAutoFocus={(e) => {
        e.preventDefault();
        if (focusInside.current) trigger?.current?.focus();
        focusInside.current = false;
      }}
      onEscapeKeyDown={(e) => e.preventDefault()}
      // Only keyboard focus counts: a click on an item focuses it too (Chrome, Android), and moving
      // focus after a click would close whatever the next page opened on hover or click
      onFocus={(e) => {
        onFocus?.(e);
        focusInside.current = (e.target as Element).matches(':focus-visible');
      }}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onPointerDownOutside={(e) => {
        onPointerDownOutside?.(e);
        focusInside.current = false;
      }}
    />
  );
}

function SheetTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" {...props} />;
}

// A group of items, with a rule above all but the first
function SheetGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-group"
      className={cn(
        'flex flex-col py-[0.429rem] not-first:border-t not-first:border-solid not-first:border-contrast-border',
        className
      )}
      {...props}
    />
  );
}

// A 40px row: its icon first, in the muted colour, then the name. The current page (`current`) is
// tinted and marked with the primary colour at its start; its text stays in the foreground colour,
// since link blue on a tinted fill fails contrast in dark mode
function SheetItem({
  className,
  current,
  ...props
}: React.ComponentProps<'button'> & { current?: boolean }) {
  return (
    <button
      aria-current={current ? 'page' : undefined}
      data-slot="sheet-item"
      type="button"
      className={cn(
        'm-0! flex h-[2.857rem] w-full shrink-0 cursor-pointer items-center gap-(--spacing-3) rounded-[0.429rem] border-0 bg-transparent px-[0.714rem] text-left [font-family:inherit]! text-[1rem]! leading-[1.4]! font-bold text-foreground outline-none hover:bg-foreground/8 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-row-ring',
        '[&>svg]:size-[1.143rem] [&>svg]:shrink-0 [&>svg]:text-row-muted',
        'aria-[current=page]:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--color-card))] aria-[current=page]:shadow-[inset_3px_0_0_var(--color-primary)] aria-[current=page]:[&>svg]:text-row-link',
        className
      )}
      {...props}
    />
  );
}

export { Sheet, SheetContent, SheetGroup, SheetItem, SheetTitle, SheetTrigger };
