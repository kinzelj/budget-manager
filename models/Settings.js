const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sSchema = new Schema({
  user_id: String,
  budget_id: String,
  settings: {
    //monthly income
    income: Number,

    //yearly expenses
    vacation: Number,
    car_expenses: Number,
    car_insurance: Number,
    home_insurance: Number,
    property_taxes: Number,
    gifts: Number,
    donations: Number,
    health: Number,
    other: Number,

    savings: Number,

    //monthly budget 
    housing: Number,
    utilities: Number,
    phone: Number,
    internet: Number,
    tv: Number,
    groceries: Number,
    gas: Number,
    dining: Number,
    merchandise: Number,
    entertainment: Number,
    transportation: Number,
    personal: Number,
    subscriptions: Number,
  }
});

mongoose.model('budget-settings', sSchema);
mongoose.model('demo-budget-settings', sSchema);