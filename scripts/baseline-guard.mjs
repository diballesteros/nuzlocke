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
// Adding a pin (a new journey or state) is ordinary review material; what's guarded is editing or
// deleting an existing one
const edited = git('diff', '--name-only', '--diff-filter=MDR', `${base}...HEAD`)
  .split('\n')
  .filter(Boolean);
const errors = [];

const goldens = edited.filter((file) => file.startsWith('tests/state/__goldens__/'));
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
// Every area a baseline's state renders, read from the visual suite's tags (the same ones CI's
// --grep-invert uses): a dialog over the tracker is a tracker state too
const stateAreas = () => {
  const cli = path.join('node_modules', '@playwright', 'test', 'cli.js');
  const list = JSON.parse(
    execFileSync(process.execPath, [cli, 'test', '--project=visual', '--list', '--reporter=json'], {
      env: { ...process.env, VISUAL: '1' },
      maxBuffer: 64 * 1024 * 1024,
    }).toString()
  );
  const areas = new Map();
  const visit = (suite) => {
    suite.suites?.forEach(visit);
    for (const spec of suite.specs ?? []) {
      // Baselines are named <owner area>-<state>-<viewport>[-<theme>]; the owner is one of the tags
      const state = suite.title.replace(' ', '-');
      for (const owner of spec.tags) {
        areas.set(`${owner}-${state}-${spec.title}`, spec.tags);
        areas.set(`${owner}-${state}`, spec.tags);
      }
    }
  };
  list.suites.forEach(visit);
  return areas;
};
const changedBaselines = edited.filter((f) => f.startsWith(BASELINES));
const areasOf = changedBaselines.length ? stateAreas() : new Map();

for (const file of changedBaselines) {
  const name = path.posix.basename(file);
  const stem = name.replace(/(-a11y\.json|\.aria\.yml|\.png)$/, '');
  const renders = areasOf.get(stem) ?? [name.split('-')[0]];
  if (!affected.all && !renders.some((area) => affected.areas.includes(area))) {
    errors.push(
      `${file} changed, but its state renders ${renders.join(', ')} and this PR touches ` +
        `${affected.areas.join(', ') || 'none'}. Untouched areas must not change; never update ` +
        'their baselines to make a diff pass.'
    );
  }
  if (fs.existsSync(file) && !approved.some((pattern) => pattern.test(name))) {
    errors.push(`${file} changed without a row in verification/approved-diffs.tsv.`);
  }
}

// This script itself is left out (its patterns would match) and is covered by CODEOWNERS instead
const HARNESS =
  /^(tests\/|playwright\.config\.ts$|verification\/|scripts\/(visual|affected-areas)\.mjs$)/;
// Any non-zero screenshot threshold loosens the comparison; `threshold: 0` is the standard
const LOOSENING =
  /\b(test|describe)\.(skip|only|fixme)\b|\bmask\s*:|maxDiffPixel|threshold\s*:\s*(0?\.\d*[1-9]|[1-9])/;
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
  `Baseline guard passed: ${goldens.length} golden(s) and ${changedBaselines.length} baseline(s) ` +
    `edited, ${changed.filter((f) => f.startsWith(BASELINES)).length - changedBaselines.length} added.`
);
