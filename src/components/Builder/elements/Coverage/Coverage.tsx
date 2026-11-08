import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';
import { TYPE_COLOR } from 'constants/colors';
import type { Type } from 'constants/types';
import { selectBuilderStrong, selectBuilderWeak } from 'selectors';
import useStore from 'store';
import { cn } from '@/lib/utils';

// Coverage (5t): two cards under today's headings, every type as a chip with its colour as a dot
// and the count at its end, most first; types at 0 are muted. The text is the theme's, so every
// chip passes contrast whatever the type's colour
const CARD =
  'flex flex-col gap-(--spacing-3) rounded-lg border border-solid border-contrast-border bg-card p-(--spacing-4) text-foreground';
const HEADING =
  'm-0! font-[inherit]! text-(length:--font-size-4)! leading-[1.3]! font-bold';
const TYPES = 'm-0 grid list-none p-0 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-(--spacing-2)';
const TYPE =
  'flex h-[2rem] min-w-0 items-center gap-(--spacing-2) rounded-md border border-solid border-contrast-border px-(--spacing-2) text-(length:--font-size-1) leading-[1.4] font-bold';

function Coverage(): React.JSX.Element {
  const { t } = useTranslation('builder');
  const strong = useStore(useShallow(selectBuilderStrong));
  const weak = useStore(useShallow(selectBuilderWeak));

  const card = (heading: string, counts: typeof strong, key: string) => (
    <div className={CARD}>
      <h2 className={HEADING}>{heading}</h2>
      <ul className={TYPES}>
        {Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .map(([type, count]) => (
            <li
              className={cn(TYPE, !count && 'font-normal text-row-muted')}
              key={`${key}-type-${type}`}
            >
              <span
                aria-hidden
                className="size-[0.714rem] shrink-0 rounded-full"
                style={{ backgroundColor: TYPE_COLOR[type as Type] }}
              />
              {type} <span className="ml-auto tabular-nums">{count}</span>
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    // It scrolls on its own, so it takes focus for keyboard scrolling (axe's scrollable-region-focusable)
    <section
      aria-label={t('coverage')}
      className="flex h-full flex-col flex-nowrap gap-(--spacing-3) overflow-auto pb-(--spacing-3) outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-row-ring"
      tabIndex={0}
    >
      {card(t('number_of_moves'), strong, 'strong')}
      {card(t('weak_against'), weak, 'weak')}
    </section>
  );
}

export default Coverage;
