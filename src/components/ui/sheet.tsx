import { Dialog as DialogPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { ICON_SLOT } from './icons';

// Parity with Semantic UI's `Sidebar animation="overlay" width="thin" as={Menu} vertical` (the app's
// menu), on a Radix Dialog. Semantic's sidebar wasn't modal: it left focus where it was, ignored
// Escape, and a click anywhere outside it closed it and still reached what was clicked (the header's
// game select opens in the same click). So the dialog is non-modal and keeps focus and Escape as
// they were. The content isn't portalled: like Semantic's, it slides in over the page below the
// header, inside the element that dims (see App).

function Sheet(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="sheet" modal={false} {...props} />;
}

function SheetTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetContent({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Content
      aria-describedby={undefined}
      data-slot="sheet-content"
      className={cn(
        'absolute top-0 left-0 z-102 h-full w-[150px] overflow-y-auto border border-solid border-field-border bg-header font-control text-[1rem] leading-[1.4285em] shadow-[0_0_20px_rgba(34,36,38,0.15)] outline-none will-change-transform [backface-visibility:hidden] dark:border-0 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left [&>*]:[backface-visibility:hidden]',
        // Semantic's overlay sidebar slides for 500ms
        '[--tw-duration:500ms] [--tw-ease:ease]',
        className
      )}
      onCloseAutoFocus={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => e.preventDefault()}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    />
  );
}

function SheetTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="sheet-title" {...props} />;
}

// A vertical menu item, with Semantic's rule under it. Its icon floats right (SHEET_ICON)
function SheetItem({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-item"
      className={cn(
        'relative block cursor-pointer px-[1.14285714em] py-[0.92857143em] leading-none text-[rgba(0,0,0,0.87)] transition-[background,box-shadow,color] duration-100 before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:bg-[rgba(34,36,38,0.1)] before:content-[""] hover:bg-[rgba(255,255,255,0.08)] dark:text-[rgba(255,255,255,0.9)] dark:before:bg-[rgba(255,255,255,0.08)]',
        className
      )}
      {...props}
    />
  );
}

// Semantic's icon slot, floated right half an em from the text
const SHEET_ICON = cn(ICON_SLOT, 'float-right ml-[0.5em] opacity-90');

export { SHEET_ICON, Sheet, SheetContent, SheetItem, SheetTitle, SheetTrigger };
