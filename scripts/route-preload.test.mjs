// @vitest-environment node
import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';
import { preloadScript, readPages, routeChunks } from './route-preload.mjs';

const chunk = (fileName, imports = [], extra = {}) => ({
  type: 'chunk',
  fileName,
  imports,
  ...extra,
});

const BUNDLE = {
  'index.js': chunk('index.js', ['shared.js'], { isEntry: true }),
  'shared.js': chunk('shared.js'),
  'Tracker.js': chunk('Tracker.js', ['shared.js', 'data.js'], {
    facadeModuleId: '/repo/src/components/Tracker/Tracker.tsx',
  }),
  'data.js': chunk('data.js'),
  'BadgePage.js': chunk('BadgePage.js', ['shared.js'], {
    facadeModuleId: 'C:\\repo\\src\\components\\Badges\\elements\\BadgePage\\BadgePage.tsx',
  }),
  'style.css': { type: 'asset', fileName: 'style.css' },
};

const PAGES = [
  { route: '/', module: 'components/Tracker/Tracker' },
  { route: '/badgedetail/:game/:badge', module: 'components/Badges/elements/BadgePage/BadgePage' },
];

// Runs the inline script against a stand-in document and returns the links it added
function preloadsFor(pathname) {
  const links = [];
  const document = {
    createElement: () => ({}),
    head: { appendChild: (link) => links.push(link) },
  };
  vm.runInNewContext(preloadScript(routeChunks(BUNDLE, PAGES)), {
    document,
    location: { pathname },
  });
  return links;
}

describe('route preload', () => {
  it('reads every route and page module from pages.ts', () => {
    const pages = readPages(fs.readFileSync('src/routes/pages.ts', 'utf8'));
    expect(pages).toContainEqual({ route: '/', module: 'components/Tracker/Tracker' });
    expect(pages).toContainEqual({
      route: '/badgedetail/:game/:badge',
      module: 'components/Badges/elements/BadgePage/BadgePage',
    });
    expect(pages).toHaveLength(12);
  });

  it('fails on a route without a lazyPage import', () => {
    expect(() => readPages("ROUTE_PAGES = {\n  '/': Tracker,\n};")).toThrow(/Tracker/);
  });

  it("lists each page's chunks, leaving out what the entry loads", () => {
    expect(routeChunks(BUNDLE, PAGES)).toEqual({
      '/': ['Tracker.js', 'data.js'],
      '/badgedetail/:game/:badge': ['BadgePage.js'],
    });
  });

  it('fails when a page has no chunk', () => {
    expect(() => routeChunks(BUNDLE, [{ route: '/x', module: 'components/X/X' }])).toThrow(/X/);
  });

  it('preloads the current route only', () => {
    expect(preloadsFor('/').map((link) => link.href)).toEqual(['/Tracker.js', '/data.js']);
    expect(preloadsFor('/').every((link) => link.rel === 'modulepreload')).toBe(true);
    expect(preloadsFor('/badgedetail/4/2').map((link) => link.href)).toEqual(['/BadgePage.js']);
    expect(preloadsFor('/BadgeDetail/4/2/')).toHaveLength(1);
    expect(preloadsFor('/badgedetail/4')).toEqual([]);
    expect(preloadsFor('/nowhere')).toEqual([]);
  });
});
