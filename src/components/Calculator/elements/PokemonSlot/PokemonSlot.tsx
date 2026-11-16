import { PkmImage } from 'common';
import type { TPokemon } from 'constants/types';
import { ChevronDownIcon } from '@/components/ui/icons';

interface PokemonSlotProps {
  pokemon: TPokemon;
}

// The side's Pokémon (5s): the sprite on a tile tinted by its first type (`--t1`, set by the
// card), then its name and a ▾. Phrasing content only: it sits inside the selector's button
export const SPRITE_TILE =
  'flex size-[4rem] shrink-0 items-center justify-center rounded-lg border border-solid border-[color-mix(in_srgb,var(--t1,transparent)_35%,transparent)] bg-[color-mix(in_srgb,var(--t1,transparent)_19%,transparent)] dark:bg-[color-mix(in_srgb,var(--t1,transparent)_10%,transparent)] max-sm:size-[3.429rem]';

function PokemonSlot({ pokemon }: PokemonSlotProps): React.JSX.Element {
  return (
    <>
      <span className={SPRITE_TILE}>
        <PkmImage name={pokemon?.text} />
      </span>
      <span className="flex min-w-0 items-center gap-(--spacing-1) text-(length:--font-size-4) font-bold">
        <span className="truncate">{pokemon?.text}</span>
        <ChevronDownIcon aria-hidden className="size-[1rem] shrink-0 text-row-muted" />
      </span>
    </>
  );
}

export default PokemonSlot;
