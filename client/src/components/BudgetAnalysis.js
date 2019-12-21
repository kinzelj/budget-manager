import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './PieChart.js'
import Slider from './Slider.js'
import * as FormatData from '../scripts/FormatData.js';

class BudgetAnalysis extends Component {
  constructor(props) {
    super(props);
    this.formattedData = FormatData.formatData(this.props.data);
    this.dateRange = FormatData.getMinMaxDate(this.formattedData);
    this.sliderInit = [new Date((new Date()).getTime() - (86400000 * 30)), new Date()]; //start with last 30 days
    this.analysisDataStart = FormatData.setAnalysisData(this.formattedData, this.sliderInit);
    this.graphDataStart = FormatData.groupCategories(this.analysisDataStart); 
    console.log(this.graphDataStart);
    this.state = {
      sliderInit: this.sliderInit,
      dateRange: this.dateRange,
      loading: false,
      analysisData: this.analysisDataStart,
      graphData: this.graphDataStart,
    }
  }

  handleDateUpdate = (dateRange) => {
    this.setState({ loading: true });
    this.setState({
    }, () => { this.setState({ loading: false }) });
  }

  render() {
    const {
      dateRange,
      loading,
      sliderInit,
      graphData
    } = this.state
    return (
      <div style={{ width: '50%' }}>
        <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Analysis"} sliderInit={sliderInit} />
        <PieChart data={graphData} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { data: state.data }
}
export default connect(mapStateToProps)(BudgetAnalysis)