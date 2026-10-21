// Runs the visual/ARIA/a11y suite (tests/visual) inside the pinned Playwright Docker image, so
// screenshots match CI whatever the host OS. Extra arguments go to `playwright test`:
//   npm run verify:visual                                  compare against the baselines
//   npm run verify:visual -- --grep @tracker               one area
//   npm run verify:visual -- --grep-invert "@tracker"      everything except the areas you touched
//   npm run verify:visual -- --update-snapshots            rewrite baselines (log them first)
// The container gets a copy of the repo's tracked and unignored files (never the host's
// node_modules, whose native binaries are Windows-only). Baselines come back only when updating;
// the HTML report always lands in verification/artifacts/visual.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const update = args.some((arg) => arg.startsWith('--update-snapshots') || arg === '-u');
const { version } = JSON.parse(
  fs.readFileSync(path.join('node_modules', '@playwright', 'test', 'package.json'), 'utf8')
);
const image = `mcr.microsoft.com/playwright:v${version}-noble`;

// Copied with Node rather than tar: Git Bash's GNU tar reads "C:" in a path as a remote host
const work = fs.mkdtempSync(path.join(os.tmpdir(), 'nuzlocke-visual-'));
execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
  .toString()
  .split('\0')
  .filter((file) => file && fs.existsSync(file))
  .forEach((file) => fs.cpSync(file, path.join(work, 'src', file)));

const report = path.resolve('verification', 'artifacts', 'visual');
const baselines = path.resolve('tests', 'visual', '__baselines__');
fs.rmSync(report, { recursive: true, force: true });
fs.mkdirSync(report, { recursive: true });
fs.mkdirSync(baselines, { recursive: true });

const quoted = args.map((arg) => `'${arg.replace(/'/g, `'\\''`)}'`).join(' ');
const script = [
  'set -e',
  'cp -r /in/src /work && cd /work',
  'npm ci --no-audit --no-fund --loglevel=error',
  'status=0',
  `VISUAL=1 npx playwright test --project=visual --reporter=list,html ${quoted} || status=$?`,
  'cp -r playwright-report test-results /out/report/ 2>/dev/null || true',
  update ? 'cp -r tests/visual/__baselines__/. /out/baselines/' : 'true',
  'exit $status',
].join('\n');

const result = spawnSync(
  'docker',
  [
    'run',
    '--rm',
    '--ipc=host',
    '-e',
    'CI=1',
    '-e',
    'CYPRESS_INSTALL_BINARY=0',
    '-v',
    `${work}:/in:ro`,
    '-v',
    `${report}:/out/report`,
    '-v',
    `${baselines}:/out/baselines`,
    // Reused npm cache, so repeat runs install quickly
    '-v',
    'nuzlocke-npm-cache:/root/.npm',
    image,
    'bash',
    '-c',
    script,
  ],
  { stdio: 'inherit' }
);
fs.rmSync(work, { recursive: true, force: true });
console.info(`HTML report: ${path.join(report, 'playwright-report', 'index.html')}`);
process.exit(result.status ?? 1);
