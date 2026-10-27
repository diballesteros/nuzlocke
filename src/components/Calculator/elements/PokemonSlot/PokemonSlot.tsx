import { PkmImage } from 'common';
import { PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import type { TPokemon } from 'constants/types';

interface PokemonSlotProps {
  pokemon: TPokemon;
}

function PokemonSlot({ pokemon }: PokemonSlotProps): React.JSX.Element {
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-[4px] px-(--spacing-2) py-(--spacing-3) [&>div:last-child]:flex-col [&>div:last-child]:flex-nowrap"
      style={{ backgroundColor: `${TYPE_COLOR[pokemon?.type]}50` }}
    >
      <div className="flex flex-col flex-nowrap items-center">
        <div className="flex h-[3.5rem] w-[4.5rem] items-center justify-center">
          <PkmImage name={pokemon?.text} />
        </div>
        <span>{pokemon?.text}</span>
      </div>
      <PokemonType pokemon={pokemon} />
    </div>
  );
}

export default PokemonSlot;
