import * as Sentry from '@sentry/react';
import type { RootOptions } from 'react-dom/client';

// Same-origin route that netlify.toml proxies to this project's ingest URL, so ad blockers
// don't drop reports. Its name avoids the words their filter lists match
export const SENTRY_TUNNEL = '/diag';

// v11 removed sendDefaultPii; userInfo: false is what stops IP inference and user fields. The other
// options here keep personal data out of what the SDK may collect, whatever it instruments later
const IP_AND_USER_HEADERS = { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] };
export const SENTRY_OPTIONS: Sentry.BrowserOptions = {
  dsn: import.meta.env.REACT_APP_SENTRY_DSN,
  integrations: [Sentry.browserTracingIntegration()],
  release: import.meta.env.REACT_APP_VERSION,
  tunnel: SENTRY_TUNNEL,
  tracesSampleRate: 0.2,
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: IP_AND_USER_HEADERS, response: IP_AND_USER_HEADERS },
    httpBodies: [],
    urlQueryParams: IP_AND_USER_HEADERS,
  },
};

// A custom root handler replaces React's default logging, so each one logs the error itself
const reportHandled = Sentry.reactErrorHandler((error): void => console.error(error));
const reportUnhandled = Sentry.reactErrorHandler();

export const ROOT_ERROR_HANDLERS: Pick<
  RootOptions,
  'onUncaughtError' | 'onCaughtError' | 'onRecoverableError'
> = {
  onUncaughtError: (error, errorInfo): void => {
    reportUnhandled(error, errorInfo);
    console.error(error);
  },
  // React calls this before the boundary's componentDidCatch. Sentry drops the second capture of an
  // error, so reporting here would leave Sentry.ErrorBoundary's showDialog with an id of no event
  onCaughtError: (error, errorInfo): void => {
    if (errorInfo.errorBoundary instanceof Sentry.ErrorBoundary) {
      console.error(error);
    } else {
      reportHandled(error, errorInfo);
    }
  },
  onRecoverableError: reportHandled,
};
