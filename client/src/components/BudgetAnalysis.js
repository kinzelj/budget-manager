import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './PieChart.js'
import Slider from './Slider.js'
import DataTable from './DataTable.js';
import '../css/BudgetAnalysis.css'
import * as FormatData from '../scripts/FormatData.js';

const columnStyle = () => ({
  graphStyle: {
    height: 600,
  },
  tableStyle: {
    height: 600,
  }
})

class BudgetAnalysis extends Component {
  constructor(props) {
    super(props);
    this.tableStart = 30 //number of days to show as default table date range
    this.colStyle = columnStyle();
    this.sliderInit = [new Date((new Date()).getTime() - (86400000 * this.tableStart)), new Date()];
    this.formattedData = FormatData.formatData(this.props.data);
    this.analysisDataStart = FormatData.setAnalysisData(this.formattedData, this.sliderInit);
    this.graphDataStart = FormatData.groupCategories(this.analysisDataStart);
    this.state = {
      sliderInit: this.sliderInit,
      dateRange: FormatData.getMinMaxDate(this.formattedData),
      analysisData: this.analysisDataStart,
      graphData: this.graphDataStart,
      tableHeaders: FormatData.getHeaders(this.props.data),
      tableData: this.analysisDataStart,
    }
  }

  handleDateUpdate = (dateRange) => {
    const newDate = [new Date(dateRange.value[0]), new Date(dateRange.value[1])];
    const newData = FormatData.setAnalysisData(this.formattedData, newDate);
    const newGraph = FormatData.groupCategories(newData);
    this.setState({ graphData: [], loading: true });
    this.setState({
      analysisData: newData,
      graphData: newGraph,
      tableData: newData,
    }, () => { this.setState({ loading: false }) });
  }

  handleCategoryFilter = (filterCategory) => {
    const filteredTable = FormatData.filterTable(this.state.analysisData, filterCategory);
    this.setState({tableData: filteredTable.sort(FormatData.sortTableCosts)});
  }

  render() {
    const {
      dateRange,
      sliderInit,
      graphData,
      tableData,
      tableHeaders,
    } = this.state
    const graphStyle = this.colStyle.graphStyle;
    const tableStyle = this.colStyle.tableStyle;
    return (
      <div className='ui stackable two column grid first-row'>
        <div className="six wide column column-graph">
          <div className="ui segment" style={graphStyle}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Analysis"} sliderInit={sliderInit} />
            <h2 style={{ color: '#3f51b5', position: 'absolute', width: 600, textAlign: 'center', paddingTop: '20px' }}>Expenses by Category</h2>
            <PieChart handleClick={this.handleCategoryFilter} minWidth={650} data={graphData} />
          </div>
        </div>
        <div className="nine wide column column-table" >
          <div className="ui segment" style={tableStyle}>
            <DataTable
              className='analysis-table'
              data={tableData}
              headers={tableHeaders} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.data }
}
export default connect(mapStateToProps)(BudgetAnalysis)