import { useEffect, useState } from 'react';

// A module's default export loaded on first use, in a chunk of its own, for data the main bundle
// can't hold (the Lighthouse script budget). Every caller shares one request; until it lands, the
// hook returns null
export type TLazy<T> = { load: () => Promise<{ default: T }>; data?: T; loading?: Promise<T> };

export function lazyData<T>(load: () => Promise<{ default: T }>): TLazy<T> {
  return { load };
}

export default function useLazy<T>(lazy: TLazy<T>, active = true): T | null {
  const [data, setData] = useState<T | null>(lazy.data ?? null);

  useEffect(() => {
    if (!active || data) return undefined;
    let current = true;
    lazy.loading ??= lazy.load().then((module) => {
      lazy.data = module.default;
      return module.default;
    });
    lazy.loading.then((loaded) => current && setData(loaded));
    return () => {
      current = false;
    };
  }, [active, data, lazy]);

  return data;
}
