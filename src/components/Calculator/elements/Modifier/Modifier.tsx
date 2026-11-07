import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from 'store';
import { ROW_ICON_CONTROL } from 'components/Tracker/elements/buttons';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

const STEP = cn(
  ROW_ICON_CONTROL,
  'size-[2rem] text-row-muted hover:text-foreground [&_svg]:size-[0.857rem]'
);

interface ModifierProps {
  name:
    | 'modatk1'
    | 'modatk2'
    | 'moddef1'
    | 'moddef2'
    | 'modspatk1'
    | 'modspatk2'
    | 'modspdef1'
    | 'modspdef2'
    | 'modspeed1'
    | 'modspeed2';
}

function Modifier({ name }: ModifierProps): React.JSX.Element {
  const { t } = useTranslation('calculator');
  const form = useStore(useCallback((state) => state.calcs[state?.selectedGame?.value]?.form, []));
  const update = useStore(useCallback((state) => state.updateDefaultValues, []));

  const decrement = () => {
    if (form[name] > -6) {
      update({ [name]: Number(form[name]) - 1 });
    }
  };

  const increment = () => {
    if (form[name] < 6) {
      update({ [name]: Number(form[name]) + 1 });
    }
  };

  return (
    <>
      <span className="text-(length:--font-size-1) font-bold text-row-muted select-none">
        {t('modifier')}
      </span>
      <div className="col-span-2 flex items-center gap-(--spacing-1)">
        <button
          aria-label={t('lower_boost')}
          className={STEP}
          data-testid={`minus-${name}`}
          onClick={decrement}
          type="button"
        >
          <MinusIcon aria-hidden />
        </button>
        <output
          className="min-w-[2.286rem] text-center text-(length:--font-size-2) font-bold tabular-nums select-none"
          data-testid={name}
        >
          {form[name]}
        </output>
        <button
          aria-label={t('raise_boost')}
          className={STEP}
          data-testid={`plus-${name}`}
          onClick={increment}
          type="button"
        >
          <PlusIcon aria-hidden />
        </button>
      </div>
    </>
  );
}

export default Modifier;
