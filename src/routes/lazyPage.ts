import { createElement, use } from 'react';
import type { ComponentType } from 'react';

export type LazyPage<P extends object> = ComponentType<P> & {
  preload: () => Promise<ComponentType<P>>;
};

// A page in a chunk of its own. Unlike React.lazy, a page whose chunk is already in renders on its
// first try: the promise carries React's own status fields, so use() reads it without suspending.
// index.tsx preloads the current route's page before the first render, so the first paint has the
// page in it, as it did when every page was in the main bundle. Later navigations are transitions
// (react-router's default), so the old page stays up until the new one has loaded. A failed load
// throws to the route's error boundary and is tried again on the next render
export default function lazyPage<P extends object>(
  load: () => Promise<{ default: ComponentType<P> }>
): LazyPage<P> {
  let loading: Promise<ComponentType<P>> | undefined;

  function preload(): Promise<ComponentType<P>> {
    if (!loading) {
      // A stale chunk resolves with nothing while the page reloads (lib/staleChunks): wait for it
      const current = load().then(
        (module) => module?.default ?? new Promise<ComponentType<P>>(() => {})
      );
      current.then(
        (page) => Object.assign(current, { status: 'fulfilled', value: page }),
        (error: unknown) => {
          Object.assign(current, { status: 'rejected', reason: error });
          if (loading === current) loading = undefined;
        }
      );
      loading = current;
    }
    return loading;
  }

  function Page(props: P) {
    return createElement(use(preload()), props);
  }
  Page.preload = preload;
  return Page;
}
