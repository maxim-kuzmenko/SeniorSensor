const request = require('request');
const SerialPort = require("serialport");
const arduinoPort = new SerialPort("/dev/cu.usbmodem1421");

var soundArray = [];
var accelArray = [];
var arrayLength = 500;
var accelThreshold = 1.5;
var walking = false;
var count = 0;

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
        console.log("Count: " + count);
        console.log("Walking: " + walking);
        count++;
        analyzeData(output);
    } catch (ex) {
        console.log("Failed to parse JSON...");
    }
}

function analyzeData(data) {
    var accel = data.avgAccel;
    accelArray.push(accel);
    if (accelArray.length > arrayLength) {
        accelArray.shift();
    }

    if (accelArray.length >= arrayLength) {
        console.log("Sufficient data");
        var avgAccelQuarter = [0, 0, 0, 0];
        for (var i in accelArray) {
            if (i < arrayLength / 4) {
                avgAccelQuarter[0] += accelArray[i];
            } else if (i < arrayLength / 2) {
                avgAccelQuarter[1] += accelArray[i];
            } else if (i < arrayLength / 4 * 3) {
                avgAccelQuarter[2] += accelArray[i];
            } else {
                avgAccelQuarter[3] += accelArray[i];
            }
            // avgAccelQuarter[i / (accelArray.length / 4.0)] += accelArray[i];
        }
        for (i in avgAccelQuarter) {
            avgAccelQuarter[i] /= (arrayLength / 4.0);
            console.log(avgAccelQuarter[i]);
        }
        console.log("Checking thresholds");
        if (avgAccelQuarter[0] > accelThreshold 
            && avgAccelQuarter[1] < accelThreshold 
            && avgAccelQuarter[2] < accelThreshold 
            && avgAccelQuarter[3] < accelThreshold) {
                console.log("1 0 0 0");
                if (walking) {
                    walking = false;
                    accelArray = [];
                } else {
                    //Check for sound first
                    console.log("Fall!");
                    process.exit(); //Replace this with the twilio alert
                }
        } else {
            console.log("? ? ? ?");
            var numQuartersAboveThreshold = 0;
            for (i in avgAccelQuarter) {
                if (avgAccelQuarter[i] > accelThreshold) {
                    console.log("Quarter ", i, " above threshold");
                    numQuartersAboveThreshold++;
                }
            }
            if (numQuartersAboveThreshold > 2) {
                walking = true;
            }
        }
    }
}

function analyzeAmplitude(sound) {
    soundArray.push(sound);
    if (soundArray.length > arrayLength) {
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
            from: '+15017122661',
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
