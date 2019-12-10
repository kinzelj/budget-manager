import React, { Component } from 'react'
import DataTable from './DataTable.js'
import FileUpload from './FileUpload.js'
import axios from 'axios';

class App extends Component {
  state = {
    renderData: false,
    data: {},
    tableHeaders: []
  }

  handleSubmitData = (event, dataFile) => {

    //async function to send data file to server and return as JSON object
    const sendData = async (dataObject) => {
      const options = {
        method: 'POST',
        url: '/data',
        data: dataObject
      }
      const response = await axios(options);
      const responseData = await response.data;
      return responseData;
    }

    const data = new FormData()
    data.append('file', dataFile)

    sendData(data)
      .then(res => {
        var headers = Object.keys(res[0]);
        headers = headers.filter((value) => value !== "Card No.");
        const headersObject = headers.map((value, index) => {
          var returnObject = {
            width: 150,
            label: value,
            dataKey: value,
            numeric: false
          }
          if (value === "Credit" || value === "Debit") {
            returnObject.numeric = true
          }
          if (value === "Description") {
            returnObject.width = 300
          }
          return returnObject;
        })

        this.setState({ renderData: true, data: res, tableHeaders: headersObject });
      })
      .catch(err => console.log(err));

  }

  render() {
    if (this.state.renderData === true) {
      return (
        <div className="App">
          <DataTable data={this.state.data} headers={this.state.tableHeaders} />
        </div>
      );
    }
    else {
      return (
        <div className="App">
          <FileUpload submitFile={this.handleSubmitData} />
        </div>
      );
    }
  }
}

export default App;