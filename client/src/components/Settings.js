import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Popup from './Popup.js';

import * as ServerRoutes from '../routes/ServerRoutes.js';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings } from '../redux/actions.js';

const useStyles = makeStyles(theme => ({
  rootForm: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  div: {
    border: "solid #9e9e9e 1px",
    borderRadius: "4px",
    marginRight: "15px",
    minWidth: "237px"
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    marginBottom: "15px"
  },
  button: {
    marginLeft: '4px'
  },
  h4: {
    marginLeft: '6px',
    marginBottom: '5px'
  },
  box: {
    backgroundColor: "white"
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: '25ch',
  },
  title: {
    color: 'black',
  },
}));

export default function InputAdornments() {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings);

  const classes = useStyles();
  const [values, setValues] = React.useState({
    //monthly income
    income: settings.income,

    //yearly expenses
    vacation: settings.vacation,
    car_expenses: settings.car_expenses,
    car_insurance: settings.car_insurance,
    home_insurance: settings.home_insurance,
    property_taxes: settings.property_taxes,
    gifts: settings.gifts,
    donations: settings.donations,
    other_yearly: settings.other_yearly,

    //savings
    savings: settings.savings,

    //monthly % of budget, must sum to 100%
    housing: settings.housing,
    utilities: settings.utilities,
    phone: settings.phone,
    internet: settings.internet,
    tv: settings.tv,
    groceries: settings.groceries,
    gas: settings.gas,
    dining: settings.dining,
    merchandise: settings.merchandise,
    entertainment: settings.entertainment,
    transportation: settings.transportation,
    personal: settings.personal,
    subscriptions: settings.subscriptions,
    other_monthly: settings.other_monthly,
  });

  //
  const sumPercent = (values) => {
    return values.savings + values.housing + values.utilities
      + values.phone + values.internet + values.tv
      + values.groceries + values.gas + values.dining
      + values.merchandise + values.entertainment + values.subscriptions
      + values.transportation + values.personal + values.other_monthly;
  }
  const [budget_percent_sum, setPercentSum] = React.useState(sumPercent(values));
  React.useEffect(() => {
    setPercentSum(sumPercent(values), [])
  }, [values])

  //
  const calcAvailIncome = (values) => {
    const yearlyCosts = values.vacation + values.car_expenses
      + values.car_insurance + values.home_insurance
      + values.property_taxes + values.gifts + values.donations
      + values.other_yearly;
    return (values.income - (yearlyCosts / 12));
  }
  const [availableIncome, setAvailIncome] = React.useState(calcAvailIncome(values));
  React.useEffect(() => {
    setAvailIncome(calcAvailIncome(values), [])
  }, [values])


  const [showPopup, setShowPopup] = React.useState(false);
  const [popupMessage, setPopupMessage] = React.useState("Error: No settings changed or updated.");

  const handleChange = (prop, value) => {
    setValues({ ...values, [prop]: Number(Number(value).toFixed(2)) });
  };

  const handleKeyDown = prop => event => {
    //if tab or enter is pressed update value
    if (event.keyCode === 9 || event.keyCode === 13) {
      handleChange(prop, event.target.value);
    }
  }

  const handleSubmit = prop => async (event) => {
    const res = await ServerRoutes.updateSettings({ ...values, user_id: "kinzelj" })
    if (res > 0) {setPopupMessage("User settings updated.")}
    else {setPopupMessage("Error: No settings changed or updated.")}
    dispatch(fetchSettings('kinzelj'));
    setShowPopup(true);
  }

  const handleClosePopup = () => {
    setShowPopup(false);
  }

  if (showPopup) {
    return (<Popup closePopup={handleClosePopup} type={"settingsOk"} message={popupMessage}/>);
  }
  else {
    return (
      <form className={classes.rootForm} noValidate autoComplete="off">
        <div className={classes.rootDiv}>

          <div className={classes.container}>
            {/******************************* Monthly Income ******************************************/}
            <div className={classes.div}>
              <h4 className={classes.h4}>Income</h4>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Monthly Net Income</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.income}
                  onKeyDown={handleKeyDown('income')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={130}
                  required
                />
              </FormControl>
            </div>
          </div>

          <div className={classes.container}>
            {/******************************* Monthly Budget ******************************************/}
            <div className={classes.div}>
              <h4 className={classes.h4}>Monthly Budget (% of budget)</h4>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Savings</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.savings}
                  onKeyDown={handleKeyDown('savings')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={55}
                />
                <p>{"$" + (availableIncome * (values.savings / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Morgage/Rent</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.housing}
                  onKeyDown={handleKeyDown('housing')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.housing / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Utilities</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.utilities}
                  onKeyDown={handleKeyDown('utilities')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.utilities / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Phone</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.phone}
                  onKeyDown={handleKeyDown('phone')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.phone / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Internet</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.internet}
                  onKeyDown={handleKeyDown('internet')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.internet / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">TV</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.tv}
                  onKeyDown={handleKeyDown('tv')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.tv / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Groceries</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.groceries}
                  onKeyDown={handleKeyDown('groceries')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.groceries / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Gasoline</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.gas}
                  onKeyDown={handleKeyDown('gas')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.gas / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Dining</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.dining}
                  onKeyDown={handleKeyDown('dining')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.dining / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Merchandise</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.merchandise}
                  onKeyDown={handleKeyDown('merchandise')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.merchandise / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Entertainment</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.entertainment}
                  onKeyDown={handleKeyDown('entertainment')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.entertainment / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Transportation</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.transportation}
                  onKeyDown={handleKeyDown('transportation')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.transportation / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Personal</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.personal}
                  onKeyDown={handleKeyDown('personal')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.personal / 100)).toFixed(2)}</p>
              </FormControl>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Subscriptions</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.subscriptions}
                  onKeyDown={handleKeyDown('subscriptions')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.subscriptions / 100)).toFixed(2)}</p>
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Other</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.other_monthly}
                  onKeyDown={handleKeyDown('other_monthly')}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  labelWidth={105}
                />
                <p>{"$" + (availableIncome * (values.other_monthly / 100)).toFixed(2)}</p>
              </FormControl>

              <h5 style={{ marginTop: '5px' }}>Sum of Percentages (Must Equal 100%): %{budget_percent_sum}</h5>
            </div>

            {/******************************* Yearly Expenses ******************************************/}
            <div className={classes.div}>
              <h4 className={classes.h4}>Yearly Expenses ($/year)</h4>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Home Insurance</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.home_insurance}
                  onKeyDown={handleKeyDown('home_insurance')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={110}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Property Taxes</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.property_taxes}
                  onKeyDown={handleKeyDown('property_taxes')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={110}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Car Insurance</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.car_insurance}
                  onKeyDown={handleKeyDown('car_insurance')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={95}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Car Expenses</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.car_expenses}
                  onKeyDown={handleKeyDown('car_expenses')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={95}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Vacation</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.vacation}
                  onKeyDown={handleKeyDown('vacation')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={105}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Gifts</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.gifts}
                  onKeyDown={handleKeyDown('gifts')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={105}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Donations</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.donations}
                  onKeyDown={handleKeyDown('donations')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={105}
                />
              </FormControl>
              <br></br>
              <FormControl className={classes.margin} variant="outlined">
                <InputLabel className={classes.title} htmlFor="outlined-adornment-amount">Other Yearly Expenses</InputLabel>
                <OutlinedInput
                  className={classes.box}
                  defaultValue={values.other_yearly}
                  onKeyDown={handleKeyDown('other_yearly')}
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={105}
                />
              </FormControl>
            </div>
          </div>

          <p>**Important** You must hit Tab or Enter after each modification for the change to take effect before you click UPDATE.</p>
          <div className={classes.button}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={handleSubmit()}
            >Update</Button>
          </div>
        </div>
      </form>
    );
  }
}

