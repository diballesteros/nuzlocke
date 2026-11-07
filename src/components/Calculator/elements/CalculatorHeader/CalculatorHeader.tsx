import { GenerationNum, Result } from '@smogon/calc';
import type { TFunction } from 'i18next';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Help, MainField } from 'components/Calculator/elements';
import { DEFAULT_VALUES } from 'constants/calculator';
import { GENERATION_SELECT, MAX_GAME } from 'constants/constant';
import useStore from 'store';
import { TOOLBAR_BUTTON, TOOLBAR_DANGER } from 'components/Tracker/elements/buttons';
import { ChevronDownIcon, RefreshIcon } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const GENERATIONS = GENERATION_SELECT.map(({ text, value }) => ({ text, value: String(value) }));

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

// The Calculator's toolbar (5s): the generation for custom games, Field and Reset outlined like the
// tracker's toolbar (Reset in red), and help at the far end
function CalculatorHeader(): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-(--spacing-2)">
      {selectedGame?.value && Number(selectedGame.value) > MAX_GAME && (
        <Select
          aria-label={t('generation')}
          className="w-auto"
          contained
          data-testid="gen-selector"
          icon={<ChevronDownIcon aria-hidden className="size-[1rem] shrink-0" />}
          look="row"
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
          triggerClassName="h-[2.571rem] w-auto"
          value={form?.calculatorGen ? String(form.calculatorGen) : ''}
        />
      )}
      <MainField />
      <button
        className={cn(TOOLBAR_BUTTON, TOOLBAR_DANGER)}
        data-testid="reset-calculator"
        onClick={() => {
          update({ ...DEFAULT_VALUES });
        }}
        type="button"
      >
        <RefreshIcon aria-hidden />
        {t('reset')}
      </button>
      <Help className="ml-auto" content={t('calculator_help')} />
    </div>
  );
}

export default CalculatorHeader;
