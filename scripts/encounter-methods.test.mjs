import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { render } from './encounter-methods.mjs';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');

describe('encounter-methods', () => {
  test('renders the tags as methods.ts', () => {
    const source = render({ 'rby-11': { Bulbasaur: ['gift'] } });
    expect(source).toContain(`const METHODS: TMethods = {"rby-11":{"Bulbasaur":["gift"]}};`);
    expect(source).toContain("import type { TMethods } from 'constants/versions';");
  });

  test('methods.ts holds the saved result’s tags', async () => {
    const { tags } = JSON.parse(readFileSync(join(ROOT, 'scripts/encounter-methods.json'), 'utf8'));
    const { default: METHODS } = await import('../src/constants/methods.ts');
    expect(METHODS).toEqual(tags);
  });
});
