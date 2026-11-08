// The offline app's service worker, built by vite-plugin-pwa. The plugin's own registerSW.js left the
// register() promise unhandled, so every failed registration (a network abort while fetching sw.js,
// a browser or extension that refuses it) reached Sentry as an unhandled rejection. The app works
// without the worker, so a failure is only logged. Production builds only: the dev server serves
// no worker.
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener(
    'load',
    () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((error: unknown) => {
        console.warn('Service worker registration failed', error);
      });
    },
    { once: true }
  );
}
