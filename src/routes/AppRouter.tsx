import { About, Builder, Changelog, Pokestats, Report, Rules, Settings, Tracker } from 'components';
import { BadgePage } from 'components/Badges/elements';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <Tracker />
      </Route>
      <Route path="/rules">
        <Rules />
      </Route>
      <Route path="/stats">
        <Pokestats />
      </Route>
      <Route path="/builder">
        <Builder />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
      <Route exact path="/report">
        <Report />
      </Route>
      <Route path="/changelog">
        <Changelog />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route exact path="/badgedetail/:game/:badge">
        <BadgePage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};

export default AppRouter;
