// A tab opened before a deploy still runs the old build. The service worker updates itself and
// deletes the old build's cache, and Netlify answers the old chunk names with index.html, so the
// tab's next lazy page or data chunk fails to load. Vite reports that as vite:preloadError; a
// reload brings the new build, where the chunk exists. One reload per 10 seconds, so a chunk that
// fails for another reason (offline before the worker cached it) shows its error instead of
// reloading forever. Without sessionStorage there's no way to tell, so nothing reloads.
const KEY = 'stale-chunk-reload';
const WINDOW_MS = 10_000;

export function reloadOnStaleChunk(reload = (): void => window.location.reload()): void {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const last = Number(sessionStorage.getItem(KEY)) || 0;
      if (Date.now() - last < WINDOW_MS) return;
      sessionStorage.setItem(KEY, String(Date.now()));
    } catch {
      return;
    }
    // Vite then resolves the import with undefined instead of throwing (lazyPage and useLazy wait)
    event.preventDefault();
    reload();
  });
}
