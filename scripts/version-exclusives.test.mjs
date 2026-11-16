import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { render } from './version-exclusives.mjs';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');

describe('version-exclusives', () => {
  test('renders the tags as exclusives.ts', () => {
    const source = render({ 'rby-6': { Weedle: ['red', 'blue'] } });
    expect(source).toContain(
      `const EXCLUSIVES: TExclusives = {"rby-6":{"Weedle":["red","blue"]}};`
    );
    expect(source).toContain("import type { TExclusives } from 'constants/versions';");
  });

  test('exclusives.ts holds the saved result’s tags', async () => {
    const { tags } = JSON.parse(
      readFileSync(join(ROOT, 'scripts/version-exclusives.json'), 'utf8')
    );
    const { default: EXCLUSIVES } = await import('../src/constants/exclusives.ts');
    expect(EXCLUSIVES).toEqual(tags);
  });
});
