const s = (sketch) => {

    let socket;
    let host = 'localhost';
    // let host = '192.168.0.2';
    let port = '3001';
    let particleShapeBlock;
    let particleColorBlock;
    let particlePerlinBlock;
    let sampleBlock;
    let looperBlock;
    let evenModsBlock;
    let oddModsBlock;
    let particleRadiusSlider;
    let particleLengthSlider;
    let particleBrightnessSlider;
    let particleSaturationSlider;
    let particleLodSlider;
    let particleFalloffSlider;
    let sampleReverseBox;
    let sampleMetronomeSlider;
    let sampleStartSlider;
    let looperDelaySlider;
    let looperDelayGainSlider;
    let modulatorM0Slider;
    let modulatorM1Slider;
    let modulatorM2Slider;
    let modulatorM3Slider;
    let modulatorM4Slider;
    let modulatorM5Slider;
    let modulatorM6Slider;
    let modulatorM7Slider;
    let modulatorM8Slider;
    let modulatorM9Slider;
    let controlSelector;

    function handleUpdateMessage(data){
        if (data['particle-radius']) particleRadiusSlider.value = data['particle-radius'][0];
        if (data['particle-length']) particleLengthSlider.value = data['particle-length'][0];
        if (data['particle-brightness']) particleBrightnessSlider.value = data['particle-brightness'][0];
        if (data['particle-saturation']) particleSaturationSlider.value = data['particle-saturation'][0];
        if (data['particle-lod']) particleLodSlider.value = data['particle-lod'][0];
        if (data['particle-falloff']) particleFalloffSlider.value = data['particle-falloff'][0];
        if (data['sample-reverse']) sampleReverseBox.checked = (data['sample-reverse'][0] == 1) ? true : false;
        if (data['sample-start']) sampleStartSlider.value = data['sample-start'][0];
        if (data['sample-metronome']) sampleMetronomeSlider.value = data['sample-metronome'][0];
        if (data['looper-delay']) looperDelaySlider.value = data['looper-delay'][0];
        if (data['looper-delaygain']) looperDelayGainSlider.value = data['looper-delaygain'][0];
        if (data['modulator-m0']) modulatorM0Slider.value = data['modulator-m0'][0];
        if (data['modulator-m1']) modulatorM1Slider.value = data['modulator-m1'][0];
        if (data['modulator-m2']) modulatorM2Slider.value = data['modulator-m2'][0];
        if (data['modulator-m3']) modulatorM3Slider.value = data['modulator-m3'][0];
        if (data['modulator-m4']) modulatorM4Slider.value = data['modulator-m4'][0];
        if (data['modulator-m5']) modulatorM5Slider.value = data['modulator-m5'][0];
        if (data['modulator-m6']) modulatorM6Slider.value = data['modulator-m6'][0];
        if (data['modulator-m7']) modulatorM7Slider.value = data['modulator-m7'][0];
        if (data['modulator-m8']) modulatorM8Slider.value = data['modulator-m8'][0];
        if (data['modulator-m9']) modulatorM9Slider.value = data['modulator-m9'][0];
    }

    function changeControl(event) {
        particleShapeBlock.setAttribute("hidden", "true");
        particleColorBlock.setAttribute("hidden", "true");
        particlePerlinBlock.setAttribute("hidden", "true");
        sampleBlock.setAttribute("hidden", "true");
        looperBlock.setAttribute("hidden", "true");
        evenModsBlock.setAttribute("hidden", "true");
        oddModsBlock.setAttribute("hidden", "true");
        let value = controlSelector.value;
        console.log(`Control Change: ${value}`);
        if (value == 1) { particleShapeBlock.removeAttribute("hidden") }
        if (value == 2) { particleColorBlock.removeAttribute("hidden") }
        if (value == 3) { particlePerlinBlock.removeAttribute("hidden") }
        if (value == 4) { sampleBlock.removeAttribute("hidden") }
        if (value == 5) { looperBlock.removeAttribute("hidden") }
        if (value == 6) { evenModsBlock.removeAttribute("hidden") }
        if (value == 7) { oddModsBlock.removeAttribute("hidden") }
    }

    sketch.setup = () => {
        let url = `${host}:${port}`;
        socket = io.connect(url);
        socket.on('updateMessage', handleUpdateMessage);
        controlSelector = document.getElementById('control-select');
        controlSelector.addEventListener('change', changeControl);
        particleShapeBlock = document.getElementById('particle-shape');
        particleColorBlock = document.getElementById('particle-color');
        particlePerlinBlock = document.getElementById('particle-perlin');
        sampleBlock = document.getElementById('sample-controls');
        looperBlock = document.getElementById('looper-controls');
        evenModsBlock = document.getElementById('even-modulators');
        oddModsBlock = document.getElementById('odd-modulators');
        particleRadiusSlider = document.getElementById('particle-radius');
        particleRadiusSlider.addEventListener('input', function(){
            console.log('Sending Particle Radius Control');
            socket.emit('browserMessage', {'particle-radius': [parseFloat(particleRadiusSlider.value)]});
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
        sampleReverseBox = document.getElementById("sample-reverse");
        sampleReverseBox.addEventListener('change', function(){
            console.log('Sending Sample Reverse Control');
            let value = (sampleReverseBox.checked) ? 1 : 0;
            socket.emit('browserMessage', {'sample-reverse': [value]});
        });
        sampleStartSlider = document.getElementById("sample-start");
        sampleStartSlider.addEventListener('input', function(){
            console.log('Sending Sample Start Control');
            socket.emit('browserMessage', {'sample-start': [parseFloat(sampleStartSlider.value)]});
        });
        sampleMetronomeSlider = document.getElementById("sample-metronome");
        sampleMetronomeSlider.addEventListener('input', function(){
            console.log('Sending Sample Metronome Control');
            socket.emit('browserMessage', {'sample-metronome': [parseFloat(sampleMetronomeSlider.value)]});
        });
        looperDelaySlider = document.getElementById("looper-delay");
        looperDelaySlider.addEventListener('input', function(){
            console.log('Sending Looper Delay Control');
            socket.emit('browserMessage', {'looper-delay': [parseFloat(looperDelaySlider.value)]});
        });
        looperDelayGainSlider = document.getElementById("looper-delaygain");
        looperDelayGainSlider.addEventListener('input', function(){
            console.log('Sending Looper DelayGain Control');
            socket.emit('browserMessage', {'looper-delaygain': [parseFloat(looperDelayGainSlider.value)]});
        });
        modulatorM0Slider = document.getElementById("modulator-m0");
        modulatorM0Slider.addEventListener('input', function(){
            console.log('Sending Modulator M0 Control');
            socket.emit('browserMessage', {'modulator-m0': [parseFloat(modulatorM0Slider.value)]});
        });
        modulatorM1Slider = document.getElementById("modulator-m1");
        modulatorM1Slider.addEventListener('input', function(){
            console.log('Sending Modulator M1 Control');
            socket.emit('browserMessage', {'modulator-m1': [parseFloat(modulatorM1Slider.value)]});
        });
        modulatorM2Slider = document.getElementById("modulator-m2");
        modulatorM2Slider.addEventListener('input', function(){
            console.log('Sending Modulator M2 Control');
            socket.emit('browserMessage', {'modulator-m2': [parseFloat(modulatorM2Slider.value)]});
        });
        modulatorM3Slider = document.getElementById("modulator-m3");
        modulatorM3Slider.addEventListener('input', function(){
            console.log('Sending Modulator M3 Control');
            socket.emit('browserMessage', {'modulator-m3': [parseFloat(modulatorM3Slider.value)]});
        });
        modulatorM4Slider = document.getElementById("modulator-m4");
        modulatorM4Slider.addEventListener('input', function(){
            console.log('Sending Modulator M4 Control');
            socket.emit('browserMessage', {'modulator-m4': [parseFloat(modulatorM4Slider.value)]});
        });
        modulatorM5Slider = document.getElementById("modulator-m5");
        modulatorM5Slider.addEventListener('input', function(){
            console.log('Sending Modulator M5 Control');
            socket.emit('browserMessage', {'modulator-m5': [parseFloat(modulatorM5Slider.value)]});
        });
        modulatorM6Slider = document.getElementById("modulator-m6");
        modulatorM6Slider.addEventListener('input', function(){
            console.log('Sending Modulator M6 Control');
            socket.emit('browserMessage', {'modulator-m6': [parseFloat(modulatorM6Slider.value)]});
        });
        modulatorM7Slider = document.getElementById("modulator-m7");
        modulatorM7Slider.addEventListener('input', function(){
            console.log('Sending Modulator M7 Control');
            socket.emit('browserMessage', {'modulator-m7': [parseFloat(modulatorM7Slider.value)]});
        });
        modulatorM8Slider = document.getElementById("modulator-m8");
        modulatorM8Slider.addEventListener('input', function(){
            console.log('Sending Modulator M8 Control');
            socket.emit('browserMessage', {'modulator-m8': [parseFloat(modulatorM8Slider.value)]});
        });
        modulatorM9Slider = document.getElementById("modulator-m9");
        modulatorM9Slider.addEventListener('input', function(){
            console.log('Sending Modulator M9 Control');
            socket.emit('browserMessage', {'modulator-m9': [parseFloat(modulatorM9Slider.value)]});
        });
    }
};

let p5_2 = new p5(s);

//
//
//
//
//
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
