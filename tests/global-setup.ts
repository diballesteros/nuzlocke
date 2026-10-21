import fs from 'node:fs';
import path from 'node:path';

// Coverage from an earlier run would otherwise be merged into this one's report
export default function globalSetup() {
  fs.rmSync(path.join('coverage', 'playwright'), { recursive: true, force: true });
}
