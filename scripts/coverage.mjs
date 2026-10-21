// Merges Vitest (coverage/unit) and e2e (coverage/e2e, coverage/playwright) coverage into
// coverage/merged and fails when the combined numbers drop below THRESHOLDS.
import fs from 'node:fs';
import path from 'node:path';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import { findSources, mergeSources, OUT_DIR } from './coverage-lib.mjs';

// Ratchet: raise these to the latest achieved numbers (rounded down), never lower them
const THRESHOLDS = { lines: 99, statements: 99, functions: 99, branches: 93 };

const SOURCES = findSources();
if (!SOURCES.length) {
  console.error('No coverage found. Run test:unit:cov and the e2e suite first.');
  process.exit(1);
}
console.info(`Merging ${SOURCES.join(', ')}`);

let map;
try {
  map = await mergeSources(SOURCES);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'coverage-final.json'), JSON.stringify(map.toJSON()));

const context = libReport.createContext({ dir: OUT_DIR, coverageMap: map });
['html', 'lcovonly', 'json-summary', 'text-summary'].forEach((name) =>
  reports.create(name).execute(context)
);

const summary = map.getCoverageSummary();
const failures = Object.entries(THRESHOLDS).filter(
  ([metric, minimum]) => summary[metric].pct < minimum
);
failures.forEach(([metric, minimum]) =>
  console.error(`Coverage for ${metric} (${summary[metric].pct}%) is below ${minimum}%`)
);
process.exit(failures.length ? 1 : 0);
