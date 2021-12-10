import { Type } from 'components';
import type { TPokemon } from 'constants/types';
import styles from './PokemonType.module.scss';

interface PokemonTypeProps {
  pokemon: TPokemon;
}

function PokemonType({ pokemon }: PokemonTypeProps): JSX.Element {
  return (
    <div className={styles.container}>
      <Type type={pokemon?.type} />
      {!!pokemon?.dualtype && <Type type={pokemon?.dualtype} />}
    </div>
  );
}

export default PokemonType;
