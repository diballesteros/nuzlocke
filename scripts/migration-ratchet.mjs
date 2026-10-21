// Counts what the UI migration is removing and fails if any count goes up. The recorded counts in
// verification/ratchet.json can only go down: lower them in the PR that removes usages.
//   node scripts/migration-ratchet.mjs            check (and print progress)
//   node scripts/migration-ratchet.mjs --update   write the current counts (only if not higher)
import fs from 'node:fs';
import path from 'node:path';

const FILE = 'verification/ratchet.json';

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
const files = walk('src').filter((file) => !/\.test\.tsx?$/.test(file));
const read = (file) => fs.readFileSync(file, 'utf8');
const code = files.filter((file) => /\.tsx?$/.test(file));
const styles = files.filter((file) => /\.s?css$/.test(file) && !/(pokemon|item)\.css$/.test(file));

const counts = {
  // Files importing Semantic UI React components
  semanticFiles: code.filter((file) => /from 'semantic-ui-react/.test(read(file))).length,
  // Sass files (modules and partials)
  scssFiles: files.filter((file) => file.endsWith('.scss')).length,
  // Hard-coded hex colours in styles and components (tokens should replace them)
  hexColours: [...styles, ...code].reduce(
    (sum, file) => sum + (read(file).match(/#[0-9a-fA-F]{3,8}\b(?![-\w])/g) ?? []).length,
    0
  ),
};

const recorded = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, 'utf8')) : {};
const rows = Object.entries(counts).map(([key, now]) => ({ key, before: recorded[key], now }));
rows.forEach(({ key, before, now }) =>
  console.info(
    `${key}: ${before ?? '—'} → ${now}${before !== undefined && now < before ? ' ↓' : ''}`
  )
);

if (process.argv.includes('--update')) {
  const raised = rows.filter(({ before, now }) => before !== undefined && now > before);
  if (raised.length) {
    console.error(`Refusing to raise: ${raised.map(({ key }) => key).join(', ')}`);
    process.exit(1);
  }
  fs.writeFileSync(FILE, `${JSON.stringify(counts, null, 2)}\n`);
  process.exit(0);
}

const worse = rows.filter(({ before, now }) => before !== undefined && now > before);
worse.forEach(({ key, before, now }) =>
  console.error(`✗ ${key} went up from ${before} to ${now}. New code must not add these.`)
);
const stale = rows.filter(({ before, now }) => before !== undefined && now < before);
stale.forEach(({ key, now }) =>
  console.error(`✗ ${key} dropped to ${now}: run node scripts/migration-ratchet.mjs --update`)
);
process.exit(worse.length || stale.length ? 1 : 0);
