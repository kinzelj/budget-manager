import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../redux/actions.js';

import NavBar from './NavBar';

class App extends Component {
  render() {
    return (
      <div className='main-div' >
      	<NavBar />
      </div>
    );
  }
}

export default connect(null, actions)(App);