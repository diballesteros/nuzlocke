// Which UI areas a change can affect, from the real import graph rather than from file paths.
//   node scripts/affected-areas.mjs --base origin/master      changed files from git
//   node scripts/affected-areas.mjs src/components/Move/Move.tsx [...]
// Prints JSON ({ all, areas, files, grepInvert }) and, with --markdown <file>, a table for the
// PR comment. Areas, their root modules and global files are in verification/areas.json.
//
// The graph follows TS/TSX imports through the path aliases in vite.config.ts and resolves named
// imports from barrel files (`import { Move } from 'components'` depends on Move only, not on
// every component the barrel re-exports). SCSS modules count as their importer's dependencies,
// and @use/@import between stylesheets are followed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const config = JSON.parse(fs.readFileSync('verification/areas.json', 'utf8'));

// Kept in step with resolve.alias in vite.config.ts
const ALIASES = {
  '@': 'src',
  components: 'src/components',
  constants: 'src/constants',
  common: 'src/common',
  hooks: 'src/hooks',
  selectors: 'src/selectors',
  store: 'src/store.ts',
  assets: 'src/assets',
  locale: 'src/locale',
  error: 'src/error',
  routes: 'src/routes',
  supabaseClient: 'src/supabaseClient.ts',
};

const posix = (file) => file.split(path.sep).join('/');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = posix(path.join(dir, entry.name));
    return entry.isDirectory() ? walk(full) : [full];
  });

const SOURCES = walk('src').filter((file) => /\.(tsx?|scss|css)$/.test(file));
const EXISTING = new Set(walk('src'));

const resolveFile = (base) => {
  const candidates = [
    base,
    ...['.ts', '.tsx', '.scss', '.css', '.json'].map((ext) => base + ext),
    ...['index.ts', 'index.tsx'].map((index) => `${base}/${index}`),
    // Sass partials: @use 'variables' means _variables.scss
    `${path.posix.dirname(base)}/_${path.posix.basename(base)}.scss`,
    `${base}/_index.scss`,
  ];
  return candidates.find((candidate) => EXISTING.has(candidate));
};

const resolve = (specifier, from) => {
  if (specifier.startsWith('.')) {
    return resolveFile(path.posix.normalize(path.posix.join(path.posix.dirname(from), specifier)));
  }
  const [head, ...rest] = specifier.split('/');
  if (!(head in ALIASES)) return undefined; // a package
  return resolveFile([ALIASES[head], ...rest].join('/'));
};

// Modules that only re-export (export { default as X } from './X/X'): name -> module
const barrelExports = (file) => {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest);
  const names = new Map();
  for (const statement of source.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) return null;
    const target = resolve(statement.moduleSpecifier.text, file);
    statement.exportClause?.elements.forEach((element) => names.set(element.name.text, target));
  }
  return names.size ? names : null;
};
const barrels = new Map();
const barrelFor = (file) => {
  if (!barrels.has(file)) barrels.set(file, /\.tsx?$/.test(file) ? barrelExports(file) : null);
  return barrels.get(file);
};

// file -> files it depends on
const dependencies = (file) => {
  const text = fs.readFileSync(file, 'utf8');
  if (/\.s?css$/.test(file)) {
    return [...text.matchAll(/@(?:use|import|forward)\s+['"]([^'"]+)['"]/g)]
      .map(([, specifier]) =>
        resolve(specifier.startsWith('@/') ? specifier : `./${specifier}`, file)
      )
      .filter(Boolean);
  }
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, false);
  const deps = [];
  const visit = (node) => {
    const specifier =
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
        ? node.moduleSpecifier.text
        : ts.isCallExpression(node) &&
            node.expression.kind === ts.SyntaxKind.ImportKeyword &&
            ts.isStringLiteral(node.arguments[0])
          ? node.arguments[0].text
          : null;
    if (specifier) {
      const target = resolve(specifier, file);
      const barrel = target && barrelFor(target);
      const named =
        ts.isImportDeclaration(node) &&
        node.importClause?.namedBindings &&
        ts.isNamedImports(node.importClause.namedBindings)
          ? node.importClause.namedBindings.elements.map((e) => (e.propertyName ?? e.name).text)
          : null;
      if (barrel && named) named.forEach((name) => deps.push(barrel.get(name) ?? target));
      else if (target) deps.push(target);
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return deps;
};

const importers = new Map();
for (const file of SOURCES) {
  for (const dep of dependencies(file)) {
    if (!importers.has(dep)) importers.set(dep, new Set());
    importers.get(dep).add(file);
  }
}

const globToRegExp = (glob) =>
  new RegExp(
    `^${glob
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '.*')
      .replace(/(?<!\.)\*/g, '[^/]*')}$`
  );
const GLOBAL = config.global.map(globToRegExp);
const ROOTS = Object.entries(config.roots);
const BOUNDARIES = new Set(config.boundaries);

// Every module that (transitively) imports `file`, stopping at the router
const reach = (file) => {
  const seen = new Set([file]);
  const queue = [file];
  while (queue.length) {
    const current = queue.shift();
    if (BOUNDARIES.has(current)) continue;
    for (const importer of importers.get(current) ?? []) {
      if (!seen.has(importer)) {
        seen.add(importer);
        queue.push(importer);
      }
    }
  }
  return seen;
};

const areasFor = (file) => {
  if (GLOBAL.some((pattern) => pattern.test(file))) return ['*'];
  if (!file.startsWith('src/')) return [];
  const reached = reach(file);
  return ROOTS.filter(([, roots]) => roots.some((root) => reached.has(root))).map(([area]) => area);
};

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args.splice(i, 2)[1];
};
const base = option('--base');
const markdown = option('--markdown');
const changed = base
  ? execFileSync('git', ['diff', '--name-only', `${base}...HEAD`])
      .toString()
      .split('\n')
  : args;

const files = Object.fromEntries(
  changed.filter(Boolean).map((file) => [posix(file), areasFor(posix(file))])
);
const all = Object.values(files).some((areas) => areas.includes('*'));
const areas = all ? Object.keys(config.roots) : [...new Set(Object.values(files).flat())].sort();
const result = {
  all,
  areas,
  files,
  // For `playwright test --grep-invert`: every visual state outside the touched areas
  grepInvert: all ? null : areas.length ? `@(${areas.join('|')})\\b` : null,
};
console.info(JSON.stringify(result, null, 2));

if (markdown) {
  const rows = Object.entries(files).map(
    ([file, fileAreas]) =>
      `| \`${file}\` | ${fileAreas.includes('*') ? 'all (global file)' : fileAreas.join(', ') || '—'} |`
  );
  fs.writeFileSync(
    markdown,
    [
      `**Affected areas:** ${all ? 'all (a global file changed)' : areas.join(', ') || 'none'}`,
      '',
      '| Changed file | Areas it can affect |',
      '|---|---|',
      ...rows,
      '',
    ].join('\n')
  );
}
