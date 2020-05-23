


const tmi = require('tmi.js');
const express = require('express');
const app = express();

// Glitch expects a web server so we're starting express to take care of that.
// The page shows the same information as the readme and includes the remix button.
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

let listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// Define configuration options
const opts = {
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
  },
  channels: [
    'FilipaCarola'
  ]
};
// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const threshold = 100;

const weirdShit = {
    "xD": 100,
    "girl": 20,
    "husband": 60,
    "wanted her": 100,
    "as a friend": 100,
    "her": 50,
    "@filipacarola": 100
}

const weirdThingy = ["filipa7"];

const weirdPeople = ["pedrolima1991", "mrbagginns", "nofe90", "PDeSMTG"];

let cringeMeter = 0;



// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  msg = msg.toLowerCase();

  console.log(context);

  cringeMeter += checkName(context['display-name']);

  cringeMeter += checkMod(context.mod)

  cringeMeter += checkSub(context.subscriber)

  cringeMeter += checkEmote(msg);

  cringeMeter += checkText(msg);

  if (cringeMeter > threshold) {
    console.log(cringeMeter);
    client.say(target, `You are being cringe ${context['display-name']}. Please stop :)`);
    cringeMeter = 0;
  }
  console.log(cringeMeter);1
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function checkName(displayName) {
    if (weirdPeople.indexOf(displayName) != -1) {
        return 65;
    }

    return 0;
}

function checkMod(mod) {
    return (mod) ? 25 : 0;
}

function checkEmote(msg) {
    return (msg.match(/filipa7/g) || []).length * 15;
}

function checkText(msg) {
    let cringeCounter = 0;

    Object.keys(weirdShit).forEach(key => {
        if (msg.includes(key)) {
            cringeCounter += weirdShit[key];
        }
    })

    return cringeCounter
}

function checkSub(sub) {
    return (sub) ? 15 : 0;
}

setTimeout(function() { 

        if (cringeMeter < 5) {
            return;
        }

        cringeMeter -= 5;
        
    }
, 10000);
