import React from 'react';
import { TYPE_COLOR } from 'constants/colors';
import { TPokemon } from 'constants/types';
import styles from './Type.module.scss';

interface TypeProps {
  pokemon: TPokemon;
}

const Type: React.FC<TypeProps> = ({ pokemon }) => {
  return (
    <div className={styles.container}>
      <span>Type:</span>
      <div className={styles.types}>
        <span style={{ backgroundColor: TYPE_COLOR[pokemon?.type] }}>{pokemon?.type}</span>
        {!!pokemon?.dualtype && (
          <span style={{ backgroundColor: TYPE_COLOR[pokemon?.dualtype] }}>
            {pokemon?.dualtype}
          </span>
        )}
      </div>
    </div>
  );
};

export default Type;
