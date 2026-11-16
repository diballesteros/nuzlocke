// Cuts a release from the change files in .changes/:
//   npm run release -- <major|minor|patch|X.Y.Z> [--dry-run]
// Bumps the version in package.json and package-lock.json, adds the release to the top of
// src/constants/releases.json (the in-app changelog, dated now) and CHANGELOG.md, and deletes the
// change files. --dry-run prints what it would write and changes nothing.
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { appRelease, markdownSection, nextVersion, parseChange } from './release-lib.mjs';

const root = path.resolve(import.meta.dirname, '..');
const file = (name) => path.join(root, name);
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bump = args.find((arg) => !arg.startsWith('--'));

function fail(message) {
  console.error(`release: ${message}`);
  process.exit(1);
}

if (!bump) fail('usage: npm run release -- <major|minor|patch|X.Y.Z> [--dry-run]');

const changeFiles = readdirSync(file('.changes'))
  .filter((name) => name.endsWith('.md') && name !== 'README.md')
  .sort();
if (!changeFiles.length) fail('no change files in .changes/');

let notes;
let version;
try {
  notes = changeFiles.flatMap((name) =>
    parseChange(readFileSync(file(`.changes/${name}`), 'utf8'), `.changes/${name}`)
  );
  const pkg = JSON.parse(readFileSync(file('package.json'), 'utf8'));
  version = nextVersion(pkg.version, bump);
} catch (error) {
  fail(error.message);
}

const release = appRelease(version, Date.now(), notes);
if (!release.notes.length) {
  fail('every change is internal, so the app would show an empty release');
}
const section = markdownSection(version, notes);
const releases = JSON.parse(readFileSync(file('src/constants/releases.json'), 'utf8'));
if (releases.some((entry) => entry.name === release.name)) {
  fail(`src/constants/releases.json already has ${release.name}`);
}

if (dryRun) {
  console.info(JSON.stringify(release, null, 2));
  console.info(`\n${section}`);
  process.exit(0);
}

// Replace only the version fields, so the files' formatting stays the same
const setVersion = (name, pattern) => {
  const text = readFileSync(file(name), 'utf8');
  const updated = text.replace(pattern, `$1${version}$2`);
  if (updated === text) fail(`couldn't find the version in ${name}`);
  writeFileSync(file(name), updated);
};
setVersion('package.json', /^(\s{2}"version": ")[^"]+(",)$/m);
// The lockfile's own version, and its root package's (the first entry in "packages")
const lock = JSON.parse(readFileSync(file('package-lock.json'), 'utf8'));
lock.version = version;
lock.packages[''].version = version;
writeFileSync(file('package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);

writeFileSync(
  file('src/constants/releases.json'),
  `${JSON.stringify([release, ...releases], null, 2)}\n`
);
writeFileSync(file('CHANGELOG.md'), `${section}\n${readFileSync(file('CHANGELOG.md'), 'utf8')}`);
for (const name of changeFiles) rmSync(file(`.changes/${name}`));

console.info(`Released ${version} from ${changeFiles.length} change file(s).`);
console.info(`Review the diff, then commit it as: feat(${version}): <description>`);
