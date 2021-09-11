import { About, Builder, Changelog, Pokestats, Rules, Settings, Tracker } from 'components';
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const AppRouter: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Tracker} />
      <Route path="/rules" component={Rules} />
      <Route path="/stats" component={Pokestats} />
      <Route path="/builder" component={Builder} />
      <Route path="/settings" component={Settings} />
      <Route path="/changelog" component={Changelog} />
      <Route path="/about" component={About} />
      <Redirect to="/" />
    </Switch>
  );
};

export default AppRouter;
