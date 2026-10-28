import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'error/ErrorBoundary';
import 'assets/styles/pokemon.css';
import 'assets/styles/item.css';
import App from './App';
import './i18n';

const container = document.getElementById('root');
const root = createRoot(container);

// The non-default options below keep v10 behaviour: v11 collects more data by default (user info,
// cookies, request bodies), attaches synthetic stack traces, streams spans, reports web vitals per
// soft navigation and starts one session per page load instead of per navigation
const V10_DENYLIST = { deny: ['forwarded', '-ip', 'remote-', 'via', '-user'] };
Sentry.init({
  dsn: import.meta.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration({
      webVitals: { softNavigations: false, bfcacheNavigations: false },
    }),
    Sentry.browserSessionIntegration({ lifecycle: 'route' }),
  ],
  release: import.meta.env.REACT_APP_VERSION,
  tracesSampleRate: 0.2,
  attachStacktrace: false,
  traceLifecycle: 'static',
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: V10_DENYLIST, response: V10_DENYLIST },
    httpBodies: [],
    urlQueryParams: V10_DENYLIST,
    genAI: { inputs: false, outputs: false },
    databaseQueryData: false,
    queues: false,
    graphQL: { document: false, variables: false },
    frameContextLines: 7,
  },
});

root.render(
  <>
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
        <App />
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </>
);
