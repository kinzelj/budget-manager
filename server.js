var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
const IncomingForm = require('formidable').IncomingForm
var csv = require('csvtojson')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/build')));
var corsOptions = {
	origin: '*',
	optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

const port = process.env.PORT || 5000;

app.post('/data', function (req, res) {
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

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var server = app.listen(port, () => console.log(`Server started on port ${port}`));
server.timeout = 150000;