const request = require('request');
const SerialPort = require("serialport");
const arduinoPort = new SerialPort("/dev/cu.usbmodem1421");

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
	const accountSid = process.env.API_KEY; //'AC610a13bdb4e66808beace23a61c6d0d4';
	const authToken = process.env.TOKEN; //'7a52286c05bac629ca5001c62315fb37';

function ping() {
    request('http://seniorsensor.tech', function (error, response, body) {
        console.log('Pinged to keep dyno awake');
    });
}

	client.messages
	  .create({
	    to: '+15877071849',
	    from: '+15017122661',
	    body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
	  })
	  .then(message => console.log(message.sid));
}

ping();
setInterval(() => {
    ping();
}, 1500000);
