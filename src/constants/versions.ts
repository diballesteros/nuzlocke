import type { TVersion } from 'constants/types';

// The versions a combined game entry covers. A run can pick one (stored as its game's `version`),
// and the Pokémon selector then offers only what that version's encounter tables hold.
export const GAME_VERSIONS: { [gameKey: string]: TVersion[] } = {
  '1': ['red', 'blue', 'yellow'],
  '3': ['ruby', 'sapphire', 'emerald'],
  '5': ['diamond', 'pearl', 'platinum'],
};

// constants/exclusives' shape. The table is its own chunk (hooks/useExclusives loads it once a run
// has a version), so the main bundle stays inside the Lighthouse script budget
export type TExclusives = { [filterKey: string]: { [pokemon: string]: TVersion[] } };

// Whether a Pokémon in a location's encounter table appears in the chosen version. Without a
// version (every save from before versions existed), or for a Pokémon that isn't tagged, it does.
export function inVersion(
  exclusives: TExclusives | null,
  filterKey: string,
  pokemon: string,
  version?: TVersion
): boolean {
  const versions = version && exclusives?.[filterKey]?.[pokemon];
  return !versions || versions.includes(version);
}
