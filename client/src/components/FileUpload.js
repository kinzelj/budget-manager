import React, { Component } from 'react'
import { connect } from 'react-redux';
import Loader from './Loader.js';
import Button from '@material-ui/core/Button';
import DataTable from './DataTable.js';
import * as actions from '../redux/actions.js';
import * as FormatData from '../scripts/FormatData.js';

import * as ServerRoutes from '../routes/ServerRoutes.js';

class FileUpload extends Component {
  state = {
    selectedFile: null,
    loading: false,
    dataLoaded: false,
    reDirect: false,
  };

  handleChangeFile = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    }, () => {
      this.handleDataFile(event, this.state.selectedFile);
    })
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

  handleImport = (event) => {
    this.setState({ loading: true }, async () => {
      try {
        await ServerRoutes.importData(this.state.importData);
        await this.getData();
        //route to ViewTransactions page
        this.setState({ loading: false }, () => {
          this.props.handleRedirect({ text: 'View Transaction Data' });
        });
      }
      catch (err) { alert("Unable to import data -->" + err) }
    });
  }

  //async function to send csv data file to server and return as JSON object
  handleDataFile = async (event) => {
    var dataFileToSend = new FormData();
    dataFileToSend.append('file', this.state.selectedFile);

    var res = {};
    try { res = await ServerRoutes.convertData(dataFileToSend) }
    catch (err) { alert("Unable to import data -->" + err) }

    const headersObject = FormatData.getHeaders(res);
    const formattedData = FormatData.formatData(res, false);
    const dateRange = FormatData.getMinMaxDate(formattedData);

    this.setState({
      dateRange: dateRange,
      tableData: FormatData.setTableData(formattedData, dateRange),
      importData: formattedData,
      tableHeaders: headersObject,
      loading: false,
      dataLoaded: true
    });

  }

  render() {
    const {
      tableData,
      tableHeaders,
      loading,
      dataLoaded,
    } = this.state

    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
          <Loader />
        </div>
      );
    }
    else if (dataLoaded) {
      return (
        <div className='file-upload' style={{ maxWidth: '930px', margin: 'auto' }}>
          <div>
            <input type="file" className="file" onChange={this.handleChangeFile} /> <br />
          </div>
          <div className='table-import' >
            <DataTable data={tableData} headers={tableHeaders} />
            <Button onClick={this.handleImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Import Data
            </Button>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className='file-upload' style={{ maxWidth: '930px', margin: 'auto' }}>
          <div>
            <input type="file" className="file" onChange={this.handleChangeFile} /> <br />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return { data: state.data }
}

export default connect(mapStateToProps, actions)(FileUpload);