import * as Sentry from '@sentry/react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  About,
  Builder,
  Calculator,
  Changelog,
  Import,
  Pokestats,
  Report,
  Rules,
  Settings,
  Tracker,
} from 'components';
import { BadgePage } from 'components/Badges/elements';
import ErrorBoundary from 'error/ErrorBoundary';

function AppRouter(): JSX.Element {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Tracker />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/rules"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Rules />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/stats"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Pokestats />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/builder"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Builder />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/calculator"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Calculator />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/settings"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Settings />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/report"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Report />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/changelog"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Changelog />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/about"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <About />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/import"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <Import />
          </Sentry.ErrorBoundary>
        }
      />
      <Route
        path="/badgedetail/:game/:badge"
        element={
          <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
            <BadgePage />
          </Sentry.ErrorBoundary>
        }
      />
      <Navigate to="/" replace />
    </Routes>
  );
}

export default AppRouter;
