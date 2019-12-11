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
    dateRange: [],
  }

	setTableData = (data, dateRange) => {
    var filteredData = data.filter((entry) => {
      const checkDate = entry["Transaction Date"];
    	const minTimeCorrection = 24 * 3600000;
      if ((checkDate.getTime() + minTimeCorrection) <= dateRange[0] 
          || (checkDate.getTime())  > dateRange[1]) {
        return false
      }
      else return true
    })
    
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

      const textDate =  monthText + "-" + dayText + '-' + date.getUTCFullYear();
      return textDate;
    }
    
    const tableData = filteredData.map((entry) => {
      return {
            "Card No.": entry["Card No."],
            Category: entry["Category"],
            Credit: Number(entry["Credit"]),
            Debit: Number(entry["Debit"]),
            Description: entry["Description"],
            "Posted Date": getTextDate(entry["Posted Date"]),
            "Transaction Date": getTextDate(entry["Transaction Date"])
          }
    })
    return tableData;
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
          while (checkChar !== '/'){
            day += checkChar;
            index += 1; 
            checkChar = dateString[index];
          }
          day = Number(day);
          
          //get year
          index += 1;
    			year = Number(dateString.slice(index,index+4));
          
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
            "Card No.": entry["Card No."],
            Category: entry["Category"],
            Credit: Number(entry["Credit"]),
            Debit: Number(entry["Debit"]),
            Description: entry["Description"],
            "Posted Date": new Date(Date.UTC(postedDateObj.year, (postedDateObj.month - 1), postedDateObj.day)),
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
      })
      .catch(err => console.log(err));

  }

  handleDateUpdate = (dateRange) => {
    this.setState({
      renderData: true,
      tableData: this.setTableData(this.state.data, dateRange.value),
    });
  }

  render() {
    const {
      renderData,
      tableData,
      tableHeaders,
      dateRange,
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