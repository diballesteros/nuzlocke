// Gzipped size of the production bundle by asset, with content hashes stripped from the names.
//   node scripts/bundle-size.mjs --out sizes.json                    measure dist/
//   node scripts/bundle-size.mjs --compare base.json head.json [--markdown out.md]
// The comparison fails when the total grows by more than BUDGET_PERCENT.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const BUDGET_PERCENT = 5;
const args = process.argv.slice(2);
const option = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

if (option('--out')) {
  const sizes = {};
  for (const file of walk('dist').filter((f) => /\.(js|css)$/.test(f))) {
    const name = path.basename(file).replace(/-[\w-]{8}\.(js|css)$/, '.$1');
    sizes[name] = (sizes[name] ?? 0) + zlib.gzipSync(fs.readFileSync(file)).length;
  }
  fs.writeFileSync(option('--out'), `${JSON.stringify(sizes, null, 2)}\n`);
  process.exit(0);
}

const [baseFile, headFile] = args.slice(args.indexOf('--compare') + 1);
const [base, head] = [baseFile, headFile].map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;
const sum = (sizes) => Object.values(sizes).reduce((a, b) => a + b, 0);
const [before, after] = [sum(base), sum(head)];
const change = ((after - before) / before) * 100;

const rows = [...new Set([...Object.keys(base), ...Object.keys(head)])]
  .map((name) => ({ name, before: base[name] ?? 0, after: head[name] ?? 0 }))
  .filter(({ before: b, after: a }) => Math.abs(a - b) > 512)
  .sort((x, y) => Math.abs(y.after - y.before) - Math.abs(x.after - x.before));
const lines = [
  `**Bundle (gzip):** ${kb(before)} → ${kb(after)} (${change >= 0 ? '+' : ''}${change.toFixed(1)}%, budget +${BUDGET_PERCENT}%)`,
  '',
  ...(rows.length
    ? [
        '| Asset | Before | After |',
        '|---|---|---|',
        ...rows.map((r) => `| ${r.name} | ${kb(r.before)} | ${kb(r.after)} |`),
      ]
    : ['No asset changed by more than 0.5 kB.']),
  '',
];
console.info(lines.join('\n'));
if (option('--markdown')) fs.writeFileSync(option('--markdown'), lines.join('\n'));
if (change > BUDGET_PERCENT) {
  console.error(`Bundle grew ${change.toFixed(1)}%, over the ${BUDGET_PERCENT}% budget.`);
  process.exit(1);
}
