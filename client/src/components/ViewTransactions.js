import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataTable from './DataTable.js';
import Slider from './Slider.js';
import Button from '@material-ui/core/Button';
import Loader from './Loader.js';
import * as FormatData from '../scripts/FormatData.js';
import * as ServerRoutes from '../routes/ServerRoutes.js';
import * as actions from '../redux/actions.js';

class ViewTransactions extends Component {
  state = {
    loading: true,
    redirect: "",
    data: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    importData: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    tableData: [{ "Transaction Date": new Date().getDate(), "Posted Date": new Date().getDate() }],
    tableHeaders: [],
    dateRange: [new Date(0), new Date()],
    updateCategoryRows: [],
    editCategories: false,
  }

  componentDidMount() {
    this.getData()
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
        tableHeaders: headersObject,
        loading: false
      },()=>{console.log(this.state.tableData)});
    }
    catch (err) { console.log("Unable to retrieve data -->" + err) };
  }

  handleDateUpdate = (dateRange) => {
    this.setState({ loading: true });
    this.setState({
      tableData: FormatData.setTableData(this.state.data, dateRange.value),
    }, () => { this.setState({ loading: false }) });
  }

  handleRedirectImport = () => {
    this.props.handleRedirect('Import Data');
  }

  updateCategory = (newCategory, id, index) => {
    let updatedTable = this.state.tableData;
    updatedTable[index].Category = newCategory;

    let updatedCategoryArray = this.state.updateCategoryRows
    updatedCategoryArray.push({ id, newCategory });

    this.setState({
      tableData: updatedTable,
      updateCategoryRows: updatedCategoryArray,
    });
  }

  handleEditCategories = () => {
    this.setState({
      editCategories: true, 
    });
  }

  handleSaveCategories = () => {
    this.setState({
      loading: true,
      editCategories: false  
    }, async () => { 
      if(this.state.updateCategoryRows[0]){
        await (ServerRoutes.updateCategories(this.state.updateCategoryRows));
        await (this.getData());
      }
      this.setState({updateCategoryRows: [], loading: false});
    })
  }

  getEditButton = () => {
    if (this.state.editCategories) {
      return (
        <Button id='save-data-button' onClick={this.handleSaveCategories} variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '20px', backgroundColor: '#047700' }}>
          Save Data
            </Button>
      );
    }
    else {
      return (
        <Button id='edit-categories-button' onClick={this.handleEditCategories} variant="contained" color="primary" style={{ marginTop: '10px', marginLeft: '20px' }}>
          Edit Categories
            </Button>
      );
    }

  }

  render() {
    const {
      tableData,
      tableHeaders,
      dateRange,
      loading,
      editCategories,
    } = this.state
    if (loading) {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px', margin: 'auto' }}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <Loader />
            </div>
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px', margin: 'auto' }}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} />
            <DataTable edit={editCategories} categoryChange={this.updateCategory} data={tableData} headers={tableHeaders} />
            <Button onClick={this.handleRedirectImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Import New Data
            </Button>
            {this.getEditButton()}
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state) {
  return { data: state.data }
}

export default connect(mapStateToProps, actions)(ViewTransactions);