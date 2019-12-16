import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions.js';
import { Switch, Route } from "react-router-dom";

import ViewTransactions from './ViewTransactions';
import FileUpload from './FileUpload';
import Home from './Home';

class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/transactions">
      			<ViewTransactions />
          </Route>
          <Route path="/import">
            <FileUpload />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default connect(null, actions)(App);