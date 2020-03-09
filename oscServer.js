const config = require('./config.json');
const express = require('express');
let app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const nodeOsc = require('node-osc');
const logger = require('log4js').getLogger();

// const serverHost = "localhost";
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
    'particle-radius': [10],
    'particle-length': [10],
    'particle-brightness': [100],
    'particle-saturation': [100],
    'particle-lod': [10],
    'particle-falloff': [1],
    'particle-direction': [1],
    'sample-reverse': [0],
    'sample-metronome': [100],
    'sample-start': [100],
    'looper-delay': [1],
    'looper-delaygain': [.5],
    'modulator-m0': [400],
    'modulator-m1': [400],
    'modulator-m2': [400],
    'modulator-m3': [400],
    'modulator-m4': [400],
    'modulator-m5': [400],
    'modulator-m6': [400],
    'modulator-m7': [400],
    'modulator-m8': [400],
    'modulator-m9': [400]
};

let io = socket;
// io.set('origins', ['http://172.16.101.94:3001/*.html', 'http://172.16.101.229:3001/*.html']);
// io.set('origins', `http://${authorizedClients[0]}:3001/*.html`, `http://${authorizedClients[1]}:3001/*.html`);

io.sockets.on('connection', newConnection);

pureDataServer.on('message', handlePureDataOscMessage);
touchOscServer.on('message', handleTouchOscMessage);

function handleBrowserMessage(data){
    logger.info("Received Browser Message", data);
    for (const [key, value] of Object.entries(data)) {
        initialMessage[key] = value;
        logger.debug("New Initial Message", initialMessage)
    }
    io.sockets.emit('updateMessage', data);
    let getOscMessage = new Promise((resolve, reject) => {
        resolve(jsonToOsc(data))
    });
    getOscMessage.then((message) => {
        sendOscMessageToPureData(message);
        sendOscMessageToTouchOsc(message);
    });
}

function handlePureDataOscMessage(message){
    let address = message[0];
    let args = message.slice(1);
    if (address.startsWith('/modulator/led')) {
        sendOscMessageToTouchOsc(message);
        return;
    }
    if (address.startsWith('/particle/bark')) {
        io.sockets.emit('newSystem', message)
    } else {
        logger.info("Received Pure Data OSC Message", message);
        sendOscMessageToTouchOsc(message);
        io.sockets.emit("updateMessage", oscToJson(address, args));
    }
}

function handleTouchOscMessage(message){
    let address = message[0];
    let args = message.slice(1);
    logger.info("Received TouchOSC Message", address, args);
    sendOscMessageToPureData(message);
    io.sockets.emit("updateMessage", oscToJson(address, args));
}

function oscToJson(address, args){
    let message = {};
    logger.debug(`Converting ${address.toString()}, ${args} to JSON`);
    let key = address.toString().substring(1).replace('/', '-');
    message[key] = args;
    logger.info("Outgoing JSON message", message);
    return message
}

function jsonToOsc(data){
    let message;
    logger.debug('Converting JSON to OSC', data);
    for (const [key, value] of Object.entries(data)) {
        let address = `/${key.replace('-', '/')}`;
        message = new nodeOsc.Message(address);
        value.forEach(item => message.append(item));
    }
    logger.info("Outgoing OSC message", message);
    return message
}

function sendOscMessageToPureData(message){
    pureDataClient.send(message, (err) => {
        if (err) logger.error(err);
    });
}

function sendOscMessageToTouchOsc(message){
    touchOscClient.send(message, (err) => {
        if (err) logger.error(err);
    });
}

function newConnection(socket) {
    logger.info(`new connection, ID: ${socket.id}  Remote Address: ${socket.client.conn.remoteAddress}`);
    socket.on('browserMessage', handleBrowserMessage);
    socket.emit('updateMessage', initialMessage);
}

logger.level = (process.argv[2] && process.argv[2] == 'debug') ? 'debug' : 'info';
logger.info('Logging Level', logger.level.levelStr) ;
logger.info(`Server listening on ${serverHost}:${wsPort}`);


// socket.emit('visuals', ['/visuals/size', particleSize]);
//     socket.emit('visuals', ['/visuals/velocity', magnitudeFactor]);
//     socket.emit('visuals', ['/visuals/brightness', brightness]);
//     socket.emit('visuals', ['/visuals/saturation', saturation]);
//     socket.emit('visuals', ['/visuals/falloff', falloff]);
//     socket.emit('visuals', ['/visuals/lod', lod]);

