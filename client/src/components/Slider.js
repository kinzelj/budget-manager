import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

export default function RangeSlider(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState([props.sliderInit[0].getTime(),props.sliderInit[1].getTime()]);
  

  const handleUpdate = (event) => {
   props.handleUpdate({value}); 
  }
  
  const getMin = () => {
    return props.dateRange[0].getTime()
  }
  const getMax = () => {
    return props.dateRange[1].getTime()
  } 
  
  //setMinDate for min date input box
  const setMinDate = (dateVal) => {
    const minDate = new Date(); 
    minDate.setTime(dateVal[0]);
    
    const monthNum = Number(minDate.getUTCMonth()) + 1
    var monthText = monthNum.toString();
    if (monthNum < 10) {
      monthText = "0" + monthText;
    }
    
    const dayNum = Number(minDate.getUTCDate());
    var dayText = dayNum.toString();
    if (dayNum < 10) {
      dayText = "0" + dayText;
    }
    
    const textDate = minDate.getUTCFullYear() + "-" + monthText + "-" + dayText;
    return textDate;
  }
  //setMaxDate for max date input box
  const setMaxDate = (dateVal) => {
    const minDate = new Date(); 
    minDate.setTime(dateVal[1]);
    const monthNum = Number(minDate.getUTCMonth()) + 1
    var monthText = monthNum.toString();
    if (monthNum < 10) {
      monthText = "0" + monthText;
    }
    
    const dayNum = Number(minDate.getUTCDate());
    var dayText = dayNum.toString();
    if (dayNum < 10) {
      dayText = "0" + dayText;
    }
    
    const textDate = minDate.getUTCFullYear() + "-" + monthText + "-" + dayText;
    return textDate;
  }

  
  
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const handleMinInputChange = (event) => {
      const newYear = Number(event.target.value.slice(0,4));
      const newMonth = Number(event.target.value.slice(5,7));
      const newDay = Number(event.target.value.slice(8,10));
      const newMin = new Date();
      newMin.setUTCFullYear(newYear, (newMonth - 1), newDay);
      const newValue = [newMin.getTime(), value[1]];
      setValue(newValue);
  };
  const handleMaxInputChange = (event) => {
      const newYear = Number(event.target.value.slice(0,4));
      const newMonth = Number(event.target.value.slice(5,7));
      const newDay = Number(event.target.value.slice(8,10));
      const newMax = new Date();
      newMax.setUTCFullYear(newYear, (newMonth - 1), newDay);
      const newValue = [value[0], newMax.getTime()];
      setValue(newValue);
  };
  
  return (
    <div style={{minWidth: props.minWidth, marginRight: '17px'}}>
    	<Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
            value={value}
            onChange={handleChange}
            valueLabelDisplay="off"
            aria-labelledby="range-slider"
            style={{minWidth: '60px'}}
            min={getMin()}
            max={getMax()}
          />
          </Grid>
          <Grid item>
            <TextField
              id="dateMin"
              label="Min Date"
              type="date"
              value={setMinDate(value)}
              className={classes.textField}
              InputLabelProps={{ shrink: true, }}
              onChange={handleMinInputChange}
            />
          </Grid>
          <Grid item>
            <TextField
              id="dateMax"
              label="Max Date"
              type="date"
              value={setMaxDate(value)}
              className={classes.textField}
              InputLabelProps={{ shrink: true, }}
              onChange={handleMaxInputChange}
            />
          </Grid>

          <Grid item>
           <Button onClick={handleUpdate} variant="contained" color="primary">
             {props.buttonText}
          </Button>
         </ Grid>

      </Grid>

    </div>
  );
}