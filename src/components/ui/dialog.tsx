import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's `.ui.modal` in a page dimmer, including the index.css overrides (app
// colours, 2px inner corners, a --contrast rule above the actions). The overlay centres the dialog
// with flexbox, as Semantic's dimmer does, and both carry Semantic's will-change hints: they make
// the browser composite them as layers, which changes how the shadow and text are rasterized.

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogContent({
  className,
  children,
  dismissible = true,
  onEscapeKeyDown,
  onInteractOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  // false: only the dialog's own buttons close it, not Escape or a click outside
  dismissible?: boolean;
}) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal">
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-1000 flex flex-col items-center justify-center bg-[rgba(0,0,0,0.85)] leading-none will-change-[opacity] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
      >
        <DialogPrimitive.Content
          data-slot="dialog-content"
          aria-describedby={undefined}
          className={cn(
            'relative w-[95%] rounded-md will-change-[top,left,margin,transform,opacity] bg-white text-left text-[1rem] shadow-[1px_3px_3px_0_rgba(0,0,0,0.2),1px_3px_15px_2px_rgba(0,0,0,0.2)] outline-none min-[768px]:w-[88%] min-[992px]:w-[850px] min-[1200px]:w-[900px] min-[1920px]:w-[950px] data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-95',
            className
          )}
          onEscapeKeyDown={(e) => {
            if (!dismissible) e.preventDefault();
            onEscapeKeyDown?.(e);
          }}
          onInteractOutside={(e) => {
            if (!dismissible) e.preventDefault();
            onInteractOutside?.(e);
          }}
          // Focus the dialog itself rather than its first field, so opening it shows no focus ring
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).focus();
          }}
          tabIndex={-1}
          {...props}
        >
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}

// Semantic's modal content. `scrolling`: the dialog grows up to 80% of the viewport, then this scrolls
function DialogBody({
  className,
  scrolling = false,
  ...props
}: React.ComponentProps<'div'> & { scrolling?: boolean }) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        'block w-full rounded-t-[2px] bg-background p-[1.5rem] leading-[1.4] text-foreground max-[768px]:p-[1rem]',
        scrolling && 'max-h-[calc(80vh-10em)] overflow-auto',
        className
      )}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'rounded-b-[2px] border-x-0 border-t border-b-0 border-solid border-foreground bg-background p-[1rem] text-right text-foreground max-[768px]:pb-0 max-[768px]:[&>button]:mb-[1rem]!',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={className} {...props} />;
}

export { Dialog, DialogBody, DialogContent, DialogFooter, DialogTitle };
