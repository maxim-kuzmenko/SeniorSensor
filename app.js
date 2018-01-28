const SerialPort = require("serialport");
const request = require('request');
const express = require('express');
const arduinoPort = new SerialPort("/dev/cu.usbmodem1421");
const app = express();
const ROOT = "./public";
arduinoPort.on('open', function () {
    console.log('Serial Port Opened');
    var dataString = "";
    arduinoPort.on('data', function (data) {
        dataString += data.toString('utf8');
        if (dataString.includes("}")) {
            parseData(dataString);
            dataString = "";
        }
    });
});

function parseData(data) {
    // turn string to json then javascript object
    data = data.replace(/(\r\n|\n|\r)/gm, "");
    // read individual variables
    try {
        var output = JSON.parse(data);
    } catch (ex) {
        console.log(ex);
    }
    // change positions to Tilt-sensing
    console.log(output);
    // alert text if position changes
}

function handleTwilio(){
	// Twilio Credentials
	const accountSid = 'AC610a13bdb4e66808beace23a61c6d0d4';
	const authToken = '7a52286c05bac629ca5001c62315fb37';

	// require the Twilio module and create a REST client
	const client = require('twilio')(accountSid, authToken);

	client.messages
	  .create({
	    to: '+15877071849',
	    from: '+15017122661',
	    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
	  })
	  .then(message => console.log(message.sid));
}

function ping() {
	request('http://seniorsensor.tech', function (error, response, body) {
		console.log('Pinged to keep dyno awake');
	});
}

app.set('port', (process.env.PORT || 5000));

app.use(function (req, res, next) {
	console.log(req.method + " request for " + req.url);
	next();
});

app.get(['/', '/index.html', '/index'], function (req, res) {
	res.sendFile('index.html', {
		root: ROOT
	});
});

app.use(express.static(ROOT));

app.all("*", function (req, res) {
	res.status(404);
	res.render('404');
})

app.listen(app.get('port'), function () {
	console.log('Server listening on port', app.get('port'));
	ping();
	setInterval(() => {
		ping();
	}, 1500000);
});