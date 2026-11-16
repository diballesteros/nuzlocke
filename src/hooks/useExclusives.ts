import type { TExclusives } from 'constants/versions';
import useLazy, { lazyData } from 'hooks/useLazy';

const EXCLUSIVES = lazyData<TExclusives>(() => import('constants/exclusives'));

// The version tags (constants/exclusives), loaded on first use: only a run with a version needs
// them. Until they land, nothing is filtered by version
export default function useExclusives(active: boolean): TExclusives | null {
  return useLazy(EXCLUSIVES, active);
}
