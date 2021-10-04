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
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <ErrorBoundary>
          <Tracker />
        </ErrorBoundary>
      </Route>
      <Route path="/rules">
        <ErrorBoundary>
          <Rules />
        </ErrorBoundary>
      </Route>
      <Route path="/stats">
        <ErrorBoundary>
          <Pokestats />
        </ErrorBoundary>
      </Route>
      <Route path="/builder">
        <ErrorBoundary>
          <Builder />
        </ErrorBoundary>
      </Route>
      <Route path="/calculator">
        <ErrorBoundary>
          <Calculator />
        </ErrorBoundary>
      </Route>
      <Route path="/settings">
        <ErrorBoundary>
          <Settings />
        </ErrorBoundary>
      </Route>
      <Route exact path="/report">
        <ErrorBoundary>
          <Report />
        </ErrorBoundary>
      </Route>
      <Route path="/changelog">
        <ErrorBoundary>
          <Changelog />
        </ErrorBoundary>
      </Route>
      <Route path="/about">
        <ErrorBoundary>
          <About />
        </ErrorBoundary>
      </Route>
      <Route path="/import">
        <ErrorBoundary>
          <Import />
        </ErrorBoundary>
      </Route>
      <Route exact path="/badgedetail/:game/:badge">
        <ErrorBoundary>
          <BadgePage />
        </ErrorBoundary>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default AppRouter;
