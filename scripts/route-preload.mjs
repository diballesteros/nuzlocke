// Each page is a chunk of its own (src/routes/pages.ts), which the app imports only once the main
// chunk has run: a second round trip before the first paint. The built index.html gets a small
// inline script that adds modulepreload links for the current route's chunks, so they download
// alongside the main one. Vite's own preload helper skips files a link already asked for.

// The routes and page modules in pages.ts: `export const Tracker = lazyPage(() =>
// import('components/Tracker/Tracker'));` and `'/': Tracker,` in ROUTE_PAGES
export function readPages(source) {
  const modules = Object.fromEntries(
    [...source.matchAll(/export const (\w+) = lazyPage\(\s*\(\) => import\('([^']+)'\)\s*\)/g)].map(
      ([, name, module]) => [name, module]
    )
  );
  const table = source.slice(source.indexOf('ROUTE_PAGES'));
  const routes = [...table.matchAll(/^\s*'([^']+)': (\w+),$/gm)];
  return routes.map(([, route, name]) => {
    if (!modules[name]) throw new Error(`route-preload: no lazyPage import for ${name}`);
    return { route, module: modules[name] };
  });
}

// Every chunk a chunk imports statically, itself included
function closure(bundle, fileName, seen = new Set()) {
  if (seen.has(fileName)) return seen;
  seen.add(fileName);
  for (const imported of bundle[fileName]?.imports ?? []) closure(bundle, imported, seen);
  return seen;
}

// route → the chunks its page needs beyond the entry's (which index.html already loads)
export function routeChunks(bundle, pages) {
  const chunks = Object.values(bundle).filter((output) => output.type === 'chunk');
  const entry = chunks.find((chunk) => chunk.isEntry);
  if (!entry) throw new Error('route-preload: no entry chunk');
  const loaded = closure(bundle, entry.fileName);
  return Object.fromEntries(
    pages.map(({ route, module }) => {
      const page = chunks.find((chunk) =>
        chunk.facadeModuleId?.replaceAll('\\', '/').match(new RegExp(`/src/${module}\\.tsx?$`))
      );
      if (!page) throw new Error(`route-preload: no chunk for ${module}`);
      return [route, [...closure(bundle, page.fileName)].filter((file) => !loaded.has(file))];
    })
  );
}

// Matches a path the way AppRouter does: case-insensitive, an optional trailing slash, a
// :param for one segment
export function preloadScript(chunks, base = '/') {
  return `(function(m,p){for(var r in m)if(new RegExp('^'+r.replace(/:[^/]+/g,'[^/]+')+'/?$','i').test(p)){m[r].forEach(function(f){var l=document.createElement('link');l.rel='modulepreload';l.crossOrigin='';l.href=${JSON.stringify(base)}+f;document.head.appendChild(l)});break}})(${JSON.stringify(chunks)},location.pathname)`;
}
