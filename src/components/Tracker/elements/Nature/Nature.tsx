import { Leaf } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import NATURES from 'constants/natures';
import type { TEncounter } from 'constants/types';
import useStore from 'store';
import { BUTTON_ICON } from '@/components/ui/icons';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { OUTLINE_BUTTON } from '../buttons';

interface NatureProps {
  encounter: TEncounter;
}

const OPTIONS = NATURES.map((nature) => ({ text: nature.text, value: nature.value }));

// Semantic's `button` Dropdown with a leaf in place of the caret, outlined like the row's other
// buttons and 2.2rem tall. On the narrowest screens only the leaf shows. Its menu, in the button's
// font, lines up with its right edge (`direction="left"`)
const TRIGGER = cn(
  OUTLINE_BUTTON,
  'm-0! flex! h-[2.2rem] w-fit items-center justify-center data-[state=open]:rounded-b-none [&>span:first-child]:mr-(--spacing-1) max-xs:w-[2.5rem] max-xs:[&>span:first-child]:[display:none]!'
);

function Nature({ encounter }: NatureProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const changeNature = useStore(useCallback((state) => state.changeNature, []));

  return (
    <Select
      align="end"
      aria-label={t('nature')}
      className="font-control"
      contained
      data-testid={`nature-${encounter.id}`}
      icon={<Leaf aria-hidden className={cn(BUTTON_ICON, 'opacity-80')} strokeWidth={2.5} />}
      look="button"
      onChange={(value) => changeNature(encounter.id, value)}
      options={OPTIONS}
      scrolling
      text={encounter?.details?.nature ?? t('nature')}
      triggerClassName={TRIGGER}
      value={encounter?.details?.nature ?? ''}
    />
  );
}

export default Nature;
