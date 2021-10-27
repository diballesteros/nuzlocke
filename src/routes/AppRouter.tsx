import * as Sentry from '@sentry/react';
import { Redirect, Route, Switch } from 'react-router-dom';
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
    <Switch>
      <Route exact path="/">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Tracker />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/rules">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Rules />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/stats">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Pokestats />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/builder">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Builder />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/calculator">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Calculator />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/settings">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Settings />
        </Sentry.ErrorBoundary>
      </Route>
      <Route exact path="/report">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Report />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/changelog">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Changelog />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/about">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <About />
        </Sentry.ErrorBoundary>
      </Route>
      <Route path="/import">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <Import />
        </Sentry.ErrorBoundary>
      </Route>
      <Route exact path="/badgedetail/:game/:badge">
        <Sentry.ErrorBoundary fallback={<ErrorBoundary />} showDialog>
          <BadgePage />
        </Sentry.ErrorBoundary>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
}

export default AppRouter;
