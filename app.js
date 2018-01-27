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