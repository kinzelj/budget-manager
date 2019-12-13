const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tSchema = new Schema({
  category: String,
  description: String,
  tDate: Date,
  pDate: Date,
  credit: Number,
  debit: Number, 
});

mongoose.model('tactions', tSchema);