const request = require('request');
const SerialPort = require("serialport");
const arduinoPort = new SerialPort("/dev/cu.usbmodem1421");

var soundArray = [];

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
        output.sound = analyzeAmplitude(output.sound);
        output.avgAccel = Math.sqrt(Math.pow(output.xAccel, 2) + Math.pow(output.yAccel, 2) + Math.pow(output.zAccel, 2));
        console.log(output);
        analyze(output);
    } catch (ex) {
        console.log("Failed to parse JSON...");
    }
}

function analyzeAmplitude(sound) {
    soundArray.push(sound);
    if (soundArray.length > 50) {
        soundArray.shift();
    }
    sound = { "high": null, "low": null };
    for (i in soundArray) {
        if (sound.high == null) {
            sound.high = soundArray[i];
        } else if (soundArray[i] > sound.high) {
            sound.high = soundArray[i];
        }
        if (sound.low == null) {
            sound.low = soundArray[i];
        } else if (soundArray[i] < sound.low) {
            sound.low = soundArray[i];
        }
    }
    sound.amplitude = sound.high - sound.low;
    return sound;
}

function analyze(data) {
    analyzeFall(data.sound, data.avgAccel);
}

function analyzeFall(sound, avgAccel) {

}

function handleTwilio() {
    // Twilio Credentials
    const accountSid = process.env.API_KEY; //'AC610a13bdb4e66808beace23a61c6d0d4';
    const authToken = process.env.TOKEN; //'7a52286c05bac629ca5001c62315fb37';
    client.messages
        .create({
            to: '+15877071849',
            from: '+15873175479',
            body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        })
        .then(message => console.log(message.sid));
}

function ping() {
    request('http://seniorsensors.herokuapp.com', function (error, response, body) {
        console.log('Pinged to keep dyno awake');
    });
}

ping();
setInterval(() => {
    ping();
}, 1500000);
