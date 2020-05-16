import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchData, fetchSettings } from '../redux/actions.js';

import NavBar from './NavBar';

class App extends Component {
  componentDidMount() {
    this.getData()
  }
  getData = async () => {
    try {
      //call redux fetchData action creator
      const settingsInit = {user_id: "kinzelj", budget_id: "2020 Budget"}
      await this.props.fetchData();
      await this.props.fetchSettings(settingsInit);
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

export default connect(null, { fetchData, fetchSettings })(App);