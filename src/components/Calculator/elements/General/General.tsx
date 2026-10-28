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
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { BUTTON_ICON, MinusIcon, PlusIcon } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';

const ABILITY_OPTIONS = [...new Set(ABILITIES[8])].map((smogonAbility) => {
  return { text: smogonAbility, value: smogonAbility };
});

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

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-(--spacing-5)">
      <PokeController encounters={encounters} name={`pokemon${pokemon}`} />
      <div className="flex flex-row flex-nowrap items-center gap-(--spacing-1)">
        <Button
          className="block"
          data-testid={`minus-level${pokemon}`}
          onClick={decrement}
          size="icon"
          type="button"
          variant="secondary"
        >
          <MinusIcon className={BUTTON_ICON} />
        </Button>
        <input
          className="w-[4.286rem] p-(--spacing-1)"
          data-testid={`level-input${pokemon}`}
          id={`level${pokemon}`}
          maxLength={3}
          pattern="\d*"
          onChange={(e) => {
            update({ [`level${pokemon}`]: Number(e.target.value) });
          }}
          value={form[`level${pokemon}`] || 0}
        />
        <Button
          className="block"
          data-testid={`plus-level${pokemon}`}
          onClick={increment}
          size="icon"
          type="button"
          variant="secondary"
        >
          <PlusIcon className={BUTTON_ICON} />
        </Button>
      </div>
      <Select
        aria-label="gender-selector"
        caret="font"
        className="ml-auto w-full [&_[data-slot=select]]:min-w-[8.929rem]"
        contained
        data-testid={`gender${pokemon}`}
        look="contrast"
        onChange={(value) => update({ [`gender${pokemon}`]: value })}
        options={GENDERS}
        placeholder={t('gender')}
        value={form[`gender${pokemon}`] ?? ''}
      />

      {form.calculatorGen > 2 && (
        <>
          <Combobox
            aria-label="nature-selector"
            className="col-span-full"
            caret="font"
            clearable
            data-testid={`nature${pokemon}`}
            onChange={(value) => update({ [`nature${pokemon}`]: value })}
            options={natureOptions}
            placeholder={t('select_nature')}
            value={form[`nature${pokemon}`] ?? ''}
          />
          <Combobox
            aria-label="ability"
            className="col-span-full"
            caret="font"
            clearable
            data-testid={`ability${pokemon}`}
            onChange={(value) => update({ [`ability${pokemon}`]: value })}
            options={ABILITY_OPTIONS}
            placeholder={t('select_ability')}
            value={form[`ability${pokemon}`] ?? ''}
          />
        </>
      )}
      {form.calculatorGen > 1 && (
        <ItemSelector
          dataTestId={`item${pokemon}`}
          item={form[`item${pokemon}`] ?? ''}
          onChange={(newItem) => update({ [`item${pokemon}`]: newItem })}
        />
      )}
      <Combobox
        aria-label="status"
        caret="font"
        className="col-span-full"
        clearable
        data-testid={`status${pokemon}`}
        onChange={(value) => update({ [`status${pokemon}`]: value })}
        options={STATUS_EFFECTS}
        placeholder={t('select_status')}
        value={form[`status${pokemon}`] ?? ''}
      />
    </div>
  );
}

export default General;
