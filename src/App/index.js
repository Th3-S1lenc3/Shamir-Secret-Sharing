import React from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import SplitSecret from '@components/SplitSecret';
import CombineShares from '@components/CombineShares';
import Navigation from '@components/Navigation';

import './index.css';

export default function App() {

  const routesArr = [
    'split',
    'combine'
  ]

  return (
    <div className="App">
      <Router>
        <Navigation routes={routesArr} />
        <Switch>
          <Route
            exact
            path="/"
            render={() => <Redirect to="/split" />}
          />
          <Route
            exact
            path="/split"
            component={SplitSecret}
          />
          <Route
            exact
            path="/combine"
            component={CombineShares}
          />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </div>
  );
}
