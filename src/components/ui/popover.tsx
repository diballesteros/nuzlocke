import { Popover as PopoverPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `<Popup on="click" pinned position="top center" inverted={darkMode}>`:
// a white bubble above its trigger with a small arrow, dark in dark mode. A click on the trigger
// toggles it and a click anywhere else closes it. Radix Popover portals it, so it isn't clipped.

function Popover({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

// Semantic's non-pinned click Popup (the tracker's options) put the bubble's bottom edge on a whole
// pixel and its right edge exactly on the trigger's; Radix rounds its top-left corner instead.
// `edgeAligned` shifts the bubble to where Semantic's sat (only for side="top" and align="end")
const alignEdges = (node: HTMLDivElement | null) => {
  if (!node) return;
  requestAnimationFrame(() => {
    const trigger = document.querySelector(`[aria-controls="${node.id}"]`)?.getBoundingClientRect();
    if (!trigger) return;
    const bubble = node.getBoundingClientRect();
    const dx = trigger.right - bubble.right;
    const dy = Math.round(trigger.top - Number(node.dataset.offset)) - bubble.bottom;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) node.style.translate = `${dx}px ${dy}px`;
  });
};

function PopoverContent({
  arrowClassName,
  className,
  children,
  edgeAligned = false,
  sideOffset = 10,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & {
  arrowClassName?: string;
  edgeAligned?: boolean;
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align="center"
        data-offset={sideOffset}
        ref={edgeAligned ? alignEdges : undefined}
        side="top"
        sideOffset={sideOffset}
        className={cn(
          'relative z-1900 max-w-[250px] rounded-[0.28571429rem] border border-solid border-popup-border bg-white px-[1em] py-[0.833em] text-[1rem] leading-[1.4285em] font-normal text-field-foreground shadow-[0_2px_4px_0_rgba(34,36,38,0.12),0_2px_10px_0_rgba(34,36,38,0.15)] outline-none dark:border-0 dark:bg-popup-inverted dark:text-white dark:shadow-none',
          className
        )}
        {...props}
      >
        {children}
        {/* Semantic's arrow: a rotated square half under the bubble's bottom edge */}
        <span
          aria-hidden
          className={cn(
            'absolute -bottom-[0.30714286em] left-1/2 -ml-[0.30714286em] size-[0.71428571em] rotate-45 bg-white shadow-[1px_1px_0_0_var(--color-popup-arrow)] dark:bg-popup-inverted dark:shadow-none',
            arrowClassName
          )}
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}

// Semantic's default Popup (`on={['click', 'hover']}`, position "top left"): hovering the trigger
// opens it after 50 ms and leaving closes it after 70 ms, a click toggles it, and focus stays on the
// trigger. Its trigger must take a ref (a <button>, so Radix can set aria-expanded on it).
function HoverPopover({
  children,
  content,
}: {
  children: React.ReactElement;
  content: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number>(undefined);
  const later = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(next), delay);
  };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        window.clearTimeout(timer.current);
        setOpen(next);
      }}
    >
      <PopoverTrigger
        asChild
        onPointerEnter={(e) => e.pointerType === 'mouse' && later(true, 50)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && later(false, 70)}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        arrowClassName="left-[1em] ml-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
}

export { HoverPopover, Popover, PopoverContent, PopoverTrigger };
