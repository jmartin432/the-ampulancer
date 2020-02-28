const config = require('./config.json');
const express = require('express');
let app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const nodeOsc = require('node-osc');

const serverHost = config.serverHost;
const touchOscHost = config.touchOscHost;
const authorizedClients = config.authorizedClients;

const wsPort = config.ports.websocket;
const pureDataOutPort = config.ports.pureDataOut;
const pureDataInPort = config.ports.pureDataIn;
const touchOscOutPort = config.ports.touchOscOut;
const touchOscInPort = config.ports.touchOscIn;

app.use(express.static('./public'));
app.use(express.static('./node_modules'));

server.listen(wsPort);

let pureDataServer = new nodeOsc.Server(pureDataInPort, serverHost);
let pureDataClient = new nodeOsc.Client(serverHost, pureDataOutPort);
let touchOscServer = new nodeOsc.Server(touchOscInPort, serverHost);
let touchOscClient = new nodeOsc.Client(touchOscHost, touchOscOutPort);

let threshold = 0;

let initialMessage = {
    'particle-size': [10],
    'particle-length': [10],
    'particle-brightness': [100],
    'particle-saturation': [100],
    'particle-lod': [10],
    'particle-falloff': [1],
    'particle-direction': [1],
    'sample-metronome': [100],
    'sample-start': [100]
};

let io = socket;
// io.set('origins', ['http://172.16.101.94:3001/*.html', 'http://172.16.101.229:3001/*.html']);
// io.set('origins', `http://${authorizedClients[0]}:3001/*.html`, `http://${authorizedClients[1]}:3001/*.html`);

io.sockets.on('connection', newConnection);

pureDataServer.on('message', handlePureDataOscMessage);
touchOscServer.on('message', handleTouchOscMessage);

function handlePureDataOscMessage(message){
    console.log("Received Pure Data OSC Message", message);
    sendOscMessageToTouchOsc(message);
    oscToJson(message);
    if (message[0].startsWith('/bark')){
        io.sockets.emit('newSystem', message)
    }
}

function handleTouchOscMessage(message){
    console.log("Received TouchOSC Message", message);
    sendOscMessageToPureData(message);
    oscToJson(message);
}


function oscToJson(data){
    let message = {};
    console.log('Converting OSC to JSON');
    console.log(data);
    let key = data[0].substring(1).replace('/', '-');
    let value = data.splice(1);
    message[key] = value;
    console.log("Outgoing JSON message", message);
    return message
}

function jsonToOsc(data){
    let message;
    console.log('Converting JSON to OSC');
    console.log(data);
    for (const [key, value] of Object.entries(data)) {
        let address = `/${key.replace('-', '/')}`;
        message = new nodeOsc.Message(address);
        value.forEach(item => message.append(item));
    }
    console.log("Outgoing OSC message", message);
    return message
}

function handleBrowserMessage(data){
    console.log("Received Browser Message", data);
    console.log('Sending Update Message', data);
    for (const [key, value] of Object.entries(data)) {
        initialMessage[key] = value;
        console.log("New Initial Message", initialMessage)
    }
    io.sockets.emit('updateMessage', data);
    sendOscMessageToPureData(jsonToOsc(data));
    sendOscMessageToTouchOsc(jsonToOsc(data));
}

function sendOscMessageToPureData(message){
    pureDataClient.send(message, (err) => {
        if (err) console.error(err);
    });
}

function sendOscMessageToTouchOsc(message){
    pureDataClient.send(message, (err) => {
        if (err) console.error(err);
    });
}

function newConnection(socket) {
    console.log(`new connection, ID: ${socket.id}  Remote Address: ${socket.client.conn.remoteAddress}`);
    // socket.on('oscMessage', );
    socket.on('browserMessage', handleBrowserMessage);
    socket.emit('updateMessage', initialMessage);
}

console.log(`Server listening on ${serverHost}:${wsPort}`);


// socket.emit('visuals', ['/visuals/size', particleSize]);
//     socket.emit('visuals', ['/visuals/velocity', magnitudeFactor]);
//     socket.emit('visuals', ['/visuals/brightness', brightness]);
//     socket.emit('visuals', ['/visuals/saturation', saturation]);
//     socket.emit('visuals', ['/visuals/falloff', falloff]);
//     socket.emit('visuals', ['/visuals/lod', lod]);

