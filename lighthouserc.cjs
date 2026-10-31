// Lighthouse CI: npm run lighthouse (see CLAUDE.md). The numbers are a ratchet: raise the scores and
// lower the byte budgets as the app improves, never the other way round.
const { chromium } = require('playwright-core');

const PORT = process.env.LHCI_PORT ?? 4173;

// Measured on CI's runners: 3 CI runs of master at c76625a, 3 Lighthouse runs per route in each.
// GitHub's runners come in two speeds (benchmarkIndex about 2000 or 3800), which moves performance
// from about 0.53 to about 0.61, so its floor sits below the slower one. Scores measured elsewhere
// aren't comparable: simulated throttling still depends on the machine's speed and load.
const MIN_SCORES = { performance: 0.48, 'best-practices': 1, seo: 1, accessibility: 1 };
// Transfer sizes, as vite preview serves them (compressed), with about 15 KB of room for ordinary
// small changes. Total moves by 12 KB between runs with what loads in time (/about: 743–755 KB).
const MAX_BYTES = { script: 700_000, total: 770_000 };

// Every route in src/routes/sitemap.ts's SITEMAP_ROUTES, with its known failures:
// /rules: color-contrast (the blue Edit custom statuses button)
// /about: color-contrast (the data storage link), image-size-responsive (the Amazon badge)
const ROUTES = {
  '/': {},
  '/rules': { accessibility: 0.95 },
  '/stats': {},
  '/builder': {},
  '/calculator': {},
  '/changelog': {},
  '/about': { accessibility: 0.96, 'best-practices': 0.96 },
};

const median = { aggregationMethod: 'median-run' };

function assertions(overrides) {
  const scores = { ...MIN_SCORES, ...overrides };
  return {
    ...Object.fromEntries(
      Object.entries(scores).map(([category, minScore]) => [
        `categories:${category}`,
        ['error', { ...median, minScore }],
      ])
    ),
    ...Object.fromEntries(
      Object.entries(MAX_BYTES).map(([resource, maxNumericValue]) => [
        `resource-summary:${resource}:size`,
        ['error', { ...median, maxNumericValue }],
      ])
    ),
  };
}

module.exports = {
  ci: {
    collect: {
      startServerCommand: `npx vite preview --port ${PORT} --strictPort`,
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
      assertMatrix: Object.entries(ROUTES).map(([route, overrides]) => ({
        matchingUrlPattern: `:${PORT}${route}$`,
        assertions: assertions(overrides),
      })),
    },
    upload: { target: 'filesystem', outputDir: 'verification/artifacts/lighthouse' },
  },
};
