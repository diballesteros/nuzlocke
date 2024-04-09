import { useTranslation } from 'react-i18next';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import type { Gender, TEncounter, TPokemon } from 'constants/types';
import styles from './PokeInfo.module.scss';

interface PokeInfoProps {
  encounter: TEncounter;
  pokemon: TPokemon;
}

export const getGenderIcon = (gender: Gender) => {
  switch (gender) {
    case 'MALE':
      return <Icon name="man" />;
    case 'FEMALE':
      return <Icon name="woman" />;
    default:
      return null;
  }
};

function PokeInfo({ encounter, pokemon }: PokeInfoProps): React.JSX.Element {
  const { t } = useTranslation('stats');

  return (
    <div className={styles.container}>
      <b>
        {pokemon?.text} {!!encounter?.details?.gender && getGenderIcon(encounter?.details?.gender)}
        {!!encounter?.details?.level && ` Lv. ${encounter.details.level}`}
      </b>
      {encounter.nickname && <span>{encounter.nickname}</span>}
      <span>
        {t('met_at')}: {encounter.location}
        {!!encounter?.details?.metLevel && `,  ${t('at')} lv. ${encounter.details.metLevel}`}
      </span>
      {encounter?.details?.nature && <span>{encounter.details.nature} nature</span>}
      {encounter?.details?.ability && <span>{encounter.details.ability}</span>}
      {encounter?.details?.item && <span>Item: {encounter.details.item}</span>}
      {encounter?.details?.faint && encounter.status.value === 2 && (
        <span>Cause of Fainting: {encounter.details.faint}</span>
      )}
    </div>
  );
}

export default PokeInfo;
