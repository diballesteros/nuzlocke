// Shared by coverage.mjs (merge + thresholds) and compare-e2e-coverage.mjs
import fs from 'node:fs';
import path from 'node:path';
import * as vitestCoverage from '@vitest/istanbul-lib-coverage';
import * as vitestSourceMaps from '@vitest/istanbul-lib-source-maps';
import libCoverage from 'istanbul-lib-coverage';

export const OUT_DIR = 'coverage/merged';

// Vitest writes remapped coverage-final.json. Every other JSON file is raw (pre-remap) e2e data:
// Playwright's raw/<project>-<worker>.json, or those files at the root of a CI artifact folder.
// Raw data is remapped with Vitest's remapper: nyc's older remapper drops JSX return statements
// compiled by Oxc (Vite 8), so its locations would not line up with Vitest's.
const isRemapped = (file) => path.basename(file) === 'coverage-final.json';

const jsonFiles = (dir) =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir)
        .filter((name) => name.endsWith('.json'))
        .map((name) => path.join(dir, name))
    : [];

// One folder per source under coverage/: unit and playwright locally; one per artifact in CI
export const findSources = (dirs) => {
  if (!fs.existsSync('coverage')) return [];
  return (dirs ?? fs.readdirSync('coverage').filter((dir) => dir !== path.basename(OUT_DIR)))
    .map((dir) => path.join('coverage', dir))
    .flatMap((dir) => {
      const raw = jsonFiles(path.join(dir, 'raw'));
      return raw.length ? raw : jsonFiles(dir).filter((file) => !file.endsWith('-summary.json'));
    });
};

const readCoverage = async (source) => {
  const data = JSON.parse(fs.readFileSync(source, 'utf8'));
  if (isRemapped(source)) return data;
  const remapped = await vitestSourceMaps
    .createSourceMapStore()
    .transformCoverage(vitestCoverage.createCoverageMap(data));
  // JSON round trip turns unknown end columns (Infinity) into null, as in Vitest's report
  return JSON.parse(JSON.stringify(remapped.toJSON()));
};

// Vitest and the Vite istanbul plugin may key the same file differently on Windows
export const normalize = (file) => {
  const resolved = path.resolve(file).replace(/\\/g, '/');
  return resolved.replace(/^[a-z]:/, (drive) => drive.toUpperCase());
};

export const mergeSources = async (sources) => {
  const map = libCoverage.createCoverageMap({});
  for (const source of sources) {
    const data = await readCoverage(source);
    // An empty report means the app wasn't instrumented (e.g. tests hit a plain dev server)
    if (!Object.keys(data).length) {
      throw new Error(`${source} has no files. Was the app served by npm run dev:cov?`);
    }
    Object.values(data).forEach((fileCoverage) => {
      const file = normalize(fileCoverage.path);
      map.merge({ [file]: { ...fileCoverage, path: file } });
    });
  }
  return map;
};
