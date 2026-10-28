import { useCallback } from 'react';
import { Type } from 'components';
import { FAIRY_GEN } from 'constants/constant';
import type { TPokemon } from 'constants/types';
import useStore from 'store';

interface PokemonTypeProps {
  pokemon: TPokemon;
}

function PokemonType({ pokemon }: PokemonTypeProps): React.JSX.Element {
  const selectedGame = useStore(useCallback((state) => state.selectedGame, []));

  return (
    <div className="flex cursor-pointer items-center gap-(--spacing-1)">
      {pokemon.previousType && Number(selectedGame?.value) < FAIRY_GEN ? (
        <>
          <Type type={pokemon?.previousType} />
          {!!pokemon?.previousDualType && <Type type={pokemon?.previousDualType} />}
        </>
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
