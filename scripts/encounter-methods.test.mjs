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

  test('every method in the tags has a label in each language', () => {
    const { tags } = JSON.parse(readFileSync(join(ROOT, 'scripts/encounter-methods.json'), 'utf8'));
    const used = new Set(Object.values(tags).flatMap((table) => Object.values(table).flat()));
    // The Bug-Catching Contest and the National Pokédex are among them (both added 2026-11-16)
    expect(used).toContain('contest');
    expect(used).toContain('nationaldex');
    for (const lang of ['en', 'es', 'de']) {
      const { methods } = JSON.parse(
        readFileSync(join(ROOT, `src/locale/${lang}/common.json`), 'utf8')
      );
      for (const method of used)
        expect([lang, methods[method]]).toEqual([lang, expect.any(String)]);
    }
  });
});
