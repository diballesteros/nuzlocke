import { useEffect, useState } from 'react';
import type { TExclusives } from 'constants/versions';

let loading: Promise<TExclusives> | null = null;
let loaded: TExclusives | null = null;

// The version tags (constants/exclusives), loaded on first use: only a run with a version needs
// them. Every row shares one request; until it lands, nothing is filtered by version
export default function useExclusives(active: boolean): TExclusives | null {
  const [exclusives, setExclusives] = useState(loaded);

  useEffect(() => {
    if (!active || exclusives) return undefined;
    let current = true;
    loading ??= import('constants/exclusives').then((module) => {
      loaded = module.default;
      return loaded;
    });
    loading.then((data) => current && setExclusives(data));
    return () => {
      current = false;
    };
  }, [active, exclusives]);

  return exclusives;
}
