const config = require('./config.json');
const express = require('express');
let app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const nodeOsc = require('node-osc');

const host = config.serverHost;
const authorizedClients = config.clients;

const wsPort = '3001';
const oscOutPort = 3002;
const oscInPort = 3003;

app.use(express.static('./public'));
app.use(express.static('./node_modules'));

server.listen(wsPort);

let oscServer = new nodeOsc.Server(oscInPort, host);
let oscClient = new nodeOsc.Client(host, oscOutPort);

let lod = 4;
let falloff = .5;
let saturation = 100;
let brightness = 100;
let threshold = 0;
let particleSize = 5;
let magnitudeFactor = 5;


let io = socket;
io.set('origins', 'http://*:3001/*.html');
// io.set('origins', `http://${authorizedClients[0]}:3001/*.html`, `http://${authorizedClients[1]}:3001/*.html`);

io.sockets.on('connection', newConnection);

oscServer.on('message', function (msg) {
    if (msg[0].startsWith('/visuals')){
        if (msg[0] === '/visuals/lod') lod = msg[1];
        else if (msg[0] === '/visuals/threshold') threshold = msg[1];
        else if (msg[0] === '/visuals/size') particleSize = msg[1];
        else if (msg[0] === '/visuals/velocity') magnitudeFactor = msg[1];
        else if (msg[0] === '/visuals/brightness') brightness = msg[1];
        else if (msg[0] === '/visuals/saturation') saturation = msg[1];
        else if (msg[0] === '/visuals/falloff') falloff = msg[1];
        // else if (msg[0] === '/visuals/bark') console.log('bark');
        io.sockets.emit('visuals', msg)
    }
});

function sendOscMessage(data){
    console.log('sending PD Message');
    console.log(data);
    let address = data[0];
    let args = (data.length > 1) ? data.splice(1) : [];
    let message = new nodeOsc.Message(address);
    args.forEach(item => message.append(item));
    console.log(message);
    oscClient.send(message, (err) => {
        if (err) console.error(err);
    });
}

function newConnection(socket) {
    console.log(`new connection, ID: ${socket.id}  Remote Address: ${socket.client.conn.remoteAddress}`);
    socket.on('pd', sendOscMessage);
    socket.emit('visuals', ['/visuals/threshold', threshold]);
    socket.emit('visuals', ['/visuals/size', particleSize]);
    socket.emit('visuals', ['/visuals/velocity', magnitudeFactor]);
    socket.emit('visuals', ['/visuals/brightness', brightness]);
    socket.emit('visuals', ['/visuals/saturation', saturation]);
    socket.emit('visuals', ['/visuals/falloff', falloff]);
    socket.emit('visuals', ['/visuals/lod', lod]);
}

console.log(`Server listening on ${host}:${wsPort}`);

