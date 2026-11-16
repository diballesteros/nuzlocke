import { useTranslation } from 'react-i18next';
import { matchPath, useLocation } from 'react-router';
import { canonicalUrl, OG_LOCALES, ROUTE_META_KEYS } from './metadata';

// The current route's <title>, description, canonical link and share tags, in the active
// language. React 19 hoists them into <head>; the share image and JSON-LD stay in index.html
function RouteMeta(): React.JSX.Element {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation('meta');
  const route = Object.keys(ROUTE_META_KEYS).find((path) => matchPath(path, pathname));
  // An unknown url renders an empty page (no 404 route yet): it keeps the home page's texts
  const key = route ? ROUTE_META_KEYS[route] : ROUTE_META_KEYS['/'];
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const url = canonicalUrl(route);
  const locale = OG_LOCALES[i18n.resolvedLanguage ?? 'en'] ?? OG_LOCALES.en;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url ? <link rel="canonical" href={url} /> : <meta name="robots" content="noindex" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:locale" content={locale} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}

export default RouteMeta;
