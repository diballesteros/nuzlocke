import { PkmImage } from 'common';
import { PokemonType } from 'components';
import { TYPE_COLOR } from 'constants/colors';
import type { TPokemon } from 'constants/types';
import { cn } from '@/lib/utils';

interface SelectorRowProps {
  // A tag pinned to the row's top-left corner (suggested, dupe)
  tag?: React.ReactNode;
  dupe?: boolean;
  name: string;
  onClick: () => void;
  pokemon: TPokemon;
  shiny?: boolean;
  style: React.CSSProperties;
}

// One Pokémon in a selector dialog's virtualized list, tinted with its primary type's colour
function SelectorRow({
  tag,
  dupe = false,
  name,
  onClick,
  pokemon,
  shiny,
  style,
}: SelectorRowProps): React.JSX.Element {
  return (
    <div className="rounded-[4px] pr-(--spacing-3)" style={style}>
      <div
        className={cn(
          'flex h-[calc(100%-var(--spacing-3))] cursor-pointer flex-row flex-nowrap items-center justify-between rounded-[4px] px-(--spacing-3) hover:scale-[1.01] [&>div:last-child]:flex-col [&>div:last-child]:flex-nowrap',
          dupe && 'grayscale'
        )}
        data-testid={`poke-${pokemon.text}`}
        onClick={onClick}
        role="presentation"
        style={{ backgroundColor: `${TYPE_COLOR[pokemon.type]}50` }}
      >
        {tag}
        <div className="flex flex-col flex-nowrap items-center">
          <div className="flex h-[3.5rem] w-[4.5rem] items-center justify-center">
            <PkmImage name={pokemon.text} shiny={shiny} />
          </div>
          <b>{name}</b>
        </div>
        <PokemonType pokemon={pokemon} />
      </div>
    </div>
  );
}

// The look of a row's tag
export const SELECTOR_TAG =
  'absolute top-(--spacing-0) left-(--spacing-2) z-1 flex w-fit items-center gap-(--spacing-1) rounded-[4px] bg-suggestion p-(--spacing-0) text-(length:--font-size-4) font-bold text-black';

export default SelectorRow;
