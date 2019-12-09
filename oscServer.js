const express = require('express');
let app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);
const nodeOsc = require('node-osc');

// const host = '127.0.0.1';
const host = '192.168.0.2';

const wsPort = '3001';
const oscOutPort = 3002;
const oscInPort = 3003;

app.use(express.static('./public'));
app.use(express.static('./node_modules'));

server.listen(wsPort);

let oscServer = new nodeOsc.Server(oscInPort, host);
let oscClient = new nodeOsc.Client(host, oscOutPort);

let io = socket;
io.set('origins', 'http://192.168.0.2:3001/*.html', 'http://192.168.0.4:3001/*.html');

io.sockets.on('connection', newConnection);

oscServer.on('message', function (msg) {
    // console.log(msg);
    io.sockets.emit('visuals', msg)
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
    console.log(`new connection, ID: ${socket.id}`);
    socket.on('pd', sendOscMessage);
}

console.log(`Server listening on ${host}:${wsPort}`);

