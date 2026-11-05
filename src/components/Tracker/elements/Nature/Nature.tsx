import { Leaf } from 'lucide-react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { TEncounter } from 'constants/types';
import { useNatureName, useNatureOptions } from 'hooks/useNatures';
import useStore from 'store';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface NatureProps {
  encounter: TEncounter;
  // Phones show the leaf only, named by the field's label
  iconOnly?: boolean;
  triggerClassName?: string;
}

// The row's Nature field: an outlined control with the nature (or "Nature") and a leaf, in a fixed
// slot so the row's columns line up. Its menu is portalled: inside the row it would sit under the
// next one, which react-window 2 positions with a transform
function Nature({ encounter, iconOnly = false, triggerClassName }: NatureProps): React.JSX.Element {
  const { t } = useTranslation('common');
  const changeNature = useStore(useCallback((state) => state.changeNature, []));
  const natureName = useNatureName();
  const options = useNatureOptions();

  return (
    <Select
      align="end"
      aria-label={t('nature')}
      data-testid={`nature-${encounter.id}`}
      // The leaf leads, like the row's other buttons' icons, and there's no caret
      icon={<span aria-hidden />}
      leading={<Leaf aria-hidden className="size-[1.143rem] shrink-0" strokeWidth={2.5} />}
      look="row"
      onChange={(value) => changeNature(encounter.id, value)}
      options={options}
      scrolling
      text={encounter?.details?.nature ? natureName(encounter.details.nature) : t('nature')}
      triggerClassName={cn(
        iconOnly
          ? 'w-[2.857rem] justify-center px-0 [&>[data-select-text]]:sr-only'
          : 'w-[7.857rem]',
        triggerClassName
      )}
      value={encounter?.details?.nature ?? ''}
    />
  );
}

export default Nature;
