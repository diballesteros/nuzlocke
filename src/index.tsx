import * as Sentry from '@sentry/react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from 'error/ErrorBoundary';
import { ROOT_ERROR_HANDLERS, SENTRY_OPTIONS } from '@/lib/sentry';
import { requestPersistentStorage } from '@/lib/storage';
import 'assets/styles/pokemon.css';
import 'assets/styles/item.css';
import App from './App';
import './i18n';

Sentry.init(SENTRY_OPTIONS);

const container = document.getElementById('root');
const root = createRoot(container, ROOT_ERROR_HANDLERS);

requestPersistentStorage();

root.render(
  <>
    <BrowserRouter>
      <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
        <App />
      </Sentry.ErrorBoundary>
    </BrowserRouter>
  </>
);
