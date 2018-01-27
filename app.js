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