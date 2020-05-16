import React from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import * as FormatData from '../scripts/FormatData.js';

import '../css/Home.css'
import DataTable from './DataTable.js';
import Loader from './Loader.js';
import BarChart from './BarChart.js';
import LineGraph from './LineGraph.js';


const maxTableHeight = 425;
const useStyles = makeStyles(theme => ({
  cellSelect: {
    width: '100px',
  },
  contentDiv: {
    width: '100%',
    marginTop: '-10px',
  },
  timeFrame: {
    maxWidth: '200px',
    marginBottom: '28px !important',
    marginLeft: '-14px !important',
  },
  tableStyle: {
    minWidth: '730px',
    minHeight: '500px'
  },
  graphStyle: {
    width: '100%',
    minWidth: '730px',
  },
  lineGraphStyle: {
    minHeight: '500px'
  },
  columnTable: {
    padding: '0 !important',
    paddingBottom: '0 !important'

  },
  columnLineGraph: {
    paddingRight: '0 !important'
  }
}));

export default function Home() {
  const classes = useStyles();
  const state = useSelector(state => state);
  const data = state.data;
  const user_settings = state.settings;


  const getDateRange = (year, month) => {
    let date = [];
    if (Number(month) === 0) {
      date = [new Date(year, 0, 1), new Date(year, 12, 0)];
    }
    else {
      date = [new Date(year, month - 1, 1), new Date(year, month, 0)];
    }
    return date;
  }

  //get array of selectable years and months
  const years = FormatData.years;
  const months = FormatData.months;

  //define state variables
  const currentMonth = new Date().getMonth();
  const [year, setYear] = React.useState(years[years.length - 1].yearNum);
  const [month, setMonth] = React.useState(months[currentMonth + 1].monthNum);
  const [dateRange, setDateRange] = React.useState(getDateRange(year, month));

  //set analysis data
  const [formattedData, setFormattedData] = React.useState([""]);
  const [settings, setSettings] = React.useState({});
  const [tableData, setTableData] = React.useState([""]);
  const [tableHeaders, setTableHeaders] = React.useState([""]);
  const [barChartData, setBudgetBarChartData] = React.useState([""])
  const [lineGraphData, setLineGraphData] = React.useState({ data: [""], sources: [""] })
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    if (data[0]) {
      setFormattedData(FormatData.formatData(data));
    }
    if (user_settings.user_id) {
      setSettings(user_settings.settings);
    }
  }, [data, user_settings]);

  React.useEffect(() => {
    setLoading(true);
    setLineGraphData(null);
    setDateRange(getDateRange(year, month));
  }, [year, month]);

  React.useEffect(() => {
    if (formattedData[0]) {
      setTableData(FormatData.setTableData(formattedData, dateRange));
    }
  }, [formattedData, dateRange]);

  React.useEffect(() => {
    setTableHeaders(FormatData.getHeaders(tableData));
    setBudgetBarChartData(FormatData.getBudgetBarData(tableData, settings, month));
    setLineGraphData(FormatData.getLineGraphData(tableData, settings, dateRange));
  }, [tableData, settings, month, dateRange]);

  React.useEffect(() => {
    if (lineGraphData) {
      setLoading(false);
    }
  }, [lineGraphData]);

  const dateDropdown = (type) => {
    //set default dropdown value
    let value = "";
    let label = "";
    let labelStyle = {};
    if (type === "year") {
      value = year;
      label = "Year: ";
      labelStyle = { marginRight: '11px' };
    }
    if (type === "month") {
      value = month;
      label = "Month: ";
      labelStyle = { marginRight: '0px' };
    }

    //get dropdown options
    const getOptions = (type) => {
      let optionsJSX = [];
      if (type === "year") {
        optionsJSX = years.map((year) => {
          return (
            <option key={year.yearNum} value={year.yearNum}>{year.yearString}</option>
          )
        })
        return optionsJSX;
      }
      if (type === "month") {
        optionsJSX = months.map((month) => {
          return (
            <option key={month.monthNum} value={month.monthNum}>{month.monthString}</option>
          )
        })
      }
      return optionsJSX;
    }

    //return select dropdown
    return (
      <div>
        <label style={labelStyle}>{label}</label>
        <select
          className={classes.cellSelect}
          key={`select-${type}`}
          value={value}
          onChange={(e) => { handleSelectChange(e, type) }}
        >{getOptions(type)}</select>
      </div>
    )
  }

  const handleSelectChange = (event, type) => {
    setLoading(true);
    if (type === "year") {
      setYear(event.target.value);
    }
    if (type === "month") {
      setMonth(event.target.value);
    }
  }

  if (loading) {
    return (<div>
      <div className={'ui segment ' + classes.timeFrame}>
        <h4>Budget Time Frame</h4>
        <div>
          {dateDropdown("year")}
        </div>
        <div>
          {dateDropdown("month")}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Loader />
      </div>
    </div>);
  }
  else {
    return (
      <div className={classes.contentDiv}>
        <div className={'ui segment ' + classes.timeFrame}>
          <h4>Budget Time Frame</h4>
          <div>
            {dateDropdown("year")}
          </div>
          <div>
            {dateDropdown("month")}
          </div>
        </div>
        <div className='ui stackable two column grid'>
          <div className="two column row" style={{ paddingTop: '0' }}>
            <div className={'column ' + classes.columnTable}>
              <div className={'ui segment ' + classes.tableStyle}>
                <DataTable
                  data={tableData}
                  headers={tableHeaders}
                  maxHeight={maxTableHeight} />
              </div>
            </div>
            <div className={'column ' + classes.columnLineGraph}>
              <div className={'ui segment ' + classes.lineGraphStyle}>
                <LineGraph dataSource={lineGraphData} />
              </div>
            </div>
          </div>
        </div>
        <div className="ui grid">
          <div className={'ui segment ' + classes.graphStyle}>
            <div className="column bar-graph">
              <BarChart data={barChartData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}