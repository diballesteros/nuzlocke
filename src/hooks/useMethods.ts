import type { TMethods } from 'constants/versions';
import useLazy, { lazyData } from 'hooks/useLazy';

const METHODS = lazyData<TMethods>(() => import('constants/methods'));

// How each table entry is met when it isn't a plain wild encounter (constants/methods), loaded by
// the tracker's rows like the tables. Until it lands, the selector shows no method labels
export default function useMethods(): TMethods | null {
  return useLazy(METHODS);
}
