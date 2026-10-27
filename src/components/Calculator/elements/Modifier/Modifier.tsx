import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useStore from 'store';
import { Button } from '@/components/ui/button';
import { BUTTON_ICON, MinusIcon, PlusIcon } from '@/components/ui/icons';

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
    <div className="mx-auto my-0 flex w-full flex-row flex-nowrap items-center gap-(--spacing-2) self-center">
      <span className="mr-(--spacing-2) select-none">{t('modifier')}:</span>
      <Button
        className="m-0!"
        data-testid={`minus-${name}`}
        onClick={decrement}
        size="icon"
        type="button"
        variant="secondary"
      >
        <MinusIcon className={BUTTON_ICON} />
      </Button>
      <output
        className="min-w-[2.143rem] rounded-[4px] border border-solid border-foreground p-(--spacing-2) text-center font-bold select-none"
        data-testid={name}
      >
        {form[name]}
      </output>
      <Button
        className="m-0!"
        data-testid={`plus-${name}`}
        onClick={increment}
        size="icon"
        type="button"
        variant="secondary"
      >
        <PlusIcon className={BUTTON_ICON} />
      </Button>
    </div>
  );
}

export default Modifier;
