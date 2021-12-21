import { PkmImage } from 'common';
import { PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import type { TPokemon } from 'constants/types';
import styles from './PokemonSlot.module.scss';

interface PokemonSlotProps {
  pokemon: TPokemon;
}

function PokemonSlot({ pokemon }: PokemonSlotProps): JSX.Element {
  return (
    <div className={styles.selector} style={{ backgroundColor: `${TYPE_COLOR[pokemon?.type]}50` }}>
      <div className={styles.info}>
        <div className={styles.image}>
          <PkmImage name={pokemon?.text} />
        </div>
        <span>{pokemon?.text}</span>
      </div>
      <PokemonType pokemon={pokemon} />
    </div>
  );
}

export default PokemonSlot;
