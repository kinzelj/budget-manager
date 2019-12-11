import React, { Component } from 'react'
import DataTable from './DataTable.js'
import FileUpload from './FileUpload.js'
import Slider from './Slider.js'
import axios from 'axios';

class App extends Component {
  state = {
    renderData: false,
    data: {},
    tableData: {},
    tableHeaders: [],
    dateRange: []
  }

  handleSubmitData = (event, dataFile) => {

    //async function to send data file to server and return as JSON object
    var dataFileToSend = new FormData();
    dataFileToSend.append('file', dataFile);

    axios.post("/data", dataFileToSend, {})
      .then(res => {
        var headers = Object.keys(res.data[0]);
        headers = headers.filter((value) => {
          if (value !== "Card No." && value !== "Posted Date") {
            return true
          }
          return false;
        });
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


        const formattedData = res.data.map((entry, index) => {
          return {
            Entry: index,
            "Card No.": entry["Card No."],
            Category: entry["Category"],
            Credit: Number(entry["Credit"]),
            Debit: Number(entry["Debit"]),
            Description: entry["Description"],
            "Posted Date": new Date(entry["Posted Date"]),
            "Transaction Date": new Date(entry["Transaction Date"])
          }
        });

        //set min and max dates
        var minDate = new Date();
        var maxDate = new Date();
        console.log(formattedData);
        formattedData.map((entry, index) => {
          if (index === 0) {
            minDate = entry["Transaction Date"];
            maxDate = entry["Transaction Date"];
          }
          else if (entry["Transaction Date"] < minDate) { minDate = entry["Transaction Date"] }
          else if (entry["Transaction Date"] > maxDate) { maxDate = entry["Transaction Date"] }
          return null;
        })

        this.setState({
          dateRange: [minDate, maxDate],
          renderData: true,
          tableData: res.data,
          data: formattedData,
          tableHeaders: headersObject
        }, () => { console.log(this.state) });
      })
      .catch(err => console.log(err));

  }

  handleDateUpdate = (dateRange) => {
    this.setState({ renderData: false });
    var filteredData = this.state.tableData.filter((entry) => {
      if (new Date(entry["Transaction Date"]).getTime() < dateRange.value[0] || new Date(entry["Transaction Date"]).getTime() > dateRange.value[1]) {
        return false
      }
      else return true
    })
    this.setState({
      renderData: true,
      tableData: filteredData,
    }, () => console.log(this.state));
  }

  render() {
    const {
      renderData,
      tableData,
      tableHeaders,
      dateRange
    } = this.state

    if (renderData) {
      return (
        <div className="App">
          <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
          <DataTable data={tableData} headers={tableHeaders} />
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