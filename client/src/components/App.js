import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchData } from '../redux/actions.js';

import NavBar from './NavBar';

class App extends Component {
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    try {
      //call redux fetchData action creator
      await this.props.fetchData()
    }
    catch (err) { console.log("Unable to retrieve data -->" + err) };
  }
  render() {
    return (
      <div className='main-div' >
      	<NavBar />
      </div>
    );
  }
}

export default connect(null, { fetchData })(App);