import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './PieChart.js'
import Slider from './Slider.js'
import '../css/BudgetAnalysis.css'
import * as FormatData from '../scripts/FormatData.js';

const columnStyle = () => ({
  graphStyle: {
    // width: 650,
    // minWidth: 650,
    height: 600,
  },
  tableStyle: {
    height: 600,
    // width: '100%',
  }
})

class BudgetAnalysis extends Component {
  constructor(props) {
    super(props);
    this.tableStart = 30 //number of days to show as default table date range
    this.colStyle = columnStyle();
    this.formattedData = FormatData.formatData(this.props.data);
    this.dateRange = FormatData.getMinMaxDate(this.formattedData);
    this.sliderInit = [new Date((new Date()).getTime() - (86400000 * this.tableStart)), new Date()];
    this.analysisDataStart = FormatData.setAnalysisData(this.formattedData, this.sliderInit);
    this.graphDataStart = FormatData.groupCategories(this.analysisDataStart);
    this.state = {
      sliderInit: this.sliderInit,
      dateRange: this.dateRange,
      analysisData: this.analysisDataStart,
      graphData: this.graphDataStart,
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
    }, () => { this.setState({ loading: false }) });
  }

  render() {
    const {
      dateRange,
      sliderInit,
      graphData
    } = this.state
    const graphStyle = this.colStyle.graphStyle;
    const tableStyle = this.colStyle.tableStyle;
    return (
      <div className='ui stackable two column grid first-row'>
        <div className="six wide column column-graph">
          <div className="ui segment" style={graphStyle}>
            <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Analysis"} sliderInit={sliderInit} />
            <h2 style={{ color: '#3f51b5', position: 'absolute', width: 600, textAlign: 'center', paddingTop: '20px' }}>Expenses by Category</h2>
            <PieChart minWidth={650} data={graphData} />
          </div>
        </div>
        <div className="nine wide column column-table" >
          <div className="ui segment" style={tableStyle}>
            <div>TABLE</div>
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