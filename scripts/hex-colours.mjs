// Counts hard-coded hex colours in src and fails if the count changes. New colours belong in the
// design tokens (src/styles/globals.css), so the recorded count in verification/hex-colours.json can
// only go down: lower it in the PR that replaces a colour with a token.
//   node scripts/hex-colours.mjs            check (prints only on failure)
//   node scripts/hex-colours.mjs --update   write the current count (only if not higher)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(fileURLToPath(import.meta.url), '../..');
const FILE = path.join(ROOT, 'verification/hex-colours.json');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

// Components and styles outside the tests. Sprite sheets are generated, and globals.css is the token
// source, where colours belong.
export const counted = (file) =>
  /\.tsx?$/.test(file)
    ? !/\.test\.tsx?$/.test(file)
    : /\.css$/.test(file) && !/((pokemon|item)\.css|styles[\\/]globals\.css)$/.test(file);

export const HEX = /#[0-9a-fA-F]{3,8}\b(?![-\w])/g;

export const countHexColours = (dir = path.join(ROOT, 'src')) =>
  walk(dir)
    .filter(counted)
    .reduce((sum, file) => sum + (fs.readFileSync(file, 'utf8').match(HEX) ?? []).length, 0);

export const recorded = () => JSON.parse(fs.readFileSync(FILE, 'utf8')).hexColours;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const before = recorded();
  const now = countHexColours();
  if (process.argv.includes('--update')) {
    if (now > before) {
      console.error(`Refusing to raise the hex colour count from ${before} to ${now}`);
      process.exit(1);
    }
    fs.writeFileSync(FILE, `${JSON.stringify({ hexColours: now }, null, 2)}\n`);
    console.info(`hexColours: ${before} → ${now}`);
  } else if (now > before) {
    console.error(
      `✗ Hard-coded hex colours went up from ${before} to ${now}. Use a token from src/styles/globals.css.`
    );
    process.exit(1);
  } else if (now < before) {
    console.error(`✗ Hex colours dropped to ${now}: run node scripts/hex-colours.mjs --update`);
    process.exit(1);
  }
}
