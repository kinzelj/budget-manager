export const parseDate = (dateString) => {
  var year = '';
  var month = '';
  var day = '';

  //get month
  var index = 0;
  var checkChar = dateString[index];
  while (checkChar !== '/') {
    month += checkChar;
    index += 1;
    checkChar = dateString[index];
  }
  month = Number(month);

  //get day
  index += 1;
  checkChar = dateString[index];
  while (checkChar !== '/') {
    day += checkChar;
    index += 1;
    checkChar = dateString[index];
  }
  day = Number(day);

  //get year
  index += 1;
  year = Number(dateString.slice(index, index + 4));

  //set return object
  const returnObj = {
    year: year,
    month: month,
    day: day
  }
  return returnObj;
}

export const getHeaders = (data) => {
  var headers = Object.keys(data[0]);
  headers = headers.filter((value) => {
    if (value === "Card No." || value === "Posted Date" || value === "_id" || value === "__v") {
      return false;
    }
    return true;
  });

  const headersObject = headers.map((value, index) => {
    var returnObject = {
      style: {width: 150, textAlign: 'left'},
      key: value,
      name: value,
      numeric: false,
    }
    if (value === "Category") {
      returnObject.theme = 'dropdown';
    }
    if (value === "Credit" || value === "Debit") {
      returnObject.theme = 'currency';
      returnObject.style.width = 75;
    }
    if (value === "Description") {
      returnObject.style.width = 300;
      returnObject.style.textAlign = 'left';
    }
    return returnObject;
  })
  return headersObject;

}

//get min and max dates of data passed to function
export const getMinMaxDate = (data) => {
  var minDate = new Date();
  var maxDate = new Date();
  data.map((entry, index) => {
    if (index === 0) {
      minDate = entry["Transaction Date"];
      maxDate = entry["Transaction Date"];
    }
    else if (entry["Transaction Date"] < minDate) { minDate = entry["Transaction Date"] }
    else if (entry["Transaction Date"] > maxDate) { maxDate = entry["Transaction Date"] }
    return null;
  })
  return ([minDate, maxDate]);
}


export const getTextDate = (date) => {
  const monthNum = Number(date.getUTCMonth()) + 1
  var monthText = monthNum.toString();
  if (monthNum < 10) {
    monthText = "0" + monthText;
  }

  const dayNum = Number(date.getUTCDate());
  var dayText = dayNum.toString();
  if (dayNum < 10) {
    dayText = "0" + dayText;
  }

  const textDate = monthText + "-" + dayText + '-' + date.getUTCFullYear();
  return textDate;
}

//set table data based on specified date range
export const setTableData = (data, dateRange) => {
  var filteredData = data.filter((entry) => {
    const checkDate = entry["Transaction Date"];
    const minTimeCorrection = 24 * 3600000;
    if ((checkDate.getTime() + minTimeCorrection) <= dateRange[0]
      || (checkDate.getTime()) > dateRange[1]) {
      return false
    }
    else return true
  })

  const tableData = filteredData.map((entry) => {
    return {
      id: entry.id,
      Category: entry.Category,
      Credit: Number(entry.Credit).toFixed(2),
      Debit: Number(entry.Debit).toFixed(2),
      Description: entry.Description,
      "Posted Date": getTextDate(entry["Posted Date"]),
      "Transaction Date": getTextDate(entry["Transaction Date"])
    }
  })
  return tableData;
}

export const formatData = (data, mount) => {
  const formattedData = data.map((entry, index) => {
    var newPostDate = {};
    var newTransactionDate = {};
    if (mount) {
      newPostDate = new Date(entry["Posted Date"]);
      newTransactionDate = new Date(entry["Transaction Date"]);
    }
    else {
      const postedDateObj = parseDate(entry["Posted Date"]);
      const transactionDateObj = parseDate(entry["Transaction Date"]);
      newPostDate = new Date(Date.UTC(postedDateObj.year, (postedDateObj.month - 1), postedDateObj.day));
      newTransactionDate = new Date(Date.UTC(transactionDateObj.year, (transactionDateObj.month - 1), transactionDateObj.day));
    }
    return {
      id: entry._id,
      Category: entry.Category,
      Credit: Number(entry.Credit).toFixed(2),
      Debit: Number(entry.Debit).toFixed(2),
      Description: entry.Description,
      "Posted Date": newPostDate,
      "Transaction Date": newTransactionDate,
    }
  })
  return formattedData;
}