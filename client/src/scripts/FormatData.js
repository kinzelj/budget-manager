const categoryOptions = [
  { id: "Airfare", value: "Airfare" },
  { id: "Car Rental", value: "Car Rental" },
  { id: "Car Expense", value: "Car Expense" },
  { id: "Dining", value: "Dining" },
  { id: "Donation", value: "Donation" },
  { id: "Education", value: "Education" },
  { id: "Entertainment", value: "Entertainment" },
  { id: "Fee/Interest Charge", value: "Fee/Interest Charge" },
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

export const months = [
  {monthNum: 0, monthString: "Full Year"},
  {monthNum: 1, monthString: "January"},
  {monthNum: 2, monthString: "February"},
  {monthNum: 3, monthString: "March"},
  {monthNum: 4, monthString: "April"},
  {monthNum: 5, monthString: "May"},
  {monthNum: 6, monthString: "June"},
  {monthNum: 7, monthString: "July"},
  {monthNum: 8, monthString: "August"},
  {monthNum: 9, monthString: "September"},
  {monthNum: 10, monthString: "October"},
  {monthNum: 11, monthString: "November"},
  {monthNum: 12, monthString: "December"},
];

export const years = [
  {yearNum: 2019, yearString: "2019"},
  {yearNum: 2020, yearString: "2020"},
]


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
  if (data[0]) {
    var headers = Object.keys(data[0]);
    headers = headers.filter((value) => {
      if (value === "Posted Date" || value === "id" || value === "Card No.") {
        return false;
      }
      return true;
    });

    var descriptionOptions = [];
    for (const index in data) {
      if (!(descriptionOptions.includes(data[index]['Description']))) {
        descriptionOptions.push(data[index]['Description']);
      }
    }

    descriptionOptions.sort();

    const descriptionObjectArray = descriptionOptions.map((description) => {
      return { id: description, value: description }
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
        returnObject.className = 'category';
        returnObject.theme = 'dropdown';
        returnObject.edit = true;
        returnObject.filter = true;
        returnObject.options = [{ id: "All Categories", value: "All Categories" }, ...categoryOptions];
      }
      if (value === "Credit" || value === "Debit") {
        returnObject.numeric = true;
        returnObject.theme = 'currency';
        returnObject.style.width = 75;
      }
      if (value === "Description") {
        returnObject.className = 'description';
        returnObject.style.width = 300;
        returnObject.style.textAlign = 'left';
        returnObject.filter = true;
        returnObject.options = [{ id: "All Descriptions", value: "All Descriptions" }, ...descriptionObjectArray];
      }
      return returnObject;
    })
    return headersObject;
  }
  else return [""];
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
      "Transaction Date": getTextDate(entry["Transaction Date"]),
      "Posted Date": getTextDate(entry["Posted Date"]),
      Category: entry.Category,
      Description: entry.Description,
      Credit: Number(entry.Credit).toFixed(2),
      Debit: Number(entry.Debit).toFixed(2),
    }
  })
  return tableData;
}

export const filterCategories = (data, filterValue) => {
  let filteredData = data;
  if (filterValue !== "All Categories") {
    filteredData = data.filter((entry) => {
      return entry.Category === filterValue;
    })
  }
  return filteredData;
}
export const filterDescriptions = (data, filterValue) => {
  let filteredData = data;
  if (filterValue !== "All Descriptions") {
    filteredData = data.filter((entry) => {
      return entry.Description === filterValue;
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
      "Transaction Date": getTextDate(entry["Transaction Date"]),
      "Posted Date": getTextDate(entry["Posted Date"]),
      Category: entry.Category,
      Description: entry.Description,
      Credit: Number(entry.Credit).toFixed(2),
      Debit: Number(entry.Debit).toFixed(2),
    }
  })
  return analysisData;
}

export const sortCategoryCosts = (a, b) => {
  if (a[1] === b[1]) {
    return 0;
  }
  else {
    return (a[1] > b[1]) ? -1 : 1;
  }
}

export const sortTableCosts = (a, b) => {
  if (Number(a['Debit']) === Number(b['Debit'])) {
    return 0;
  }
  else {
    return (Number(a['Debit']) > Number(b['Debit'])) ? -1 : 1;
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
        graphValues[data[index]['Category']] = Number(data[index]['Credit']) * -1;
      }
    }
  }
  graphValues = Object.entries(graphValues);
  graphValues.sort(sortCategoryCosts);
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
      "Transaction Date": newTransactionDate,
      "Posted Date": newPostDate,
      Category: entry.Category,
      Description: entry.Description,
      Credit: Number(entry.Credit).toFixed(2),
      Debit: Number(entry.Debit).toFixed(2),
    }
  })
  return formattedData;
}