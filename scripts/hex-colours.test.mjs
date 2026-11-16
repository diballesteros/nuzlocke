import { describe, expect, test } from 'vitest';
import { counted, countHexColours, HEX, recorded } from './hex-colours.mjs';

describe('hex-colours', () => {
  test('matches colours, not ids or anchors', () => {
    const text = "color: #fff; fill: #1678c2; border: #12345678; href='#top' id='#a1-b' x=#abc-1";
    expect(text.match(HEX)).toEqual(['#fff', '#1678c2', '#12345678']);
  });

  test('counts components and styles, not tests, sprite sheets or the tokens', () => {
    expect(counted('src/components/Foo/Foo.tsx')).toBe(true);
    expect(counted('src/lib/foo.ts')).toBe(true);
    expect(counted('src/styles/other.css')).toBe(true);
    expect(counted('src/components/Foo/Foo.test.tsx')).toBe(false);
    expect(counted('src/styles/globals.css')).toBe(false);
    expect(counted('src/assets/pokemon.css')).toBe(false);
    expect(counted('src/assets/item.css')).toBe(false);
    expect(counted('src/locale/en/common.json')).toBe(false);
  });

  test('src holds the recorded number of hard-coded colours', () => {
    expect(countHexColours()).toBe(recorded());
  });
});
