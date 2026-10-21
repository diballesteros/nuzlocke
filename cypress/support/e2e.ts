import '@cypress/code-coverage/support';
import './commands';

// The dev-mode PWA service worker serves pages without Cypress's injected scripts, so reloads skip
// window:before:load (stubs, coverage). Drop existing registrations and block new ones.
Cypress.on('window:before:load', (win) => {
  const sw = win.navigator.serviceWorker;
  if (!sw) return;
  sw.getRegistrations().then((registrations) => registrations.forEach((r) => r.unregister()));
  sw.register = () => new Promise<ServiceWorkerRegistration>(() => {});
});
