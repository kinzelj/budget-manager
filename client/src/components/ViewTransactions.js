import React, { Component } from 'react';
import { connect } from 'react-redux';
import DataTable from './DataTable.js';
import AddTransactionPopup from './AddTransactionPopup.js';
import Slider from './Slider.js';
import Button from '@material-ui/core/Button';
import Loader from './Loader.js';
import * as FormatData from '../scripts/FormatData.js';
import * as ServerRoutes from '../routes/ServerRoutes.js';
import * as actions from '../redux/actions.js';

class ViewTransactions extends Component {
  constructor(props) {
    super(props);
    this.tableStart = 90; //number of days to show as default table date range
    this.filterCategories = true;
    this.state = {
      loading: true,
      redirect: "",
      importData: [{ "Transaction Date": new Date(), "Posted Date": new Date() }],
      tableData: [{ "Transaction Date": new Date(), "Posted Date": new Date() }],
      categoryData: [{ "Transaction Date": new Date(), "Posted Date": new Date() }],
      // sliderInit: [new Date((new Date()).getTime() - (86400000 * this.tableStart)), new Date()],
      sliderInit: [new Date(new Date().getFullYear(), 0, 1), new Date()],
      sliderRange: [],
      tableHeaders: [],
      dateRange: [new Date(0), new Date()],
      updateCategoryRows: [],
      editCategories: false,
      refresh: false,
      addTransactionPopup: false,
    }
  }

  componentDidMount() {
    //format data and set component state
    const formattedData = FormatData.formatData(this.props.data);
    const tableData = FormatData.setTableData(formattedData, this.state.sliderInit);
    const dateRange = FormatData.getMinMaxDate(formattedData);
    this.setState({
      tableData: tableData,
      dateRange: dateRange,
      tableHeaders: FormatData.getHeaders(tableData),
      loading: false
    });
  }

  getData = async () => {
    try {
      //call redux fetchData action
      await this.props.fetchData()

      //format data and set component state
      const formattedData = FormatData.formatData(this.props.data);
      let tableData = [];
      if (this.state.refresh) {
        tableData = FormatData.setTableData(formattedData, this.state.sliderRange);
      }
      else {
        tableData = FormatData.setTableData(formattedData, this.state.sliderInit);
      }
      const dateRange = FormatData.getMinMaxDate(formattedData);
      this.setState({
        tableData: tableData,
        dateRange: dateRange,
        sliderInit: [new Date((new Date()).getTime() - (86400000 * this.tableStart)), new Date()],
      	tableHeaders: FormatData.getHeaders(tableData),
        loading: false
      });
    }
    catch (err) { console.log("Unable to retrieve data -->" + err) };
  }

  handleDateUpdate = (dateRange) => {
    this.setState({ loading: true });
    const formattedData = FormatData.formatData(this.props.data);
    const tableData = FormatData.setTableData(formattedData, dateRange.value)
    this.setState({
      sliderRange: dateRange.value,
      tableData: tableData,
      tableHeaders: FormatData.getHeaders(tableData),
    }, () => { this.setState({ loading: false }) });
  }

  handleRedirectImport = () => {
    this.props.handleRedirect('Import Transaction Data');
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

  handleFilter = (filterCategory, filterClass) => {
    switch (filterClass.value) {
      case ('category'):{
    		const formattedData = FormatData.formatData(this.props.data);
    		const tableData = FormatData.setTableData(formattedData, this.state.sliderRange)
        const categoryData = FormatData.filterCategories(tableData, filterCategory);
        this.setState({
          tableData: categoryData,
          categoryData: categoryData,
      		tableHeaders: FormatData.getHeaders(categoryData),
        });
        break;
      }
      case ('description'): {
        const filteredTable = FormatData.filterDescriptions(this.state.categoryData, filterCategory);
        this.setState({
          tableData: filteredTable,
        });     
        break;
      }
      default:
        return;
    }
    
  }

  handleEditCategories = () => {
    this.setState({
      editCategories: true,
    });
  }

  handleSaveCategories = () => {
    this.setState({
      loading: true,
      refresh: true,
      editCategories: false
    }, async () => {
      if (this.state.updateCategoryRows[0]) {
        await (ServerRoutes.updateCategories(this.state.updateCategoryRows));
        await (this.getData());
      }
      this.setState({ updateCategoryRows: [], loading: false, refresh: false });
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
  
  handleAddTransaction = () => {
    this.setState({
      addTransactionPopup: true
    })
  }
  
  handleClosePopup = () => {
    console.log('test');
    this.setState({
      addTransactionPopup: false 
    })   
  }

  render() {
    const {
      tableData,
      tableHeaders,
      dateRange,
      loading,
      editCategories,
      sliderInit,
      addTransactionPopup
    } = this.state
    if (loading) {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px' }}>
            <Slider minWidth='683px' handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Table"} sliderInit={sliderInit} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
              <Loader />
            </div>
          </div>
        </div>
      );
    }
    else if (addTransactionPopup) {
      return (<AddTransactionPopup closePopup={this.handleClosePopup}/>);
    }
    else {
      return (
        <div className="app" style={{ width: '90%', margin: 'auto' }}>
          <div className='table-slider' style={{ maxWidth: '930px' }}>
            <Slider minWidth='683px' handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Table"} sliderInit={sliderInit} />
            <DataTable
              filterChange={this.handleFilter}
              edit={editCategories}
              filter={this.filterCategories}
              categoryChange={this.updateCategory}
              data={tableData}
              headers={tableHeaders} />
            <Button onClick={this.handleRedirectImport} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Import New Data
            </Button>
            {this.getEditButton()}
            <Button onClick={this.handleAddTransaction} variant="contained" color="secondary" style={{ marginTop: '10px', marginLeft: '20px' }}>
             Add Transaction 
            </Button>
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