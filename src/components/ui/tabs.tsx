import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's Tab. Radix Tabs adds the tablist, tab and tabpanel roles and arrow-key
// navigation. Two looks:
// - `tabular` (default): an `attached tabular` menu over a `bottom attached` segment, in the app's
//   colours: the active tab and the panel share the secondary background;
// - `menu`: a plain `ui menu` (a white bar of items with dividers, the active one shaded) over a
//   borderless panel;
// - `secondary`: a `secondary` menu (borderless items, the active one on the card colour) over a
//   panel with Semantic's segment shadow.

type TabsVariant = 'menu' | 'secondary' | 'tabular';

const VariantContext = React.createContext<TabsVariant>('tabular');

function Tabs({
  variant = 'tabular',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root> & { variant?: TabsVariant }) {
  return (
    <VariantContext.Provider value={variant}>
      <TabsPrimitive.Root data-slot="tabs" data-variant={variant} {...props} />
    </VariantContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(
        'flex min-h-[2.85714286em] font-control text-[1rem] leading-[1.4]',
        variant === 'tabular' && 'border-0 border-b border-solid border-secondary',
        variant === 'menu' &&
          'mb-[1rem] overflow-auto rounded-[0.28571429rem] border border-solid border-field-border bg-white text-field-foreground shadow-[0_1px_2px_0_var(--color-field-border)]',
        variant === 'secondary' &&
          '-mx-[0.35714286em] mb-[1rem] flex-row flex-nowrap overflow-auto px-(--spacing-2) py-(--spacing-0)',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Semantic's reset styles every <button>, so font, size, line height and margin need !
        'relative m-0! flex flex-[0_0_auto] cursor-pointer items-center bg-transparent align-middle font-control! text-[1rem]! leading-none! font-normal outline-none select-none transition-[background,box-shadow,color] duration-100',
        variant === 'tabular' &&
          'rounded-t-md border-x border-t-2 border-b-0 border-solid border-transparent px-[1.42857143em] py-[0.92857143em] text-foreground data-[state=active]:-mb-px! data-[state=active]:border-t data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:font-bold',
        // Each item has a 1px divider on its right, drawn by ::before as Semantic does
        variant === 'menu' &&
          'border-0 px-[1.14285714em] py-[0.92857143em] text-field-foreground before:absolute before:top-0 before:right-0 before:h-full before:w-px before:bg-[rgba(34,36,38,0.1)] before:content-[""] first:rounded-l-[0.28571429rem] hover:bg-[rgba(0,0,0,0.03)] hover:text-[rgba(0,0,0,0.95)] data-[state=active]:bg-[rgba(0,0,0,0.05)] data-[state=active]:text-[rgba(0,0,0,0.95)]',
        // data-disabled (set by the caller) only changes the cursor: Semantic's disabled item
        // still looked the same here
        variant === 'secondary' &&
          'mx-[0.35714286em]! self-center rounded-[0.28571429rem] border-0 px-[0.92857143em] py-[0.78571429em] text-foreground transition-[color] hover:bg-[rgba(0,0,0,0.05)] data-[state=active]:bg-card data-[state=active]:transition-all data-[state=active]:duration-500 data-[state=active]:hover:bg-[rgba(0,0,0,0.05)] data-disabled:cursor-default data-disabled:hover:bg-transparent',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  const variant = React.useContext(VariantContext);
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'relative text-[1rem] outline-none',
        variant === 'tabular' &&
          'rounded-b-md border border-t-0 border-solid border-secondary bg-secondary p-[1em]',
        variant === 'menu' && '-mx-px',
        variant === 'secondary' &&
          'overflow-auto rounded-[0.28571429rem] shadow-[0_1px_2px_0_var(--color-field-border)]',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
