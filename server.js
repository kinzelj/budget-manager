var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var csv = require('csvtojson')

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/client/build')));

const port = process.env.PORT || 5000;

app.get('/data', function (req, res) {
	const csvFilePath='./data/2019.csv'
	csv().fromFile(csvFilePath).then((jsonObj)=>{
		res.send(JSON.stringify(jsonObj));
	})
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

var server = app.listen(port, () => console.log(`Server started on port ${port}`));
server.timeout = 150000;