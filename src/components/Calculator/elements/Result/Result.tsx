import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getDesc } from 'components/Calculator/elements/CalculatorHeader/CalculatorHeader';
import useCalculate from 'hooks/useCalculate';
import { Pin } from 'lucide-react';
import { ChevronDownIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { ROW_GHOST } from 'components/Tracker/elements/buttons';

export type Primary = [position: 'attacker' | 'defender', index: number];

interface ResultProps {
  // Once the card sticks to the top on phones it keeps only its numbers
  compact?: boolean;
  primary: Primary;
  setPrimary: (primary: Primary) => void;
}

// A move's result in the list: the pinned one is bold and coloured
const RESULT =
  'flex cursor-pointer items-start gap-(--spacing-2) rounded-md px-(--spacing-2) py-(--spacing-1) outline-none hover:bg-foreground/8 focus-visible:outline-2 focus-visible:outline-row-ring';
const ACTIVE_RESULT = 'font-bold text-row-link';

// "Lvl 12 Scorbunny Ember vs. Lvl 11 Rookidee: 9-11 (28.1 - 34.4%) -- guaranteed 4HKO" → the
// range, the percentages and the KO chance, for the large line. Anything else (no move, an
// invalid calculation) shows only as the sentence
const DAMAGE = /: (\d+)-(\d+) \(([\d.]+) - ([\d.]+)%\)(?: -- (.+))?$/;

// The result card (5s): the range large, the percentage beside it and the KO chance as a chip,
// the full sentence muted under it. The ▾ opens every move's result, to pin one
function Result({ compact = false, primary, setPrimary }: ResultProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const [expanded, setExpanded] = useState(false);
  const resultsId = useId();
  const { attackerResults, defenderResults } = useCalculate();
  const desc =
    primary[0] === 'attacker'
      ? getDesc(attackerResults[primary[1]], t)
      : getDesc(defenderResults[primary[1]], t);
  const damage = DAMAGE.exec(desc);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, change: Primary) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setPrimary(change);
    }
  };

  const handleMainKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpanded((prevState) => !prevState);
    }
  };

  const list = (position: Primary[0], results: typeof attackerResults) => (
    <div className="flex flex-col flex-nowrap gap-(--spacing-1)">
      <b className="px-(--spacing-2) text-(length:--font-size-1) tracking-[0.06em] text-row-muted uppercase">
        {position === 'attacker' ? 'Pokémon 1 → Pokémon 2' : 'Pokémon 2 → Pokémon 1'}
      </b>
      {results.map((result, i) => (
        <div
          className={cn(RESULT, primary[0] === position && primary[1] === i && ACTIVE_RESULT)}
          data-testid={`${position}-result-${i + 1}`}
          key={`${position}-result-${i + 1}`}
          onClick={() => setPrimary([position, i])}
          onKeyDown={(e) => handleKeyDown(e, [position, i])}
          role="button"
          tabIndex={0}
        >
          <Pin aria-hidden className="mt-[0.2em] size-[1em] shrink-0" />
          {getDesc(result, t)}
        </div>
      ))}
    </div>
  );

  return (
    <section
      aria-label={t('result')}
      className={cn(
        'flex shrink-0 flex-col rounded-lg border border-solid border-contrast-border bg-card py-(--spacing-3) pr-(--spacing-2) pl-(--spacing-4) text-foreground max-sm:pl-(--spacing-3)',
        compact && 'py-(--spacing-2)'
      )}
    >
      <div className="flex items-center gap-(--spacing-4)">
        <div className="flex min-w-0 flex-1 flex-col gap-(--spacing-1)">
          {damage && (
            <div aria-hidden className="flex flex-wrap items-baseline gap-x-(--spacing-3)">
              <b className="text-[1.714rem] leading-[1.2] tabular-nums max-sm:text-[1.429rem]">
                {damage[1]}–{damage[2]}
              </b>
              <span className="text-(length:--font-size-4) font-bold text-row-muted tabular-nums">
                {damage[3]}–{damage[4]}%
              </span>
              {damage[5] && (
                <span className="rounded-full bg-foreground/10 px-(--spacing-2) py-[0.143rem] text-(length:--font-size-1) font-bold">
                  {damage[5]}
                </span>
              )}
            </div>
          )}
          <output
            className={cn(
              'text-(length:--font-size-1) text-row-muted',
              !damage && 'text-(length:--font-size-2) font-bold text-foreground',
              compact && damage && 'sr-only'
            )}
            data-testid="primary-damage"
          >
            {desc}
          </output>
        </div>
        <span className="shrink-0 text-(length:--font-size-1) text-row-muted max-md:hidden">
          {primary[0] === 'attacker' ? 'Pokémon 1 → Pokémon 2' : 'Pokémon 2 → Pokémon 1'}
        </span>
        <div
          aria-controls={resultsId}
          aria-expanded={expanded}
          aria-label={t('all_results')}
          className={cn(ROW_GHOST, 'text-row-muted hover:text-foreground')}
          data-testid="expand-moves"
          onClick={() => setExpanded((prevState) => !prevState)}
          onKeyDown={handleMainKeyDown}
          role="button"
          tabIndex={0}
          title={t('all_results')}
        >
          <ChevronDownIcon
            className={cn('transition-transform duration-150', expanded && 'rotate-180')}
          />
        </div>
      </div>
      <div
        className={cn(
          'flex-col flex-nowrap gap-(--spacing-3) pt-(--spacing-3) text-(length:--font-size-2)',
          expanded ? 'flex' : 'hidden'
        )}
        id={resultsId}
      >
        <span className="px-(--spacing-2) text-row-muted">{t('select_one')}</span>
        {list('attacker', attackerResults)}
        {list('defender', defenderResults)}
      </div>
    </section>
  );
}

export default Result;
