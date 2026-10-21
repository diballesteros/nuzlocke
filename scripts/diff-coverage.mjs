// Coverage of the lines a branch changes: of the statements that start on a changed line in an
// instrumented src file, at least MINIMUM% must run in the merged unit + e2e coverage.
//   node scripts/diff-coverage.mjs --base origin/master   (after npm run coverage)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { normalize } from './coverage-lib.mjs';

const MINIMUM = 80;
const base = process.argv[process.argv.indexOf('--base') + 1];
const coverage = JSON.parse(fs.readFileSync('coverage/merged/coverage-final.json', 'utf8'));

// file -> changed (added or modified) line numbers
const changed = new Map();
let file = null;
const diff = execFileSync('git', ['diff', '-U0', `${base}...HEAD`, '--', 'src'], {
  maxBuffer: 64 * 1024 * 1024,
}).toString();
for (const line of diff.split('\n')) {
  if (line.startsWith('+++ ')) file = line === '+++ /dev/null' ? null : normalize(line.slice(6));
  const hunk = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/);
  if (hunk && file) {
    const [start, count] = [Number(hunk[1]), hunk[2] === undefined ? 1 : Number(hunk[2])];
    if (!changed.has(file)) changed.set(file, new Set());
    for (let n = start; n < start + count; n++) changed.get(file).add(n);
  }
}

let total = 0;
let covered = 0;
const missed = [];
for (const [path, lines] of changed) {
  const data = coverage[path];
  if (!data) continue; // not instrumented (tests, data tables, excluded files)
  for (const [id, location] of Object.entries(data.statementMap)) {
    if (!lines.has(location.start.line)) continue;
    total++;
    if (data.s[id] > 0) covered++;
    else missed.push(`${path.replace(/^.*\/src\//, 'src/')}:${location.start.line}`);
  }
}

if (!total) {
  console.info('No instrumented statements changed.');
  process.exit(0);
}
const pct = Math.round((covered / total) * 1000) / 10;
console.info(`Changed-line coverage: ${pct}% (${covered}/${total} statements)`);
if (pct < MINIMUM) {
  console.error(`Below ${MINIMUM}%. Uncovered changed statements:`);
  missed.forEach((location) => console.error(`  ${location}`));
  process.exit(1);
}
