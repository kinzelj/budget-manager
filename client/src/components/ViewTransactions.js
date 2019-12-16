import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import DataTable from './DataTable.js';
import Slider from './Slider.js';
import Button from '@material-ui/core/Button';
import * as FormatData from '../scripts/FormatData.js';
import * as actions from '../redux/actions.js';

class ViewTransactions extends Component {
  state = {
    redirect: "",
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
      const formattedData = FormatData.formatData(this.props.data, true);
      const tableData = FormatData.setTableData(formattedData, FormatData.getMinMaxDate(formattedData));
      const headersObject = FormatData.getHeaders(this.props.data);
      const dateRange = FormatData.getMinMaxDate(formattedData);
      this.setState({
        data: formattedData,
        tableData: tableData,
        dateRange: dateRange,
        tableHeaders: headersObject
      });
    }
    catch (err) { console.log("Unable to retrieve data -->" + err) };
  }

  handleDateUpdate = (dateRange) => {
    this.setState({
      tableData: FormatData.setTableData(this.state.data, dateRange.value),
    });
  }
  
  handleRedirectImport = () => {
    this.setState({redirect: 'import'});
  }

  render() {
    const {
      tableData,
      tableHeaders,
      dateRange,
      redirect,
    } = this.state
    console.log(redirect);
    switch (redirect){
      case ('import'): {
        return (
          <Redirect to="/import" />
        );
      }
      default: {
        return (
          <div className="app" style={{ width: '90%', margin: 'auto' }}>
            <div className='table-slider' style={{ maxWidth: '930px', margin: 'auto' }}>
              <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
              <DataTable data={tableData} headers={tableHeaders} />
              <Button onClick={this.handleRedirectImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
                Import New Data
              </Button>
            </div>
          </div>
        );
      }
    }
	}
}

function mapStateToProps(state) {
  return { data: state.data }
}

export default connect(mapStateToProps, actions)(ViewTransactions);