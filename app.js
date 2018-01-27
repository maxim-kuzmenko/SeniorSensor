const SerialPort = require("serialport");
const port = new SerialPort("/dev/cu.usbmodem1421", {
    baudRate: 9600
});
port.on('open', function(){
  console.log('Serial Port Opened');
  port.on('data', function(data){
      console.log(data.toString());
      customhandle(data.toString());
  });
});

function customhandle(data){
	console.log(data);
	// turn string to json then javascript object
	var splitstring = data.split('/\r?\n|\r/');
	console.log(splitstring);
	// read individual variables
	var output = JSON.stringify(splitstring);
	// change positions to Tilt-sensing

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