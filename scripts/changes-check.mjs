// Warns, without failing, when a PR changes the app but adds no change file to .changes/ (see
// .changes/README.md). Many changes need none, so it's a reminder, not a gate.
//   node scripts/changes-check.mjs --base origin/master [--markdown changes.md]
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};
const base = option('--base') ?? 'origin/master';
const markdown = option('--markdown');

const diff = (filter) =>
  execFileSync('git', ['diff', '--name-only', `--diff-filter=${filter}`, `${base}...HEAD`], {
    encoding: 'utf8',
  })
    .split('\n')
    .filter(Boolean);

// What users can notice: app code and data, its locales, and public assets, but not tests
const appFiles = diff('ACMRD').filter(
  (name) =>
    /^(src|public)\//.test(name) && !/\.test\.[jt]sx?$/.test(name) && name !== 'src/setupTests.ts'
);
const changeFiles = diff('AM').filter(
  (name) => /^\.changes\/[^/]+\.md$/.test(name) && name !== '.changes/README.md'
);

let message = '';
if (appFiles.length && !changeFiles.length) {
  message =
    `This PR changes ${appFiles.length} app file(s) but adds no change file to .changes/. ` +
    'If users can notice the change, add one (see .changes/README.md).';
  console.info(`::warning title=No change file::${message}`);
} else if (changeFiles.length) {
  console.info(`Change files: ${changeFiles.join(', ')}`);
} else {
  console.info('No app files changed.');
}
if (markdown) writeFileSync(markdown, message ? `**Change file:** ${message}\n` : '');
