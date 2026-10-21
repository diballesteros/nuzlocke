import fs from 'node:fs';
import path from 'node:path';
import { test as base, type Page } from '@playwright/test';
import libCoverage, { type CoverageMap } from 'istanbul-lib-coverage';

export { expect, type Page } from '@playwright/test';

// Raw (pre-remap) istanbul data, remapped and merged by scripts/coverage.mjs
const RAW_DIR = path.join('coverage', 'playwright', 'raw');

const collect = async (page: Page, map: CoverageMap) => {
  const data = await page
    .evaluate((): object | null => (window as { __coverage__?: object }).__coverage__ ?? null)
    .catch((): null => null);
  if (data) map.merge(data as libCoverage.CoverageMapData);
};

export const test = base.extend<object, { coverageMap: CoverageMap }>({
  // One file per worker, so runs don't write a full coverage map per test
  coverageMap: [
    async ({}, use, workerInfo) => {
      const map = libCoverage.createCoverageMap({});
      await use(map);
      if (!map.files().length) return;
      fs.mkdirSync(RAW_DIR, { recursive: true });
      const file = `${workerInfo.project.name}-${workerInfo.workerIndex}.json`;
      fs.writeFileSync(path.join(RAW_DIR, file), JSON.stringify(map.toJSON()));
    },
    { scope: 'worker' },
  ],
  page: async ({ page, coverageMap }, use) => {
    // A full navigation replaces window.__coverage__, so save it first
    const goto = page.goto.bind(page);
    page.goto = async (...args) => {
      await collect(page, coverageMap);
      return goto(...args);
    };
    await use(page);
    await collect(page, coverageMap);
  },
});
