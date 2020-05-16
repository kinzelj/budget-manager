import { CommonSeriesSettings } from "devextreme-react/chart";

const monthlyTypes = [
  // "savings",
  // "housing",
  // "utilities",
  "phone",
  "internet",
  "tv",
  "groceries",
  "gas",
  "dining",
  "merchandise",
  "entertainment",
  "transportation",
  "personal",
  "subscriptions",
]

const categoryOptions = [
  { id: "Airfare", value: "Airfare", type: "vacation" },
  { id: "Car Rental", value: "Car Rental", type: "transportation" },
  { id: "Car Expense", value: "Car Expense", type: "car_expense" },
  { id: "Dining", value: "Dining", type: "dining" },
  { id: "Donation", value: "Donation", type: "donation" },
  { id: "Education", value: "Education", type: "other" },
  { id: "Entertainment", value: "Entertainment", type: "entertainment" },
  { id: "Fee/Interest Charge", value: "Fee/Interest Charge", type: "other" },
  { id: "Gas/Automotive", value: "Gas/Automotive", type: "gas" },
  { id: "Groceries", value: "Groceries", type: "groceries" },
  { id: "Health Care", value: "Health Care", type: "health" },
  { id: "Car Insurance", value: "Car Insurance", type: "car_insurance" },
  { id: "Home Insurance", value: "Home Insurance", type: "home_insurance" },
  { id: "Insurance", value: "Insurance", type: "home_insurance" },
  { id: "Internet", value: "Internet", type: "internet" },
  { id: "Lodging", value: "Lodging", type: "other" },
  { id: "Merchandise", value: "Merchandise", type: "merchandise" },
  { id: "Other", value: "Other", type: "other" },
  { id: "Other Services", value: "Other Services", type: "other" },
  { id: "Other Travel", value: "Other Travel", type: "transportation" },
  { id: "Payment/Credit", value: "Payment/Credit", type: "payment" },
  { id: "Phone/Cable", value: "Phone/Cable", type: "phone/cable" },
  { id: "Phone", value: "Phone", type: "phone" },
  { id: "Professional Services", value: "Professional Services", type: "personal" },
  { id: "Subscriptions", value: "Subscriptions", type: "subscriptions" },
  { id: "TV/Cable", value: "TV/Cable", type: "tv" },
  { id: "Work Expense", value: "Work Expense", type: "work" },
  { id: "Vacation", value: "Vacation", type: "vacation" },
];

export const months = [
  { monthNum: 0, monthString: "Full Year" },
  { monthNum: 1, monthString: "January" },
  { monthNum: 2, monthString: "February" },
  { monthNum: 3, monthString: "March" },
  { monthNum: 4, monthString: "April" },
  { monthNum: 5, monthString: "May" },
  { monthNum: 6, monthString: "June" },
  { monthNum: 7, monthString: "July" },
  { monthNum: 8, monthString: "August" },
  { monthNum: 9, monthString: "September" },
  { monthNum: 10, monthString: "October" },
  { monthNum: 11, monthString: "November" },
  { monthNum: 12, monthString: "December" },
];

export const years = [
  { yearNum: 2019, yearString: "2019" },
  { yearNum: 2020, yearString: "2020" },
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

//filter data by date range
const filterData = (data, dateRange) => {
  var filteredData = data.filter((entry) => {
    const checkDate = entry["Transaction Date"];
    const minTimeCorrection = 24 * 3600000;
    if ((checkDate.getTime() + minTimeCorrection) <= dateRange[0]
      || (checkDate.getTime()) > dateRange[1]) {
      return false
    }
    else return true
  })
  return filteredData;
}

//set table data based on specified date range
export const setTableData = (data, dateRange) => {
  var filteredData = filterData(data, dateRange);
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
  var filteredData = filterData(data, dateRange);
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

const getBarData = (data, type) => {
  let sum = 0;
  for (let entry of data) {
    const categoryIndex = categoryOptions.findIndex(obj => obj.value === entry.Category);
    const categoryObject = categoryOptions[categoryIndex];
    if (categoryObject) {
      const categoryType = categoryObject['type']
      if (categoryType === type) {
        let addExpense = 0;
        if (categoryType === "payment") {
          addExpense = entry['Credit'];
        }
        else { addExpense = entry['Debit'] }
        sum = sum + Number(addExpense);
      }
    }
  }
  return sum;

}

export const getBudgetBarData = (data, settings, month) => {
  const yearlyExpenses = settings.home_insurance + settings.property_taxes + settings.car_insurance + settings.car_expenses
    + settings.vacation + settings.gifts + settings.donations + settings.health + settings.other;
  let netMonthlyIncome = settings.income - (yearlyExpenses / 12);
  if (Number(month) === 0) { netMonthlyIncome = netMonthlyIncome * 12; }
  let barChartData = [
    // {
    //   expense: 'Morgage/Rent',
    //   budget: netMonthlyIncome * (settings.housing / 100),
    //   actual: getBarData(data, "housing")
    // },
    {
      expense: 'Groceries',
      budget: netMonthlyIncome * (settings.groceries / 100),
      actual: getBarData(data, "groceries")
    },
    {
      expense: 'Dining',
      budget: netMonthlyIncome * (settings.dining / 100),
      actual: getBarData(data, "dining")
    },
    {
      expense: 'Gasoline',
      budget: netMonthlyIncome * (settings.gas / 100),
      actual: getBarData(data, "gas")
    },
    {
      expense: 'Utilities',
      budget: netMonthlyIncome * (settings.utilities / 100),
      actual: getBarData(data, "utilities")
    },
    {
      expense: 'Phone',
      budget: netMonthlyIncome * (settings.phone / 100),
      actual: getBarData(data, "phone")
    },
    {
      expense: 'Internet',
      budget: netMonthlyIncome * (settings.internet / 100),
      actual: getBarData(data, "internet")
    },
    {
      expense: 'TV',
      budget: netMonthlyIncome * (settings.tv / 100),
      actual: getBarData(data, "tv")
    },
    {
      expense: 'Merchandise',
      budget: netMonthlyIncome * (settings.merchandise / 100),
      actual: getBarData(data, "merchandise")
    },
    {
      expense: 'Entertainment',
      budget: netMonthlyIncome * (settings.entertainment / 100),
      actual: getBarData(data, "entertainment")
    },
    {
      expense: 'Transportation',
      budget: netMonthlyIncome * (settings.transportation / 100),
      actual: getBarData(data, "transportation")
    },
    {
      expense: 'Personal',
      budget: netMonthlyIncome * (settings.personal / 100),
      actual: getBarData(data, "personal")
    },
    {
      expense: 'Subscriptions',
      budget: netMonthlyIncome * (settings.subscriptions / 100),
      actual: getBarData(data, "subscriptions")
    },
  ];

  return barChartData;
}

function roundUp(num, precision) {
  precision = Math.pow(10, precision)
  return Math.ceil(num * precision) / precision
}

const getLineData = (data, dateRange, monthlyWithoutFixed) => {
  console.log(monthlyWithoutFixed);
  const totalTime = dateRange[1] - dateRange[0];
  console.log(dateRange);
  console.log(totalTime);
  let increment = 86400000;
  let numDays = roundUp(totalTime / increment, 0);
  console.log(numDays);
  let x_axis = numDays;
  let year_factor = 1;

  // let startingBudget = totalMonthly * (settings.housing / 100);
  let startingBudget = 0;

  //if full year selected
  if (numDays > 30) {
    increment = increment * (365 / 12);
    startingBudget = startingBudget * 12;
    x_axis = 12;
    year_factor = 365;
  }

  let expenseIncrement = (monthlyWithoutFixed - startingBudget) / (numDays);



  let dataArray = [];
  let excluded = [];
  for (let i = 1; i <= x_axis + 1; i++) {
    let expenseSum = 0;
    for (let j = 0; j < data.length; j++) {
      if (data[j]["Transaction Date"] <= (dateRange[0].getTime() + ((i - 1) * increment))) {
        if (numDays < 31) {
          if (monthlyTypes.includes(data[j].type)) {
            if (Number(data[j].debit) > 0) {
              expenseSum += Number(data[j].debit);
            }
            if (Number(data[j].credit) > 0) {
              expenseSum -= Number(data[j].credit);
            }
          }
          else {
            if (!excluded.includes(data[j])) {
              excluded.push(data[j]);
            }
          }
        }

        else if (data[j].type !== "payment") {
          if (Number(data[j].debit) > 0) {
            expenseSum += Number(data[j].debit);
          }
          if (Number(data[j].credit) > 0) {
            expenseSum -= Number(data[j].credit);
          }
        }

        else {
          if (!excluded.includes(data[j])) {
            excluded.push(data[j]);
          }
        }
      }
    }

    const date = new Date(dateRange[0].getTime() + ((i - 1) * increment));
    const stringDate = `${date.getMonth() + 1}/${date.getDate()}`
    if (date.getTime() > new Date().getTime()) {
      dataArray[i - 1] = {
        time: stringDate,
        budget: startingBudget + expenseIncrement * (i - 1) * year_factor,
      }
    }
    else {
      dataArray[i - 1] = {
        time: stringDate,
        budget: startingBudget + expenseIncrement * (i - 1) * year_factor,
        actual: expenseSum
      }
    }
  }
  console.log("excluded:");
  console.log(excluded);


  return dataArray;
};

export const getLineGraphData = (data, settings, dateRange) => {
  const totalTime = dateRange[1] - dateRange[0];
  let increment = 86400000;
  let numDays = totalTime / increment;

  //calculate yearly expenses and subtract 1/12 from monthly income 
  const yearlyExpenses = settings.home_insurance + settings.property_taxes + settings.car_insurance + settings.car_expenses
    + settings.vacation + settings.gifts + settings.donations + settings.health + settings.other;

  const totalMonthly = settings.income - (yearlyExpenses / 12);
  let monthlyWithoutFixed = totalMonthly - (totalMonthly * settings.savings / 100) - (totalMonthly * settings.housing / 100) - (totalMonthly * settings.utilities / 100);
  if (numDays > 30) {
    monthlyWithoutFixed += (yearlyExpenses / 12);
  }

  let lineData = {
    sources: [
      { value: 'budget', name: 'BUDGET' },
      { value: 'actual', name: 'ACTUAL' },
    ],
    data: [{
      time: 0,
      budget: 0,
      actual: 0
    }]
  }

  if (data[1]) {
    const analysisData = data.map((entry) => {
      const categoryIndex = categoryOptions.findIndex(obj => obj.value === entry.Category);
      const categoryObject = categoryOptions[categoryIndex];
      const categoryType = categoryObject['type']
      return {
        "Transaction Date": new Date(entry["Transaction Date"]),
        credit: entry.Credit,
        debit: entry.Debit,
        type: categoryType
      };
    })

    lineData = {
      sources: [
        { value: 'budget', name: 'BUDGET', color: "#3f51b5" },
        { value: 'actual', name: 'ACTUAL', color: "#f50057" },
      ],
      data: getLineData(analysisData, dateRange, monthlyWithoutFixed)
    };
  }


  return lineData;
}