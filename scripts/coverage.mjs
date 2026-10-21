// Merges Vitest (coverage/unit) and Cypress (coverage/e2e) coverage into coverage/merged
// and fails when the combined numbers drop below THRESHOLDS.
import fs from 'node:fs';
import path from 'node:path';
import * as vitestCoverage from '@vitest/istanbul-lib-coverage';
import * as vitestSourceMaps from '@vitest/istanbul-lib-source-maps';
import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';

// Ratchet: raise these to the latest achieved numbers (rounded down), never lower them
const THRESHOLDS = { lines: 99, statements: 99, functions: 99, branches: 93 };

const OUT_DIR = 'coverage/merged';
// coverage/unit and coverage/e2e locally; one folder per parallel e2e container in CI.
// Vitest writes remapped coverage-final.json. Cypress runs leave raw (pre-remap) data in raw/out.json,
// which is remapped here with Vitest's remapper: nyc's older remapper drops JSX return statements
// compiled by Oxc (Vite 8), so its locations would not line up with Vitest's.
const sourceFile = (dir) =>
  [
    path.join('coverage', dir, 'raw', 'out.json'),
    // CI artifacts hold the single uploaded file at their root
    path.join('coverage', dir, 'out.json'),
    path.join('coverage', dir, 'coverage-final.json'),
  ].find((file) => fs.existsSync(file));
const SOURCES = fs.existsSync('coverage')
  ? fs
      .readdirSync('coverage')
      .filter((dir) => dir !== path.basename(OUT_DIR))
      .map(sourceFile)
      .filter(Boolean)
  : [];

const readCoverage = async (source) => {
  const data = JSON.parse(fs.readFileSync(source, 'utf8'));
  if (path.basename(source) !== 'out.json') return data;
  const remapped = await vitestSourceMaps
    .createSourceMapStore()
    .transformCoverage(vitestCoverage.createCoverageMap(data));
  // JSON round trip turns unknown end columns (Infinity) into null, as in Vitest's report
  return JSON.parse(JSON.stringify(remapped.toJSON()));
};

// Vitest and the Vite istanbul plugin may key the same file differently on Windows
const normalize = (file) => {
  const resolved = path.resolve(file).replace(/\\/g, '/');
  return resolved.replace(/^[a-z]:/, (drive) => drive.toUpperCase());
};

const map = libCoverage.createCoverageMap({});
if (!SOURCES.length) {
  console.error('No coverage found. Run test:unit:cov and e2e:run first.');
  process.exit(1);
}
console.info(`Merging ${SOURCES.join(', ')}`);

for (const source of SOURCES) {
  const data = await readCoverage(source);
  // An empty report means the app wasn't instrumented (e.g. tests hit a plain dev server)
  if (!Object.keys(data).length) {
    console.error(`${source} has no files. Was the app served by npm run dev:cov?`);
    process.exit(1);
  }
  Object.values(data).forEach((fileCoverage) => {
    const file = normalize(fileCoverage.path);
    map.merge({ [file]: { ...fileCoverage, path: file } });
  });
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
