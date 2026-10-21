// Fails a PR that changes pins in ways a reviewer can't see or didn't approve:
// - state goldens (tests/state/__goldens__) change only with the state-change-approved label
//   (STATE_CHANGE_APPROVED=true), since a UI-only change must not alter stored data;
// - a visual baseline changes only for an area the PR touches (scripts/affected-areas.mjs), and
//   each changed baseline has a row in verification/approved-diffs.tsv;
// - harness files gain no new skip/only/fixme, masks or loosened screenshot tolerances.
//   node scripts/baseline-guard.mjs --base origin/master --areas areas.json
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const option = (name) => args[args.indexOf(name) + 1];
const base = option('--base');
const affected = JSON.parse(fs.readFileSync(option('--areas'), 'utf8'));

const git = (...gitArgs) =>
  execFileSync('git', gitArgs, { maxBuffer: 64 * 1024 * 1024 }).toString();
const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
const errors = [];

const goldens = changed.filter((file) => file.startsWith('tests/state/__goldens__/'));
if (goldens.length && process.env.STATE_CHANGE_APPROVED !== 'true') {
  errors.push(
    `State goldens changed (${goldens.join(', ')}). A UI change must not change stored data. ` +
      'If the behaviour change is intended, a maintainer adds the "state-change-approved" label.'
  );
}

const BASELINES = 'tests/visual/__baselines__/';
// Rows are "<baseline glob> TAB <commit> TAB <reason>"; the glob matches baseline file names, e.g.
// tracker-tracker-run-* covers that state's screenshots, ARIA and a11y files
const globToRegExp = (glob) =>
  new RegExp(`^${glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);
const approved = (
  fs.existsSync('verification/approved-diffs.tsv')
    ? fs.readFileSync('verification/approved-diffs.tsv', 'utf8').split('\n').slice(1)
    : []
)
  .map((row) => row.split('\t')[0].trim())
  .filter(Boolean)
  .map(globToRegExp);
for (const file of changed.filter((f) => f.startsWith(BASELINES))) {
  const name = path.posix.basename(file);
  const area = name.split('-')[0];
  if (!affected.all && !affected.areas.includes(area)) {
    errors.push(
      `${file} changed, but this PR touches no ${area} code (touched: ${affected.areas.join(', ') || 'none'}). ` +
        'Untouched areas must not change; never update their baselines to make a diff pass.'
    );
  }
  if (fs.existsSync(file) && !approved.some((pattern) => pattern.test(name))) {
    errors.push(`${file} changed without a row in verification/approved-diffs.tsv.`);
  }
}

const HARNESS =
  /^(tests\/|playwright\.config\.ts$|verification\/|scripts\/(visual|baseline-guard|affected-areas)\.mjs$)/;
const LOOSENING =
  /\b(test|describe)\.(skip|only|fixme)\b|\bmask\s*:|maxDiffPixel|threshold\s*:\s*(?!0\b)/;
for (const file of changed.filter((f) => HARNESS.test(f) && /\.(ts|mjs)$/.test(f))) {
  const added = git('diff', '-U0', `${base}...HEAD`, '--', file)
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'));
  for (const line of added.filter((l) => LOOSENING.test(l))) {
    errors.push(
      `${file} adds "${line.slice(1).trim()}": skipping tests or loosening comparisons needs a maintainer's review.`
    );
  }
}

if (errors.length) {
  errors.forEach((error) => console.error(`✗ ${error}`));
  process.exit(1);
}
console.info(
  `Baseline guard passed: ${goldens.length} golden(s), ` +
    `${changed.filter((f) => f.startsWith(BASELINES)).length} baseline(s) changed.`
);
