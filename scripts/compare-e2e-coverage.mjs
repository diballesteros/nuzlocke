// Temporary, deleted with Cypress: proves the Playwright port covers at least what Cypress did.
// Compares covered statements, branches and functions per file (coverage/e2e vs
// coverage/playwright) and fails when Playwright misses anything Cypress hit.
import { findSources, mergeSources } from './coverage-lib.mjs';

const covered = (counts) =>
  new Set(
    Object.entries(counts).flatMap(([id, hits]) =>
      Array.isArray(hits) ? hits.flatMap((h, i) => (h ? [`${id}.${i}`] : [])) : hits ? [id] : []
    )
  );

const [cypress, playwright] = await Promise.all(
  [['e2e'], ['playwright']].map(async (dirs) => {
    const sources = findSources(dirs);
    if (!sources.length) throw new Error(`No coverage in coverage/${dirs[0]}`);
    return mergeSources(sources);
  })
);

const missing = [];
for (const file of cypress.files()) {
  const before = cypress.fileCoverageFor(file).data;
  const after = playwright.files().includes(file) ? playwright.fileCoverageFor(file).data : null;
  for (const [kind, key] of [
    ['statement', 's'],
    ['branch', 'b'],
    ['function', 'f'],
  ]) {
    const hitAfter = after ? covered(after[key]) : new Set();
    for (const id of covered(before[key])) {
      if (!hitAfter.has(id)) missing.push(`${file.replace(/^.*\/src\//, 'src/')} ${kind} ${id}`);
    }
  }
}

const pct = (map) => map.getCoverageSummary().toJSON();
for (const [name, map] of [
  ['cypress', cypress],
  ['playwright', playwright],
]) {
  const { statements, branches, functions } = pct(map);
  console.info(
    `${name}: statements ${statements.pct}%, branches ${branches.pct}%, functions ${functions.pct}%`
  );
}
if (missing.length) {
  console.error(`Covered by Cypress but not by Playwright (${missing.length}):`);
  missing.forEach((line) => console.error(`  ${line}`));
  process.exit(1);
}
console.info('Playwright covers everything Cypress covers.');
