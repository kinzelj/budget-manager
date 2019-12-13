import React, { Component } from 'react'
import DataTable from './DataTable.js'
import FileUpload from './FileUpload.js'
import Slider from './Slider.js'
import Button from '@material-ui/core/Button';
import * as ServerRoutes from '../routes/ServerRoutes.js'

class App extends Component {
  state = {
    renderData: false,
    importData: false,
    data: {},
    tableData: {},
    tableHeaders: [],
    dateRange: [],
  }

  setTableData = (data, dateRange) => {
    const getTextDate = (date) => {
      const monthNum = Number(date.getUTCMonth()) + 1
      var monthText = monthNum.toString();
      if (monthNum < 10) {
        monthText = "0" + monthText;
      }

      const dayNum = Number(date.getUTCDate());
      var dayText = dayNum.toString();
      if (dayNum < 10) {
        dayText = "0" + dayText;
      }

      const textDate = monthText + "-" + dayText + '-' + date.getUTCFullYear();
      return textDate;
    }
    
    var filteredData = data.filter((entry) => {
      const checkDate = entry["Transaction Date"];
      const minTimeCorrection = 24 * 3600000;
      if ((checkDate.getTime() + minTimeCorrection) <= dateRange[0]
        || (checkDate.getTime()) > dateRange[1]) {
        return false
      }
      else return true
    })

    const tableData = filteredData.map((entry) => {
      return {
        Category: entry.Category,
        Credit: Number(entry.Credit),
        Debit: Number(entry.Debit),
        Description: entry.Description,
        "Post Date": getTextDate(entry["Post Date"]),
        "Transaction Date": getTextDate(entry["Transaction Date"])
      }
    })
    console.log(tableData);
    return tableData;
  }

  //async function to send csv data file to server and return as JSON object
  handleGetData = async (event, dataFile) => {
    var dataFileToSend = new FormData();
    dataFileToSend.append('file', dataFile);
    
    var res = {};
    try { res = await ServerRoutes.convertData(dataFileToSend) }
    catch(err) { alert("Unable to import data -->" + err) }
    
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

    const parseDate = (dateString) => {
      var year = '';
      var month = '';
      var day = '';

      //get month
      var index = 0;
      var checkChar = dateString[index];
      while (checkChar !== '/') {
        month += checkChar;
        index += 1;
        checkChar = dateString[index];
      }
      month = Number(month);

      //get day
      index += 1;
      checkChar = dateString[index];
      while (checkChar !== '/') {
        day += checkChar;
        index += 1;
        checkChar = dateString[index];
      }
      day = Number(day);

      //get year
      index += 1;
      year = Number(dateString.slice(index, index + 4));

      //set return object
      const returnObj = {
        year: year,
        month: month,
        day: day
      }
      return returnObj;
    }

    const formattedData = res.data.map((entry, index) => {
      const postedDateObj = parseDate(entry["Posted Date"]);
      const transactionDateObj = parseDate(entry["Transaction Date"]);
      return {
        Category: entry.Category,
        Credit: Number(entry.Credit),
        Debit: Number(entry.Debit),
        Description: entry.Description,
        "Post Date": new Date(Date.UTC(postedDateObj.year, (postedDateObj.month - 1), postedDateObj.day)),
        "Transaction Date": new Date(Date.UTC(transactionDateObj.year, (transactionDateObj.month - 1), transactionDateObj.day)),
      }
    });

    //set min and max dates
    var minDate = new Date();
    var maxDate = new Date();
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
      tableData: this.setTableData(formattedData, [minDate, maxDate]),
      data: formattedData,
      tableHeaders: headersObject
    });

  }

  handleDateUpdate = (dateRange) => {
    this.setState({
      renderData: true,
      tableData: this.setTableData(this.state.data, dateRange.value),
    });
  }
  
  handleImport = async (event) => {
    var res = {};
    try { res = await ServerRoutes.importData(this.state.data) }
    catch(err) { alert("Unable to import data -->" + err) }
    
    console.log(res);
  }

  render() {
    const {
      renderData,
      importData,
      tableData,
      tableHeaders,
      dateRange,
    } = this.state

    console.log({tableData});
    if (renderData) {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px', margin: 'auto' }}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
            <DataTable data={tableData} headers={tableHeaders} />
            	<Button onClick={this.handleImport} variant="contained" color="primary" style={{marginTop: '10px'}}>
        				Import Data
        			</Button>
          </div>
        </div>
      );
    }
    else if (importData) {
      return (
     		<div></div> 
      );
    }
    else {
      return (
        <div className="App" style={{ width: '90%', margin: 'auto' }}>
          <FileUpload submitFile={this.handleGetData} />
        </div>
      );
    }
  }
}

export default App;