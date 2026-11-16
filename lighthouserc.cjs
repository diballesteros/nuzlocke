// Lighthouse CI: npm run lighthouse (see CLAUDE.md). The numbers are a ratchet: raise the scores and
// lower the byte budgets as the app improves, never the other way round.
const { chromium } = require('playwright-core');

const PORT = process.env.LHCI_PORT ?? 4173;

// Measured on CI's runners: 3 CI runs of master at c76625a, 3 Lighthouse runs per route in each.
// GitHub's runners come in two speeds (benchmarkIndex about 2000 or 3800), which moves performance
// from about 0.53 to about 0.61, so its floor sits below the slower one. Scores measured elsewhere
// aren't comparable: simulated throttling still depends on the machine's speed and load.
const MIN_SCORES = { performance: 0.48, 'best-practices': 1, seo: 1, accessibility: 1 };
// Every route in src/routes/sitemap.ts's SITEMAP_ROUTES, with its known failures and its byte
// limits. The limits are transfer sizes as vite preview serves them (compressed): the median of a
// local run of the route-split build (each page in its own chunk, src/routes/pages.ts) plus about
// 15 KB of room for ordinary small changes, rounded up to 5 KB. Total moves by up to 12 KB between
// runs with what loads in time. Before the split every route loaded the whole app (about 680 KB of
// script) under one 700 KB limit. The tracker's script includes the encounter tables, methods and
// version tags its rows load.
const ROUTES = {
  '/': { bytes: { script: 525_000, total: 580_000 } },
  // color-contrast (the blue Edit custom statuses button)
  '/rules': { scores: { accessibility: 0.95 }, bytes: { script: 320_000, total: 380_000 } },
  '/stats': { bytes: { script: 500_000, total: 560_000 } },
  '/builder': { bytes: { script: 370_000, total: 425_000 } },
  '/calculator': { bytes: { script: 515_000, total: 570_000 } },
  '/changelog': { bytes: { script: 325_000, total: 380_000 } },
  // color-contrast (the data storage link), image-size-responsive (the Amazon badge)
  '/about': {
    scores: { accessibility: 0.96, 'best-practices': 0.96 },
    bytes: { script: 315_000, total: 390_000 },
  },
};

const median = { aggregationMethod: 'median-run' };

function assertions({ scores: overrides, bytes }) {
  const scores = { ...MIN_SCORES, ...overrides };
  return {
    ...Object.fromEntries(
      Object.entries(scores).map(([category, minScore]) => [
        `categories:${category}`,
        ['error', { ...median, minScore }],
      ])
    ),
    ...Object.fromEntries(
      Object.entries(bytes).map(([resource, maxNumericValue]) => [
        `resource-summary:${resource}:size`,
        ['error', { ...median, maxNumericValue }],
      ])
    ),
  };
}

module.exports = {
  ci: {
    collect: {
      startServerCommand: `node scripts/lighthouse-server.mjs ${PORT}`,
      startServerReadyPattern: 'Local:',
      url: Object.keys(ROUTES).map((route) => `http://localhost:${PORT}${route}`),
      numberOfRuns: 3,
      // The Chromium Playwright installed, so CI and a local run use the same browser
      chromePath: chromium.executablePath(),
      settings: {
        // Containers have no user namespaces for the sandbox and a small /dev/shm
        chromeFlags: '--headless=new --no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertMatrix: Object.entries(ROUTES).map(([route, limits]) => ({
        matchingUrlPattern: `:${PORT}${route}$`,
        assertions: assertions(limits),
      })),
    },
    upload: { target: 'filesystem', outputDir: 'verification/artifacts/lighthouse' },
  },
};
