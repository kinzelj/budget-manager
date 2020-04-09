import React from 'react';
import { useSelector } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import * as FormatData from '../scripts/FormatData.js';

import DataTable from './DataTable.js';
import Loader from './Loader.js';

const useStyles = makeStyles(theme => ({
  cellSelect: {
    width: '100px',
    marginLeft: '5px',
  },
  dataTable: {
    maxWidth: '730px',
  },
  budgetDiv: {
    margin: 'auto'
  },
}));
export default function Home() {
  const classes = useStyles();
  const state = useSelector(state => state);

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
  const [tableData, setTableData] = React.useState([""]);
  const [tableHeaders, setTableHeaders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (state.data[0]) {
      setFormattedData(FormatData.formatData(state.data));
    }
  }, [state]);

  React.useEffect(() => {
    setDateRange(getDateRange(year, month));
  }, [year, month]);

  React.useEffect(() => {
    if (formattedData[0]) {
      setTableData(FormatData.setTableData(formattedData, dateRange));
    }
  }, [formattedData, dateRange]);

  React.useEffect(() => {
    setTableHeaders(FormatData.getHeaders(tableData));
  }, [tableData]);

  React.useEffect(() => {
    // console.log(tableHeaders);
    // if (tableHeaders[0]) {
    setLoading(false);
    // }
  }, [tableHeaders]);



  const dateDropdown = (type) => {
    //set default dropdown value
    let value = "";
    if (type === "year") {
      value = year;
    }
    if (type === "month") {
      value = month;
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
      <select
        className={classes.cellSelect}
        key={`select-${type}`}
        value={value}
        onChange={(e) => { handleSelectChange(e, type) }}
      >{getOptions(type)}</select>
    )
  }

  const handleSelectChange = (event, type) => {
    if (type === "year") {
      setYear(event.target.value);
    }
    if (type === "month") {
      setMonth(event.target.value);
    }
  }

  if (loading) {
    return (<div>
      <div>
        {dateDropdown("year")}
      </div>
      <div>
        {dateDropdown("month")}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Loader />
      </div>
    </div>);
  }
  else {
    return (
      <div className={classes.budgetDiv}>
        <div>
          {dateDropdown("year")}
        </div>
        <div>
          {dateDropdown("month")}
        </div>
        <div className={classes.dataTable}>
          <DataTable
            data={tableData}
            headers={tableHeaders} />
        </div>
      </div>
    );
  }
}