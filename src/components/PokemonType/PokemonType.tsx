import React from 'react';
import { Type } from 'components';
import { TPokemon } from 'constants/types';
import styles from './PokemonType.module.scss';

interface PokemonTypeProps {
  pokemon: TPokemon;
}

const PokemonType: React.FC<PokemonTypeProps> = ({ pokemon }) => {
  return (
    <div className={styles.container}>
      <Type type={pokemon?.type} />
      {!!pokemon?.dualtype && <Type type={pokemon?.dualtype} />}
    </div>
  );
};

export default PokemonType;
