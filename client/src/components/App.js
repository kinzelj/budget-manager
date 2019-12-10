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
      	headers = headers.filter((value) => { if(value !== "Card No." && value !== "Posted Date"){return true}});
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
        
      
      	const formatedData = res.map((entry, index) => {
          return {
            "Entry": index,
          	"Card No.": entry["Card No."],
      			Category: entry["Category"],
      			Credit: Number(entry["Credit"]),
      			Debit: Number(entry["Debit"]),
      			Description: entry["Description"],
      			"Posted Date": new Date(entry["Posted Date"]),
      			"Transaction Date": new Date(entry["Transaction Date"])
          }
        });
      
        var minDate = new Date();
        var maxDate = new Date();
      	const getDateRange = formatedData.map((entry, index) => {
        	if (index === 0) {
            minDate = entry["Transaction Date"];
            maxDate = entry["Transaction Date"];
          } 
          else if (entry["Transaction Date"] < minDate) {minDate = entry["Transaction Date"]}
          else if (entry["Transaction Date"] > maxDate) {maxDate = entry["Transaction Date"]}
        })
        
        this.setState({ 
          dateRange: [minDate, maxDate], 
          renderData: true, 
          tableData: res, 
          data: formatedData, 
          tableHeaders: headersObject 
        }, () => {console.log(this.state)});
      })
      .catch(err => console.log(err));

  }
  
  handleDateUpdate = (dateRange) => {
    console.log(dateRange);
  }

  render() {
    if (this.state.renderData === true) {
      return (
        <div className="App">
        	<Slider handleUpdate={this.handleDateUpdate} dateRange={this.state.dateRange} />
          <DataTable data={this.state.tableData} headers={this.state.tableHeaders} />
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