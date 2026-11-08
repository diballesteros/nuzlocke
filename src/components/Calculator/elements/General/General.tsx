import { ABILITIES } from '@smogon/calc';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemSelector } from 'common';
import { PokeController } from 'components/Calculator/elements';
import { STATUS_EFFECTS } from 'constants/calculator';
import { GENDERS } from 'constants/constant';
import type { TEncounter } from 'constants/types';
import { useNatureOptions } from 'hooks/useNatures';
import useStore from 'store';
import { ROW_GHOST } from 'components/Tracker/elements/buttons';
import { Combobox } from '@/components/ui/combobox';
import { ChevronDownIcon, MinusIcon, PlusIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { Select } from '@/components/ui/select';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

// A captioned field (5s), as in the encounter editor
export const FIELD = 'flex min-w-0 flex-col gap-(--spacing-1)';
export const CAPTION = 'text-(length:--font-size-1) font-bold text-row-muted';
// The level stepper's − and +: square ghosts inside its outlined box
const STEP = cn(
  ROW_GHOST,
  'size-[2.143rem] rounded-none text-row-muted hover:text-foreground [&_svg]:size-[0.857rem]'
);

interface GeneralProps {
  encounters?: TEncounter[];
  pokemon: '1' | '2';
}

function General({ encounters, pokemon }: GeneralProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const natureOptions = useNatureOptions();
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));
  const increment = () => {
    const currentLevel = form[`level${pokemon}`];
    if (currentLevel < 100) {
      update({ [`level${pokemon}`]: Number(currentLevel) + 1 });
    }
  };

  const decrement = () => {
    const currentLevel = form[`level${pokemon}`];
    if (currentLevel > 0) {
      update({ [`level${pokemon}`]: currentLevel - 1 });
    }
  };

  const id = (field: string) => `${field}${pokemon}-caption`;
  const chevron = <ChevronDownIcon aria-hidden className="size-[1rem] shrink-0" />;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-(--spacing-4) gap-y-(--spacing-3)">
      <PokeController encounters={encounters} name={`pokemon${pokemon}`} />
      <div aria-labelledby={id('level')} className={FIELD} role="group">
        <span className={CAPTION} id={id('level')}>
          {t('level', { ns: 'rules' })}
        </span>
        <div className="flex h-[2.286rem] w-fit items-center rounded-md border border-solid border-contrast-border">
          <button
            aria-label={t('level_down', { ns: 'tracker' })}
            className={STEP}
            data-testid={`minus-level${pokemon}`}
            onClick={decrement}
            type="button"
          >
            <MinusIcon aria-hidden />
          </button>
          <span className="flex h-full items-center gap-(--spacing-1) border-0 border-x border-solid border-contrast-border px-(--spacing-2)">
            <small aria-hidden className="text-(length:--font-size-1) text-row-muted">
              Lv
            </small>
            <input
              aria-label={t('level', { ns: 'rules' })}
              className="m-0 w-[2.143rem] border-0 bg-transparent p-0 text-center text-(length:--font-size-2) font-bold text-foreground tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-row-ring"
              data-testid={`level-input${pokemon}`}
              id={`level${pokemon}`}
              inputMode="numeric"
              maxLength={3}
              pattern="\d*"
              onChange={(e) => {
                update({ [`level${pokemon}`]: Number(e.target.value) });
              }}
              value={form[`level${pokemon}`] || 0}
            />
          </span>
          <button
            aria-label={t('level_up', { ns: 'tracker' })}
            className={STEP}
            data-testid={`plus-level${pokemon}`}
            onClick={increment}
            type="button"
          >
            <PlusIcon aria-hidden />
          </button>
        </div>
      </div>
      <div className={FIELD}>
        <span aria-hidden className={CAPTION}>
          {t('gender', { ns: 'tracker' })}
        </span>
        <Select
          aria-label={t('gender', { ns: 'tracker' })}
          clearable
          contained
          data-testid={`gender${pokemon}`}
          icon={chevron}
          look="row"
          onChange={(value) => update({ [`gender${pokemon}`]: value })}
          options={GENDERS}
          placeholder="–"
          triggerClassName="leading-[1.4]!"
          value={form[`gender${pokemon}`] ?? ''}
        />
      </div>
      {form.calculatorGen > 2 && (
        <>
          <div className={FIELD}>
            <span aria-hidden className={CAPTION}>
              {t('nature', { ns: 'tracker' })}
            </span>
            <Combobox
              aria-label={t('nature', { ns: 'tracker' })}
              clearable
              data-testid={`nature${pokemon}`}
              look="row"
              onChange={(value) => update({ [`nature${pokemon}`]: value })}
              options={natureOptions}
              placeholder={t('select_nature')}
              value={form[`nature${pokemon}`] ?? ''}
            />
          </div>
          <div className={FIELD}>
            <span aria-hidden className={CAPTION}>
              {t('ability', { ns: 'tracker' })}
            </span>
            <Combobox
              aria-label={t('ability', { ns: 'tracker' })}
              clearable
              data-testid={`ability${pokemon}`}
              look="row"
              onChange={(value) => update({ [`ability${pokemon}`]: value })}
              options={ABILITY_OPTIONS}
              placeholder={t('select_ability')}
              value={form[`ability${pokemon}`] ?? ''}
            />
          </div>
        </>
      )}
      {form.calculatorGen > 1 && (
        <div className={FIELD}>
          <span aria-hidden className={CAPTION}>
            {t('item')}
          </span>
          <ItemSelector
            aria-label={t('item')}
            dataTestId={`item${pokemon}`}
            item={form[`item${pokemon}`] ?? ''}
            look="row"
            onChange={(newItem) => update({ [`item${pokemon}`]: newItem })}
          />
        </div>
      )}
      <div className={FIELD}>
        <span aria-hidden className={CAPTION}>
          {t('status', { ns: 'common' })}
        </span>
        <Combobox
          aria-label={t('status', { ns: 'common' })}
          clearable
          data-testid={`status${pokemon}`}
          look="row"
          onChange={(value) => update({ [`status${pokemon}`]: value })}
          options={STATUS_EFFECTS}
          placeholder={t('select_status')}
          value={form[`status${pokemon}`] ?? ''}
        />
      </div>
    </div>
  );
}

export default General;
