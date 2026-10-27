import { GenerationNum, Result } from '@smogon/calc';
import type { TFunction } from 'i18next';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Help, MainField } from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import { GENERATION_SELECT, MAX_GAME } from 'constants/constant';
import useCalculate from 'hooks/useCalculate';
import useStore from 'store';
import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon, RefreshIcon, TRAILING_ICON } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const GENERATIONS = GENERATION_SELECT.map(({ text, value }) => ({ text, value: String(value) }));

// A move's result in the list: the pinned one is bold and coloured
const RESULT = 'cursor-pointer hover:underline';
const ACTIVE_RESULT = 'font-bold text-badge';

// Semantic's pin icon before each result, in its 1em × 1.18em slot
const PIN = 'mr-[0.25rem] inline-block h-[1em] w-[1.18em] align-top';

export function getDesc(result: Result, t: TFunction): string {
  try {
    return result?.fullDesc() || t('no_move_selected');
  } catch (e) {
    if ((e as Error).message === 'damage[damage.length - 1] === 0.') {
      return `${result.attacker.name} ${result.move.name} vs ${result.defender.name}: 0 - 0%`;
    }
    return t('invalid_calculation');
  }
}

function CalculatorHeader(): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const [expanded, setExpanded] = useState(false);
  const [primary, setPrimary] = useState<[position: 'attacker' | 'defender', index: number]>([
    'attacker',
    0,
  ]);
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const { attackerResults, defenderResults } = useCalculate();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    change: [position: 'attacker' | 'defender', index: number]
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setPrimary(change);
    }
  };

  const handleMainKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setExpanded((prevState) => !prevState);
    }
  };

  return (
    <div className="col-span-full grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center rounded-[4px] bg-card p-(--spacing-2)">
      <div className="col-span-full mt-0 mr-0 mb-(--spacing-3) ml-auto flex items-center gap-(--spacing-2)">
        {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
          <Select
            aria-label="generation-selector"
            caret="font"
            className="w-full max-w-[9.286rem] min-w-[9.286rem] [&_[data-slot=select]]:min-w-[9.286rem] [&_[data-slot=select]]:bg-transparent [&_[data-slot=select]]:text-foreground"
            contained
            data-testid="gen-selector"
            look="inline"
            onChange={(value) =>
              update({
                ...DEFAULT_VALUES,
                pokemon1: 1,
                pokemon2: 1,
                calculatorGen: Number(value) as GenerationNum,
              })
            }
            options={GENERATIONS}
            placeholder={t('select')}
            text={t('generation')}
            value={form?.calculatorGen ? String(form.calculatorGen) : ''}
          />
        )}
        <MainField />
        <Button
          data-testid="reset-calculator"
          onClick={() => {
            update({ ...DEFAULT_VALUES });
          }}
          type="button"
        >
          {t('reset')}
          <RefreshIcon
            className={cn(TRAILING_ICON, 'mr-[0.0512em] ml-[calc(var(--spacing-2)-0.03em)]')}
          />
        </Button>
        <Help className="text-(length:--font-size-4)!" content={t('calculator_help')} />
      </div>
      <div className="col-span-full flex w-full items-center gap-(--spacing-1) font-bold text-foreground">
        <output className="m-auto justify-self-center text-center" data-testid="primary-damage">
          {primary[0] === 'attacker'
            ? getDesc(attackerResults[primary[1]], t)
            : getDesc(defenderResults[primary[1]], t)}
        </output>
        <div
          aria-expanded={expanded}
          aria-label={t('all_results')}
          className="mr-[0.25rem] flex h-[1em] w-[1.18em] min-w-[0.7417em] cursor-pointer items-center justify-center justify-self-end text-(length:--font-size-7) transition-transform duration-150 ease-in-out"
          data-testid="expand-moves"
          onClick={() => setExpanded((prevState) => !prevState)}
          onKeyDown={handleMainKeyDown}
          role="button"
          style={{ transform: expanded ? 'rotate(90deg)' : undefined }}
          tabIndex={0}
        >
          <ChevronRightIcon className="size-[0.75em] translate-y-[calc((1lh-1em)/2)]" />
        </div>
      </div>
      <div
        aria-expanded={expanded}
        className={cn(
          'col-span-full mt-(--spacing-3) flex h-0 w-full flex-col flex-nowrap gap-(--spacing-2) px-(--spacing-2) text-foreground [clip-path:inset(0)]',
          expanded && 'h-fit [clip-path:inset(-100vh,-100vw)]'
        )}
      >
        <span>{t('select_one')}</span>
        <div className="flex flex-col flex-nowrap gap-(--spacing-1)">
          <b>{t('attacker')}:</b>
          {attackerResults.map((result, i) => {
            return (
              <div
                className={cn(
                  RESULT,
                  primary[0] === 'attacker' && primary[1] === i && ACTIVE_RESULT
                )}
                data-testid={`attacker-result-${i + 1}`}
                key={`attacker-result-${i + 1}`}
                onClick={() => setPrimary(['attacker', i])}
                onKeyDown={(e) => handleKeyDown(e, ['attacker', i])}
                role="button"
                tabIndex={0}
              >
                <Pin aria-hidden className={PIN} />
                {getDesc(result, t)}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col flex-nowrap gap-(--spacing-1)">
          <b>{t('defender')}:</b>
          {defenderResults.map((result, i) => {
            return (
              <div
                className={cn(
                  RESULT,
                  primary[0] === 'defender' && primary[1] === i && ACTIVE_RESULT
                )}
                data-testid={`defender-result-${i + 1}`}
                key={`defender-result-${i + 1}`}
                onClick={() => setPrimary(['defender', i])}
                onKeyDown={(e) => handleKeyDown(e, ['defender', i])}
                role="button"
                tabIndex={0}
              >
                <Pin aria-hidden className={PIN} />
                {getDesc(result, t)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CalculatorHeader;
