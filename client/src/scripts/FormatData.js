const categoryOptions = [
  { id: "Airfare", value: "Airfare" },
  { id: "Car Rental", value: "Car Rental" },
  { id: "Car Expense", value: "Car Expense" },
  { id: "Dining", value: "Dining" },
  { id: "Education", value: "Education" },
  { id: "Entertainment", value: "Entertainment" },
  { id: "Gas/Automotive", value: "Gas/Automotive" },
  { id: "Groceries", value: "Groceries" },
  { id: "Health Care", value: "Health Care" },
  { id: "Insurance", value: "Insurance" },
  { id: "Internet", value: "Internet" },
  { id: "Lodging", value: "Lodging" },
  { id: "Merchandise", value: "Merchandise" },
  { id: "Other", value: "Other" },
  { id: "Other Services", value: "Other Services" },
  { id: "Other Travel", value: "Other Travel" },
  { id: "Payment/Credit", value: "Payment/Credit" },
  { id: "Phone/Cable", value: "Phone/Cable" },
  { id: "Phone", value: "Phone" },
  { id: "Professional Services", value: "Professional Services" },
  { id: "Subscriptions", value: "Subscriptions" },
  { id: "TV/Cable", value: "TV/Cable" },
  { id: "Work Expense", value: "Work Expense" },
];


export const parseDate = (dateString) => {
  var year = '';
  var month = '';
  var day = '';

  //  yyyy-mm-dd format
  if (dateString[4] === '-') {
    year = Number(dateString.slice(0, 4));
    month = Number(dateString.slice(5, 7));
    day = Number(dateString.slice(8, 10));
  }

  //  mm/dd/yyy format
  else {
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
  }

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
      style: { width: 150, textAlign: 'left' },
      key: value,
      name: value,
      numeric: false,
      edit: false,
      filter: false,
    }
    if (value === "Category") {
      returnObject.theme = 'dropdown';
      returnObject.edit = true;
      returnObject.filter = true;
      returnObject.options = [{id: "All Categories", value: "All Categories"},...categoryOptions];
    }
    if (value === "Credit" || value === "Debit") {
      returnObject.numeric = true;
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

export const filterTable = (data, filterValue) => {
  let filteredData = data;
  if (filterValue !== "All Categories") {
    filteredData = data.filter((entry) => {
      return entry.Category === filterValue; 
    })
  }
  return filteredData;
}

//set pie graph data based on specified date range
export const setAnalysisData = (data, dateRange) => {
  var filteredData = data.filter((entry) => {
    const checkDate = entry["Transaction Date"];
    const minTimeCorrection = 24 * 3600000;
    if ((checkDate.getTime() + minTimeCorrection) <= dateRange[0]
      || (checkDate.getTime()) > dateRange[1]) {
      return false
    }
    else return true
  })

  const analysisData = filteredData.map((entry) => {
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
  return analysisData;
}

function sort2DArrayBySecond(a, b) {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] > b[1]) ? -1 : 1;
  }
}

export const groupCategories = (data) => {
  let graphValues = {};
  for (const index in data) {
    if (data[index]['Category'] in graphValues) {
      if (Number(data[index]['Debit']) > 0) {
        graphValues[data[index]['Category']] += Number(data[index]['Debit']);
      }
      else if (Number(data[index]['Credit']) > 0) {
        graphValues[data[index]['Category']] -= Number(data[index]['Credit']);
      }
    }
    else if (data[index]['Category'] !== "Payment/Credit") {
      if (Number(data[index]['Debit']) > 0) {
        graphValues[data[index]['Category']] = Number(data[index]['Debit']);
      }
      else if (Number(data[index]['Credit']) > 0) {
        graphValues[data[index]['Category']] = Number(data[index]['Credit'])*-1;
      }
    }
  }
  graphValues = Object.entries(graphValues);
  graphValues.sort(sort2DArrayBySecond);
  const graphData = graphValues.map((category) => {
    return { name: category[0], value: category[1] }
  })
  return graphData;
}

export const formatData = (data) => {
  const formattedData = data.map((entry, index) => {
    var newPostDate = {};
    var newTransactionDate = {};
    const postedDateObj = parseDate(entry["Posted Date"]);
    const transactionDateObj = parseDate(entry["Transaction Date"]);
    newPostDate = new Date(Date.UTC(postedDateObj.year, (postedDateObj.month - 1), postedDateObj.day));
    newTransactionDate = new Date(Date.UTC(transactionDateObj.year, (transactionDateObj.month - 1), transactionDateObj.day));
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