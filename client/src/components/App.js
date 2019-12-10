import React, { Component } from 'react'
import DataTable from './DataTable.js'
import FileUpload from './FileUpload.js'
import axios from 'axios';

class App extends Component {
  render () {
    return (
      <div className="App">
        <FileUpload />
      {/* <DataTable /> */}
      </div>
    );
  }
}

export default App;