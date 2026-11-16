import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'error/ErrorBoundary';
import { ROOT_ERROR_HANDLERS, SENTRY_OPTIONS } from '@/lib/sentry';
import { registerServiceWorker } from '@/lib/serviceWorker';
import { reloadOnStaleChunk } from '@/lib/staleChunks';
import { requestPersistentStorage } from '@/lib/storage';
import 'assets/styles/pokemon.css';
import 'assets/styles/item.css';
import { preloadRoute } from 'routes/pages';
import App from './App';
import './i18n';

Sentry.init(SENTRY_OPTIONS);

const container = document.getElementById('root');
const root = createRoot(container, ROOT_ERROR_HANDLERS);

requestPersistentStorage();
reloadOnStaleChunk();
registerServiceWorker();

// The first render waits for the current page's chunk, so the page is in the first paint
preloadRoute(window.location.pathname).then(() =>
  root.render(
    <>
      <BrowserRouter>
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <App />
        </Sentry.ErrorBoundary>
      </BrowserRouter>
    </>
  )
);
