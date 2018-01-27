const SerialPort = require("serialport");
const port = new SerialPort("/dev/cu.usbmodem1421", {
    baudRate: 9600
});
port.on('open', function(){
  console.log('Serial Port Opened');
  port.on('data', function(data){
      console.log(data.toString());
  });
});