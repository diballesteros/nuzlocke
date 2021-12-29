import { useCallback } from 'react';
import shallow from 'zustand/shallow';
import { Type } from 'components';
import { FAIRY_GEN } from 'constants/constant';
import type { TPokemon } from 'constants/types';
import useStore from 'store';
import styles from './PokemonType.module.scss';

interface PokemonTypeProps {
  pokemon: TPokemon;
}

function PokemonType({ pokemon }: PokemonTypeProps): JSX.Element {
  const selectedGame = useStore(
    useCallback((state) => state.selectedGame, []),
    shallow
  );

  return (
    <div className={styles.container}>
      {pokemon.previousType && Number(selectedGame?.value) < FAIRY_GEN ? (
        <Type type={pokemon?.previousType} />
      ) : (
        <>
          <Type type={pokemon?.type} />
          {!!pokemon?.dualtype && <Type type={pokemon?.dualtype} />}
        </>
      )}
    </div>
  );
}

export default PokemonType;
