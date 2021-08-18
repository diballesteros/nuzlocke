import React from 'react';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import { TEncounter, TPokemon } from 'constants/types';
import styles from './PokeInfo.module.scss';

interface PokeInfoProps {
  encounter: TEncounter;
  pokemon: TPokemon;
}

const PokeInfo: React.FC<PokeInfoProps> = ({ encounter, pokemon }) => {
  const getGenderIcon = () => {
    switch (encounter?.details?.gender) {
      case 'MALE':
        return <Icon name="man" />;
      case 'FEMALE':
        return <Icon name="woman" />;
      default:
        return null;
    }
  };
  return (
    <div className={styles.container}>
      <span>
        {pokemon?.text} {!!encounter?.details?.gender && getGenderIcon()}
        {!!encounter?.details?.level && ` Lv. ${encounter.details.level}`}
      </span>
      <span>Met at: {encounter.location}</span>
      <span> {!!encounter?.details?.metLevel && ` Met Lv. ${encounter.details.metLevel}`}</span>
      {encounter.nickname && <span>Nickname: {encounter.nickname}</span>}
      {encounter?.details?.nature && <span>Nature: {encounter.details.nature}</span>}
      {encounter?.details?.ability && <span>Ability: {encounter.details.ability}</span>}
      {encounter?.details?.item && <span>Item: {encounter.details.item}</span>}
      {encounter?.details?.faint && encounter.status.value === 2 && (
        <span>Cause of Fainting: {encounter.details.faint}</span>
      )}
    </div>
  );
};

export default PokeInfo;
