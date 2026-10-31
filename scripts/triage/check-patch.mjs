// Refuses a drafted fix that touches anything outside src/ and tests/e2e/. Runs from master's
// checkout, before the patch is applied, in the job that holds the write token.
//   node scripts/triage/check-patch.mjs <fix.patch>
import fs from 'node:fs';

import { patchProblems } from './lib.mjs';

const problems = patchProblems(fs.readFileSync(process.argv[2], 'utf8'));
if (problems.length) {
  problems.forEach((problem) => console.error(problem));
  process.exit(1);
}
console.info('The patch only touches allowed paths.');
