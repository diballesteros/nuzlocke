import { useTranslation } from 'react-i18next';
import { MarsIcon, VenusIcon } from '@/components/ui/icons';
import type { Gender, TEncounter, TPokemon } from 'constants/types';
import { useNatureName } from 'hooks/useNatures';

interface PokeInfoProps {
  encounter: TEncounter;
  pokemon: TPokemon;
}

// Semantic's icon slot after a name: 1.18em × 1em with 0.25rem after it. FontAwesome drew its
// gender glyphs about 0.45em above the baseline whatever the line height, so the svg sits on the
// baseline like the icon font did, with its drawing nudged down to the same place
const GENDER_ICON = 'mr-[0.25rem] inline-block h-[1em] w-[1.18em] translate-y-[0.1em]';

export const getGenderIcon = (gender: Gender) => {
  switch (gender) {
    case 'MALE':
      return <MarsIcon className={GENDER_ICON} />;
    case 'FEMALE':
      return <VenusIcon className={GENDER_ICON} />;
    default:
      return null;
  }
};

function PokeInfo({ encounter, pokemon }: PokeInfoProps): React.JSX.Element {
  const { t } = useTranslation('stats');
  const natureName = useNatureName();

  return (
    <div className="flex flex-col flex-wrap [&>span]:max-w-[16.071rem] max-[39.286rem]:[&>span]:max-w-[8.929rem]">
      <b>
        {pokemon?.text} {!!encounter?.details?.gender && getGenderIcon(encounter?.details?.gender)}
        {!!encounter?.details?.level && ` Lv. ${encounter.details.level}`}
      </b>
      {encounter.nickname && <span>{encounter.nickname}</span>}
      <span>
        {t('met_at')}: {encounter.location}
        {!!encounter?.details?.metLevel && `,  ${t('at')} lv. ${encounter.details.metLevel}`}
      </span>
      {encounter?.details?.nature && (
        <span>{t('nature_of', { nature: natureName(encounter.details.nature) })}</span>
      )}
      {encounter?.details?.ability && <span>{encounter.details.ability}</span>}
      {encounter?.details?.item && <span>Item: {encounter.details.item}</span>}
      {encounter?.details?.faint && encounter.status.value === 2 && (
        <span>Cause of Fainting: {encounter.details.faint}</span>
      )}
    </div>
  );
}

export default PokeInfo;
