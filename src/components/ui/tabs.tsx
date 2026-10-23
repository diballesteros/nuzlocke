import { Tabs as TabsPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

// Parity with Semantic UI's Tab (an `attached tabular` menu over a `bottom attached` segment) in the
// app's colours: the active tab and the panel share the secondary background. Radix Tabs adds the
// tablist, tab and tabpanel roles and arrow-key navigation.

function Tabs({ ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'flex min-h-[2.85714286em] border-0 border-b border-solid border-secondary font-control text-[1rem] leading-[1.4]',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Semantic's reset styles every <button>, so font, size, line height and margin need !
        'relative m-0! flex flex-[0_0_auto] cursor-pointer items-center rounded-t-md border-x border-t-2 border-b-0 border-solid border-transparent bg-transparent px-[1.42857143em] py-[0.92857143em] align-middle font-control! text-[1rem]! leading-none! font-normal text-foreground outline-none select-none transition-[background,box-shadow,color] duration-100 data-[state=active]:-mb-px! data-[state=active]:border-t data-[state=active]:border-secondary data-[state=active]:bg-secondary data-[state=active]:font-bold',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'relative rounded-b-md border border-t-0 border-solid border-secondary bg-secondary p-[1em] text-[1rem] outline-none',
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
