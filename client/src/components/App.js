import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataTable from './DataTable.js';
import FileUpload from './FileUpload.js';
import Slider from './Slider.js';
import Loader from './Loader.js';
import Button from '@material-ui/core/Button';
import * as ServerRoutes from '../routes/ServerRoutes.js';
import * as actions from '../actions/actions.js';

class App extends Component {
  state = {
    importRoute: false,
    loading: false,
    home: true,
    importFile: false,
    data: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    importData: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    tableData: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    tableHeaders: [],
    dateRange: [new Date(0), new Date()],
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      //call redux fetchData action
      await this.props.fetchData()

      //format data and set component state
      const formattedData = this.formatData(this.props.data, true);
      const tableData = this.setTableData(formattedData, this.getMinMaxDate(formattedData));
      const headersObject = this.getHeaders(this.props.data);
      const dateRange = this.getMinMaxDate(formattedData);
      this.setState({
        data: formattedData,
        tableData: tableData,
        dateRange: dateRange,
        tableHeaders: headersObject
      });
    }
    catch (err) { console.log("Unable to retrieve data -->" + err) };
  }

  parseDate = (dateString) => {
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

  getHeaders(data) {
    var headers = Object.keys(data[0]);
    headers = headers.filter((value) => {
      if (value === "Card No." || value === "Posted Date" || value === "_id" || value === "__v") {
        return false;
      }
      return true;
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
    return headersObject;

  }

  formatData(data, mount) {
    const formattedData = data.map((entry, index) => {
      var newPostDate = {};
      var newTransactionDate = {};
      if (mount) {
        newPostDate = new Date(entry["Posted Date"]);
        newTransactionDate = new Date(entry["Transaction Date"]);
      }
      else {
        const postedDateObj = this.parseDate(entry["Posted Date"]);
        const transactionDateObj = this.parseDate(entry["Transaction Date"]);
        newPostDate = new Date(Date.UTC(postedDateObj.year, (postedDateObj.month - 1), postedDateObj.day));
        newTransactionDate = new Date(Date.UTC(transactionDateObj.year, (transactionDateObj.month - 1), transactionDateObj.day));
      }
      return {
        Category: entry.Category,
        Credit: Number(entry.Credit),
        Debit: Number(entry.Debit),
        Description: entry.Description,
        "Posted Date": newPostDate,
        "Transaction Date": newTransactionDate,
      }
    })
    return formattedData;
  }

  //set min and max dates
  getMinMaxDate(data) {
    var minDate = new Date();
    var maxDate = new Date();
    data.map((entry, index) => {
      if (index === 0) {
        minDate = entry["Transaction Date"];
        maxDate = entry["Transaction Date"];
      }
      else if (entry["Transaction Date"] < minDate) { minDate = entry["Transaction Date"] }
      else if (entry["Transaction Date"] > maxDate) { maxDate = entry["Transaction Date"] }
      return null;
    })
    return ([minDate, maxDate]);
  }

  getTextDate = (date) => {
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

  setTableData = (data, dateRange) => {
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
        "Posted Date": this.getTextDate(entry["Posted Date"]),
        "Transaction Date": this.getTextDate(entry["Transaction Date"])
      }
    })
    return tableData;
  }

  //async function to send csv data file to server and return as JSON object
  handleDataFile = async (event, dataFile) => {
    var dataFileToSend = new FormData();
    dataFileToSend.append('file', dataFile);

    var res = {};
    try { res = await ServerRoutes.convertData(dataFileToSend) }
    catch (err) { alert("Unable to import data -->" + err) }

    const headersObject = this.getHeaders(res);

    const formattedData = this.formatData(res, false);

    this.setState({
      dateRange: this.getMinMaxDate(formattedData),
      importRoute: true,
      tableData: this.setTableData(formattedData, this.getMinMaxDate(formattedData)),
      importData: formattedData,
      tableHeaders: headersObject
    });

  }

  handleDateUpdate = (dateRange) => {
    this.setState({
      tableData: this.setTableData(this.state.data, dateRange.value),
    });
  }

  handleImport = (event) => {
    this.setState({ loading: true }, async () => {
      try {
        await ServerRoutes.importData(this.state.importData);
        await this.getData();
        this.setState({ loading: false, home: true });
      }
      catch (err) { alert("Unable to import data -->" + err) }
    });
  }

  propmptImport = () => {
    this.setState({ home: false, importRoute: false, importFile: true })
  }

  render() {
    const {
      home,
      importFile,
      importRoute,

      tableData,
      tableHeaders,
      dateRange,
      loading,
    } = this.state
    if (home) {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px', margin: 'auto' }}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
            <DataTable data={tableData} headers={tableHeaders} />
            <Button onClick={this.propmptImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Import New Data
            </Button>
          </div>
        </div>
      );
    }
    else if (importRoute) {
      if (loading) {
        return (
          <div >
            <Loader style={{ margin: 'auto' }} />
          </div>
        );
      }
      else {
        return (
          <div className="app" style={{ width: '90%', margin: 'auto' }}>
            <div className='table-import' style={{ maxWidth: '930px', margin: 'auto' }}>
              <DataTable data={tableData} headers={tableHeaders} />
              <Button onClick={this.handleImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Import Data
                </Button>
            </div>
          </div>
        );
      }
    }
    else if (importFile) {
      return (
        <div className="App" style={{ width: '90%', margin: 'auto' }}>
          <FileUpload submitFile={this.handleDataFile} />
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return { data: state.data }
}

export default connect(mapStateToProps, actions)(App);