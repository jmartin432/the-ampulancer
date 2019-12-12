const s = (sketch) => {

    let socket;
    let host = '192.168.1.52';
    let port = '3001';
    let width = 400;
    let height = 400;
    let mainCanvas;
    let recordButton;
    let stopButton;
    let playButton;
    let connectPdButton;
    let gainSlider;
    let metroSlider;
    let delaySlider;
    let delayGainSlider;
    let sampleStartSlider;
    let modulatorSliders = [];

    sketch.setup = () => {
        let url = `http://${host}:${port}`;
        socket = io.connect(url);
        socket.on('fromPd', );
        // mainCanvas = sketch.createCanvas(width, height);
        // mainCanvas.parent('canvas');
        modulatorSliders = document.getElementById('modulators').getElementsByTagName('input');
        for (let item of modulatorSliders){
            item.addEventListener('input', function(){
                let i = this.id[this.id.length - 1];
                console.log('modulator' + i);

                socket.emit('pd', ['/modulator',  'm' + parseInt(i).toString(), parseFloat(this.value)]);
                }
            )
        }
        gainSlider = document.getElementById("gainSlider");
        gainSlider.addEventListener('input', function(){
            console.log('gain');
            socket.emit('pd', ['/gain', parseFloat(gainSlider.value)]);
        });
        metroSlider = document.getElementById("metroSlider");
        metroSlider.addEventListener('input', function(){
            console.log('metro');
            socket.emit('pd', ['/metro', parseFloat(metroSlider.value)]);
        });
        delaySlider = document.getElementById("delaySlider");
        delaySlider.addEventListener('input', function(){
            console.log('delay');
            socket.emit('pd', ['/delay', parseFloat(delaySlider.value)]);
        });
        delayGainSlider = document.getElementById("delayGainSlider");
        delayGainSlider.addEventListener('input', function(){
            console.log('delayGain');
            socket.emit('pd', ['/delayGain', parseFloat(delayGainSlider.value)]);
        });
        sampleStartSlider = document.getElementById("sampleStartSlider");
        sampleStartSlider.addEventListener('input', function(){
            console.log('sampleStart');
            socket.emit('pd', ['/sampleStart', parseFloat(sampleStartSlider.value)]);
        });
        recordButton = document.getElementById("recordButton");
        recordButton.addEventListener('click', function(){
            console.log('record');
            socket.emit('pd', ['/record']);
        });
        playButton = document.getElementById("playButton");
        playButton.addEventListener('click', function(){
            console.log('play');
            socket.emit('pd', ['/play']);
        });
        stopButton = document.getElementById("stopButton");
        stopButton.addEventListener('click', function(){
            console.log('stop');
            socket.emit('pd', ['/stop']);
        });
        connectPdButton = document.getElementById("connectPd");
        connectPdButton.addEventListener('click', function(){
            console.log('connectPd');
            socket.emit('pd', ['/connectPd', parseInt(this.value)]);
            this.value = (this.value === '0') ? '1' : '0';
            this.innerHTML = (this.value === '0') ? 'Disconnect PD' : 'Connect PD';
        });
        sketch.createCanvas(400, 400);
    }


    sketch.draw = () => {
        // sketch.background(51);
        // sketch.fill('red');
        // sketch.ellipse(sketch.mouseX, sketch.mouseY, 45, 45);
    }
};

let p5_2 = new p5(s);


// oscWebSocket = new osc.WebSocketPort({
        //     url: "ws://127.0.0.1:3003",
        //     metadata: true
        // });
        // oscWebSocket.on("ready", onSocketOpen);
        // oscWebSocket.on("message", onSocketMessage);
        // };
