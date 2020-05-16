require('dotenv').config();
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
const IncomingForm = require('formidable').IncomingForm
var csv = require('csvtojson')
const keys = require('./config/keys');

require('./models/Tactions');
require('./models/Settings');

var app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(express.static(path.join(__dirname, '/client/build')));

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

const DB = mongoose.createConnection(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;

app.post('/show-data', function (req, res) {
  var form = new IncomingForm()
  form.on('file', (field, file) => {
    csv().fromFile(file.path).then((jsonObj) => {
      var returnContext = { env: process.env.ENVIRONMENT }
      returnContext.data = jsonObj;
      res.send(returnContext);
    });
  })
  form.parse(req)
});

app.post('/import', async function (req, res) {
  let Tactions;
  if (process.env.DEMO === '1') {
    Tactions = DB.model('demo-tactions');
  }
  else {
    Tactions = DB.model('tactions');
  }
  var returnContext = { env: process.env.ENVIRONMENT };
  for (const entry of req.body) {
    try {
      const existingTaction = await Tactions.findOne({
        "Transaction Date": entry["Transaction Date"],
        Description: entry.Description,
        Credit: entry.Credit,
        Debit: entry.Debit
      });
      if (existingTaction) {
        continue;
      }
      else {
        const newTaction = await new Tactions({
          "Transaction Date": entry["Transaction Date"],
          "Posted Date": entry["Posted Date"],
          Category: entry.Category,
          Description: entry.Description,
          Credit: entry.Credit,
          Debit: entry.Debit,
        }).save()
        console.log(newTaction);
      }
    }
    catch (error) { console.log(error); }
  }
  returnContext.returnMessage = "Import Complete";
  res.send(returnContext);
});

app.get('/data', async function (req, res) {
  let Tactions;
  if (process.env.DEMO === '1') {
    Tactions = DB.model('demo-tactions');
  }
  else {
    Tactions = DB.model('tactions');
  }
  const data = await Tactions.find().sort({ "Transaction Date": -1 });
  res.send(data);
});

app.post('/update-categories', async function (req, res) {
  let Tactions;
  if (process.env.DEMO === '1') {
    Tactions = DB.model('demo-tactions');
  }
  else {
    Tactions = DB.model('tactions');
  }
  for (const entry of req.body) {
    await Tactions.updateOne({ _id: entry.id }, {
      $set: { Category: entry.newCategory }
    });
  }
  res.send(req.body);
});

app.get('/settings/:user_id/budget/:budget_id', async function (req, res) {
  let Settings;
  let filter;
  if (process.env.DEMO === '1') {
    Settings = DB.model('demo-budget-settings');
    filter = { 'user_id': 'demo', 'budget_id': 'demo' }
  }
  else {
    Settings = DB.model('budget-settings');
    filter = { 'user_id': req.params.user_id, 'budget_id': req.params.budget_id }
  }
  const data = await Settings.findOne(filter);
  res.send(data);
});

app.get('/settings/:user_id', async function (req, res) {
  let Settings;
  if (process.env.DEMO === '1') {
    Settings = DB.model('demo-budget-settings');
  }
  else {
    Settings = DB.model('budget-settings');
  }
  const filter = { 'user_id': req.params.user_id }
  const data = await Settings.find(filter,{budget_id: 1});
  res.send(data);
});

//update budget settings in database
app.put('/settings', async function (req, res) {
  let Settings;
  let user_id;
  let budget_id;
  if (process.env.DEMO === '1') {
    Settings = DB.model('demo-budget-settings');
    user_id = 'demo';
    budget_id = 'demo';
  }
  else {
    Settings = DB.model('budget-settings');
    user_id = req.body.user_id;
    budget_id = req.body.budget_id;
  }

  const query = await Settings.updateOne(
    {
      user_id: user_id,
      budget_id: budget_id,
    },
    {
      $set: {
        settings: {
          income: req.body.income,
          vacation: req.body.vacation,
          car_expenses: req.body.car_expenses,
          car_insurance: req.body.car_insurance,
          home_insurance: req.body.home_insurance,
          property_taxes: req.body.property_taxes,
          gifts: req.body.gifts,
          donations: req.body.donations,
          health: req.body.health,
          other: req.body.other,
          savings: req.body.savings,
          housing: req.body.housing,
          utilities: req.body.utilities,
          phone: req.body.phone,
          internet: req.body.internet,
          tv: req.body.tv,
          groceries: req.body.groceries,
          gas: req.body.gas,
          dining: req.body.dining,
          merchandise: req.body.merchandise,
          entertainment: req.body.entertainment,
          transportation: req.body.transportation,
          personal: req.body.personal,
          subscriptions: req.body.subscriptions,
        }
      }
    },
    {
      upsert: true
    }
  )
  res.send(query);
});

app.get('/get-env', function (req, res) {
  res.send(process.env.ENVIRONMENT);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var server = app.listen(port, () => console.log(`Server started on port ${port}`));
server.timeout = 150000;