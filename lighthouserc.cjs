// Lighthouse CI: npm run lighthouse (see CLAUDE.md). Assertions are added once measured.
const { chromium } = require('playwright-core');

const ROUTES = ['/', '/rules', '/stats', '/builder', '/calculator', '/changelog', '/about'];
const PORT = process.env.LHCI_PORT ?? 4173;

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx vite preview --port ${PORT} --strictPort`,
      startServerReadyPattern: 'Local:',
      url: ROUTES.map((route) => `http://localhost:${PORT}${route}`),
      numberOfRuns: 3,
      chromePath: chromium.executablePath(),
      settings: {
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
      },
    },
    upload: { target: 'filesystem', outputDir: 'verification/artifacts/lighthouse' },
  },
};
