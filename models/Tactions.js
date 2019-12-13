const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tSchema = new Schema({
  "Transaction Date": Date,
  "Posted Date": Date,
  Category: String,
  Description: String,
  Credit: Number,
  Debit: Number, 
});

mongoose.model('tactions', tSchema);