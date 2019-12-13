require('dotenv').config();
var express = require('express');
const mongoose = require('mongoose');
var path = require('path');
var cors = require('cors');
const IncomingForm = require('formidable').IncomingForm
var csv = require('csvtojson')
const keys = require('./config/keys');

require('./models/Tactions');

var app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: false}));
app.use(express.static(path.join(__dirname, '/client/build')));

var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

mongoose.connect(keys.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const port = process.env.PORT || 5000;

app.post('/show-data', function (req, res) {
	var form = new IncomingForm()
	var returnData = "";
	form.on('file', (field, file) => {
		csv().fromFile(file.path).then((jsonObj) => {
			returnData = (JSON.stringify(jsonObj));
			res.send(returnData);
		});
	})
	form.parse(req)
});

app.post('/import', async function (req, res) {
	const Tactions = mongoose.model('tactions');
  for (const entry of req.body) {
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
  res.send("Import Complete");
});

app.get('/data', async function(req, res) {
  const Tactions = mongoose.model('tactions');
  const data = await Tactions.find( {} );
  res.send(data);
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var server = app.listen(port, () => console.log(`Server started on port ${port}`));
server.timeout = 150000;