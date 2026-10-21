import { defineConfig, devices, type Project } from '@playwright/test';

// Port 3001 so a Cypress run (dev:cov on 3000) or the control CLI (3100) can go on at the same time
const PORT = Number(process.env.E2E_PORT ?? 3001);
// Cypress's default viewport. Layout breakpoints sit near 1005px, so keep tests on this side of them
const viewport = { width: 1000, height: 660 };
const chrome = { ...devices['Desktop Chrome'], viewport };

// Dark system theme, like the Cypress runs (their Chrome followed the OS theme): the app turns
// on dark mode from it on first visit. Tests about the light theme opt out
const e2e = (name: string, device: string): Project => ({
  name,
  testDir: 'tests/e2e',
  use: { ...devices[device], viewport, colorScheme: 'dark' },
});

export default defineConfig({
  testDir: 'tests',
  globalSetup: './tests/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    // The dev PWA service worker would serve pages around Playwright's init scripts and coverage
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    e2e('chromium', 'Desktop Chrome'),
    e2e('firefox', 'Desktop Firefox'),
    e2e('webkit', 'Desktop Safari'),
    {
      // Persisted-store goldens: must stay byte-identical through UI migrations
      name: 'state',
      testDir: 'tests/state',
      snapshotPathTemplate: '{testDir}/__goldens__/{arg}{ext}',
      use: { ...chrome, timezoneId: 'UTC', locale: 'en-US' },
    },
    // Only with SEEDS=1 (npm run seeds), so a normal run never rewrites the seeds
    ...(process.env.SEEDS
      ? [{ name: 'seeds', testDir: 'tests/seeds', use: { ...chrome, timezoneId: 'UTC' } }]
      : []),
  ],
  webServer: {
    // Istanbul-instrumented and without HMR, like dev:cov, so runs report e2e coverage
    command: `cross-env CYPRESS_COVERAGE=true vite --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
