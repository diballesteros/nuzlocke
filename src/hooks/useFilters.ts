import useLazy, { lazyData } from 'hooks/useLazy';

type TFilters = { [key in string]: string[] };

const FILTERS = lazyData<TFilters>(() => import('constants/filters'));

// The encounter tables (constants/filters), in a chunk of their own: they are the largest piece of
// game data, and only the tracker's rows read them. The first row asks for them, so they are in
// long before a selector opens; until then a location's list holds only its own Pokémon
export default function useFilters(): TFilters | null {
  return useLazy(FILTERS);
}
