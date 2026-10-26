import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/shallow';
import { TYPE_COLOR } from 'constants/colors';
import type { Type } from 'constants/types';
import { selectBuilderStrong, selectBuilderWeak } from 'selectors';
import useStore from 'store';

const TYPES = 'grid grid-cols-[repeat(4,minmax(0,6.429rem))] gap-x-(--spacing-2) gap-y-(--spacing-2)';
const TYPE =
  'h-[1.714rem] min-w-[6.429rem] rounded-[8px] p-(--spacing-1) text-center font-bold text-black';

function Coverage(): React.JSX.Element {
  const { t } = useTranslation('builder');
  const strong = useStore(useShallow(selectBuilderStrong));
  const weak = useStore(useShallow(selectBuilderWeak));

  return (
    // Semantic sets display: block on <section>, so flex needs !
    <section className="flex! flex-col flex-nowrap gap-(--spacing-2) p-(--spacing-3) [&_h2]:text-foreground">
      <h2>{t('number_of_moves')}</h2>
      <div className={TYPES}>
        {Object.entries(strong)
          .sort((a, b) => b[1] - a[1])
          .map((entry) => {
            return (
              <div
                className={TYPE}
                key={`strong-type-${entry[0]}`}
                style={{ backgroundColor: TYPE_COLOR[entry[0] as Type] }}
              >
                {entry[0]} {entry[1]}
              </div>
            );
          })}
      </div>
      <h2>{t('weak_against')}</h2>
      <div className={TYPES}>
        {Object.entries(weak)
          .sort((a, b) => b[1] - a[1])
          .map((entry) => {
            return (
              <div
                className={TYPE}
                key={`weak-type-${entry[0]}`}
                style={{ backgroundColor: TYPE_COLOR[entry[0] as Type] }}
              >
                {entry[0]} {entry[1]}
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default Coverage;
