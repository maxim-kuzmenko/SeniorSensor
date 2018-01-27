const SerialPort = require("serialport");
const port = new SerialPort("/dev/cu.usbmodem1421");
port.on('open', function () {
    console.log('Serial Port Opened');
    var dataString = "";
    port.on('data', function (data) {
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
    var output = JSON.parse(data);
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