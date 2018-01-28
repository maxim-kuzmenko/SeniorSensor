const request = require('request');
const SerialPort = require("serialport");
const arduinoPort = new SerialPort("/dev/cu.usbmodem1421");
const twilio = require('twilio');

var soundArray = [];
var accelArray = [];
var longAccelArray = [];
var arrayLength = 500;
var accelThreshold = 1.2;
var fallAccelThreshold = 1.5;
var walking = false;
var twilioMessageLimiter = 0;
var twilioMessageLimiterUpperLimit = 2000;

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
        console.log("Walking: " + walking);
        if (twilioMessageLimiter > 0) {
            twilioMessageLimiter--;
            console.log("Twilio message limiter: " + twilioMessageLimiter);
        }
        analyzeData(output);
    } catch (ex) {
        console.log("Failed to parse JSON...");
    }
}

function analyzeData(data) {
    var accel = data.avgAccel;
    var amplitude = data.sound.amplitude;
    accelArray.push(accel);
    if (accelArray.length > arrayLength) {
        accelArray.shift();
    }

    longAccelArray.push(accel);
    if (longAccelArray.length > arrayLength * 6) {
        longAccelArray.shift();
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
        }
        for (i in avgAccelQuarter) {
            avgAccelQuarter[i] /= (arrayLength / 4.0);
            console.log(avgAccelQuarter[i]);
        }
        console.log("Checking thresholds");
        if (avgAccelQuarter[0] > fallAccelThreshold
            && avgAccelQuarter[1] < fallAccelThreshold
            && avgAccelQuarter[2] < fallAccelThreshold
            && avgAccelQuarter[3] < fallAccelThreshold) {
                if (walking) {
                    walking = false;
                    accelArray = [];
                } else {
                    // if (amplitude > 700) {
                        if (twilioMessageLimiter > 0) {
                            console.log("Sent twilio fall message. Limiter: " + twilioMessageLimiter);
                        } else {
                            handleTwilio(0);
                            console.log("Sent twilio fall message");
                            twilioMessageLimiter = twilioMessageLimiterUpperLimit;
                        }
                    // } else {
                    //     console.log("Didn't sent fall message due to lack of noise");
                    // }
                }
        } else {
            var numQuartersAboveThreshold = 0;
            for (i in avgAccelQuarter) {
                if (avgAccelQuarter[i] > accelThreshold) {
                    console.log("Quarter ", i, " above threshold");
                    numQuartersAboveThreshold++;
                }
            }
            if (numQuartersAboveThreshold > 2) {
                walking = true;
                if (twilioMessageLimiter > 0) {
                    console.log("Sent twilio walking message. Limiter: " + twilioMessageLimiter);
                } else {
                    handleTwilio(1);
                    console.log("Sent twilio walking message");
                    twilioMessageLimiter = twilioMessageLimiterUpperLimit;
                }
            }
        }
    }
    if (longAccelArray.length >= arrayLength * 6) {
        var moved = false;
        for (i in longAccelArray) {
            if (longAccelArray[i] > accelThreshold) {
                moved = true;
            }
        }
        if (!moved) {
            if (twilioMessageLimiter > 0) {
                console.log("Sent twilio inactive message. Limiter: " + twilioMessageLimiter);
            } else {
                handleTwilio(2);
                console.log("Sent twilio inactive message");
                twilioMessageLimiter = twilioMessageLimiterUpperLimit;
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

function handleTwilio(messageType) {
    // Twilio Credentials
    const accountSid = /*process.env.API_KEY;*/ /*'AC5e88808feca3beef0e331025d9145e3c'*/ 'AC610a13bdb4e66808beace23a61c6d0d4';
    const authToken = /*process.env.TOKEN;*/ /*'4170d65f65f4d4cb0848ac00daba6f14'*/ '7a52286c05bac629ca5001c62315fb37';
    var client = new twilio(accountSid, authToken);

    var messageBody = "";
    switch (messageType) {
        case 0:
            messageBody = "Sudden fall detected for our elderly patient.";
            break;
        case 1:
            messageBody = "Our elderly patient is on the move.";
            break;
        case 2:
            messageBody = "Our elderly patient has not moved significantly for the past 8 hours";
            break;
        default:
            return;
    }

    client.messages
        .create({
            to: '+15877071849',
            from: '+15873175479',
            body: messageBody,
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
