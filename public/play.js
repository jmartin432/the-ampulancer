const s = (sketch) => {

    let socket;
    let host = '192.168.0.2';
    let port = '3001';
    let particleSizeSlider;
    let particleLengthSlider;
    let particleBrightnessSlider;
    let particleSaturationSlider;
    let particleLodSlider;
    let particleFalloffSlider;
    let metroSlider;
    let delaySlider;
    let delayGainSlider;
    let sampleStartSlider;
    let modulatorSliders = [];

    function handleUpdateMessage(data){
        console.log("Received Update Message", data);
        if (data['particle-size']) particleSizeSlider.value = data['particle-size'][0];
        if (data['particle-length']) particleLengthSlider.value = data['particle-length'][0];
        if (data['particle-brightness']) particleBrightnessSlider.value = data['particle-brightness'][0];
        if (data['particle-saturation']) particleSaturationSlider.value = data['particle-saturation'][0];
        if (data['particle-lod']) particleLodSlider.value = data['particle-lod'][0];
        if (data['particle-falloff']) particleFalloffSlider.value = data['particle-falloff'][0];
    }

    sketch.setup = () => {
        let url = `${host}:${port}`;
        socket = io.connect(url);
        socket.on('updateMessage', handleUpdateMessage);
        particleSizeSlider = document.getElementById('particle-size');
        particleSizeSlider.addEventListener('input', function(){
            console.log('Sending Particle Size Control');
            socket.emit('browserMessage', {'particle-size': [parseFloat(particleSizeSlider.value)]});
        });
        particleLengthSlider = document.getElementById('particle-length');
        particleLengthSlider.addEventListener('input', function(){
            console.log('Sending Particle Length Control');
            socket.emit('browserMessage', {'particle-length': [parseFloat(particleLengthSlider.value)]});
        });
        particleBrightnessSlider = document.getElementById('particle-brightness');
        particleBrightnessSlider.addEventListener('input', function(){
            console.log('Sending Particle Brightness Control');
            socket.emit('browserMessage', {'particle-brightness': [parseFloat(particleBrightnessSlider.value)]});
        });
        particleSaturationSlider = document.getElementById('particle-saturation');
        particleSaturationSlider.addEventListener('input', function(){
            console.log('Sending Particle Saturation Control');
            socket.emit('browserMessage', {'particle-saturation': [parseFloat(particleSaturationSlider.value)]});
        });
        particleLodSlider = document.getElementById('particle-lod');
        particleLodSlider.addEventListener('input', function(){
            console.log('Sending Particle Lod Control');
            socket.emit('browserMessage', {'particle-lod': [parseFloat(particleLodSlider.value)]});
        });
        particleFalloffSlider = document.getElementById('particle-falloff');
        particleFalloffSlider.addEventListener('input', function(){
            console.log('Sending Particle Falloff Control');
            socket.emit('browserMessage', {'particle-falloff': [parseFloat(particleFalloffSlider.value)]});
        });
        // modulatorSliders = document.getElementById('modulators').getElementsByTagName('input');
        // for (let item of modulatorSliders){
        //     item.addEventListener('input', function(){
        //         let i = this.id[this.id.length - 1];
        //         console.log('modulator' + i);
        //         socket.emit('pd', ['/modulator',  'm' + parseInt(i).toString(), parseFloat(this.value)]);
        //         }
        //     )
        // }
        // gainSlider = document.getElementById("gainSlider");
        // gainSlider.addEventListener('input', function(){
        //     console.log('gain');
        //     socket.emit('pd', ['/gain', parseFloat(gainSlider.value)]);
        // });
        // metroSlider = document.getElementById("metroSlider");
        // metroSlider.addEventListener('input', function(){
        //     console.log('metro');
        //     socket.emit('pd', ['/metro', parseFloat(metroSlider.value)]);
        // });
        // delaySlider = document.getElementById("delaySlider");
        // delaySlider.addEventListener('input', function(){
        //     console.log('delay');
        //     socket.emit('pd', ['/delay', parseFloat(delaySlider.value)]);
        // });
        // delayGainSlider = document.getElementById("delayGainSlider");
        // delayGainSlider.addEventListener('input', function(){
        //     console.log('delayGain');
        //     socket.emit('pd', ['/delayGain', parseFloat(delayGainSlider.value)]);
        // });
        // sampleStartSlider = document.getElementById("sampleStartSlider");
        // sampleStartSlider.addEventListener('input', function(){
        //     console.log('sampleStart');
        //     socket.emit('pd', ['/sampleStart', parseFloat(sampleStartSlider.value)]);
        // });
        // recordButton = document.getElementById("recordButton");
        // recordButton.addEventListener('click', function(){
        //     console.log('record');
        //     socket.emit('pd', ['/record']);
        // });
        // playButton = document.getElementById("playButton");
        // playButton.addEventListener('click', function(){
        //     console.log('play');
        //     socket.emit('pd', ['/play']);
        // });
        // stopButton = document.getElementById("stopButton");
        // stopButton.addEventListener('click', function(){
        //     console.log('stop');
        //     socket.emit('pd', ['/stop']);
        // });
        // connectPdButton = document.getElementById("connectPd");
        // connectPdButton.addEventListener('click', function(){
        //     console.log('connectPd');
        //     socket.emit('pd', ['/connectPd', parseInt(this.value)]);
        //     this.value = (this.value === '0') ? '1' : '0';
        //     this.innerHTML = (this.value === '0') ? 'Disconnect PD' : 'Connect PD';
        // });
        // sketch.createCanvas(400, 400);
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
