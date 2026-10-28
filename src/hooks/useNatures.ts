import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NATURES from 'constants/natures';

// Natures are stored by their English name; only the label follows the app's language. A name
// without a translation (an odd value from an import) shows as stored
export function useNatureName(): (nature: string) => string {
  const { t } = useTranslation('common');
  return (nature) => t(`natures.${nature}`, { defaultValue: nature });
}

// The natures as select options, labelled in the app's language. Searching still matches the
// English name, which players may know from guides
export function useNatureOptions() {
  const { t } = useTranslation('common');
  return useMemo(
    () =>
      NATURES.map((nature) => ({
        keywords: [nature.value],
        text: t(`natures.${nature.value}`, { defaultValue: nature.value }),
        value: nature.value,
      })),
    [t]
  );
}
