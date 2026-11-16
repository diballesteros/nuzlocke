import { matchPath } from 'react-router';
import lazyPage from 'routes/lazyPage';
import type { LazyPage } from 'routes/lazyPage';

// Each page in its own chunk, so a route loads only its page's code and data: the tracker's
// encounter data, the calculator's @smogon/calc and the badge details stay out of /rules
export const Tracker = lazyPage(() => import('components/Tracker/Tracker'));
export const Rules = lazyPage(() => import('components/Rules/Rules'));
export const Pokestats = lazyPage(() => import('components/Pokestats/Pokestats'));
export const Builder = lazyPage(() => import('components/Builder/Builder'));
export const Calculator = lazyPage(() => import('components/Calculator/Calculator'));
export const Settings = lazyPage(() => import('components/Settings/Settings'));
export const Report = lazyPage(() => import('components/Report/Report'));
export const Changelog = lazyPage(() => import('components/Changelog/Changelog'));
export const About = lazyPage(() => import('components/About/About'));
export const Import = lazyPage(() => import('components/Import/Import'));
export const BadgePage = lazyPage(() => import('components/Badges/elements/BadgePage/BadgePage'));
export const Delete = lazyPage(() => import('components/Delete/Delete'));

// Every path in AppRouter.tsx with its page (pages.test.ts checks they match)
export const ROUTE_PAGES: Record<string, LazyPage<object>> = {
  '/': Tracker,
  '/rules': Rules,
  '/stats': Pokestats,
  '/builder': Builder,
  '/calculator': Calculator,
  '/settings': Settings,
  '/report': Report,
  '/changelog': Changelog,
  '/about': About,
  '/import': Import,
  '/badgedetail/:game/:badge': BadgePage,
  '/delete': Delete,
};

// Loads the page a path renders, so the first render can include it. Never rejects: a page that
// fails to load throws again when it renders, inside its route's error boundary
export function preloadRoute(pathname: string): Promise<void> {
  const route = Object.keys(ROUTE_PAGES).find((path) => matchPath(path, pathname));
  if (!route) return Promise.resolve();
  return ROUTE_PAGES[route].preload().then(
    (): void => undefined,
    (): void => undefined
  );
}
