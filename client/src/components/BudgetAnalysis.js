import React, {Component} from 'react';
import PieChart from './PieChart.js'
import Slider from './Slider.js'

const data = [
  {
    "name": "Group A",
    "value": 400
  },
  {
    "name": "Group B",
    "value": 350
  },
  {
    "name": "Group C",
    "value": 300
  },
  {
    "name": "Group D",
    "value": 278
  },
  {
    "name": "Group E",
    "value": 200
  },
  {
    "name": "Group F",
    "value": 189
  },
  {
    "name": "Group G",
    "value": 89
  },
  {
    "name": "Group H",
    "value": 19
  }
];

export default class BudgetAnalysis extends Component {
  state = {
    dateRange: [new Date(0), new Date()],
    loading: false,
    sliderInit: [new Date((new Date()).getTime()-(86400000 * 30)), new Date()], //start with last 30 days
//     sliderInit: [new Date((new Date()).getDate()-(86400000 * 30)), new Date()], //start with last 30 days
  }

	handleDateUpdate = (dateRange) => {
    this.setState({ loading: true });
    this.setState({
//       tableData: FormatData.setTableData(this.state.data, dateRange.value),
    }, () => { this.setState({ loading: false }) });
  }

  render() {
    const {
      dateRange,
      loading,
      sliderInit
    } = this.state
    
    return(
      <div style={{width: '50%'}}>
        <Slider handleUpdate={this.handleDateUpdate} dateRange={dateRange} buttonText={"Update Analysis"} sliderInit={sliderInit} />
        <PieChart data={data}/>
      </div>
    );
  }
}