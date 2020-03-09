const s = (sketch) => {

    let socket;
    // let host = 'localhost';
    let host = '192.168.0.2';
    let port = '3001';
    let width =2000;
    let height = 1200;
    let mainCanvas;
    let systems = [];
    let xOffsetInc = .01;
    let totalSystems = 20;
    let length = 5;
    let maxSteps = 100;
    let lod = 4;
    let falloff = .5;
    let fullScreenButton;
    let size = 10;
    let noiseAngleWindow = 4;
    let particleSizeInc = -0.1;
    let saturation = 50;
    let clear = false;
    let on = true;
    let brightness = 50;
    let threshold = 0;
    let testMessages = [
        ['/bark', 0.32900553941726685, 0.07359276711940765, 0.18524616956710815, 0.5177004337310791, 0.21738919615745544, 0.2545403838157654, 0.05231967568397522, 0, 0,0,0,0,0,0,0,0.006447233259677887, 0.018036864697933197, 0.03594883158802986, 0.5351402759552002, 0.24375838041305542, 0, 0, 0, 0.09293131530284882, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['/bark', 0,0,0,0, 0, 0.006447233259677887, 0.018036864697933197, 0.03594883158802986, 0.5351402759552002, 0.24375838041305542, 0, 0, 0.09293131530284882, 0, 0, 0, 0, 0, 0, 0, 0, 0.32900553941726685, 0.07359276711940765, 0.18524616956710815, 0.5177004337310791, 0.21738919615745544, 0.2545403838157654, 0.05231967568397522, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ['/bark', 0,0, 0, 0, 0.006447233259677887, 0.018036864697933197, 0.03594883158802986, 0.5351402759552002, 0.24375838041305542, 0, 0, 0, 0.09293131530284882, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.32900553941726685, 0.07359276711940765, 0.18524616956710815, 0.5177004337310791, 0.21738919615745544, 0.2545403838157654, 0.05231967568397522, 0]
    ];

    function fullscreen(){
        let el = document.getElementById('canvas');
        el.width = 2000;
        el.height = 1000;
        width = 2000;
        height = 1000;
        if(el.webkitRequestFullScreen) {
            el.webkitRequestFullScreen();
        } else {
            el.mozRequestFullScreen();
        }
    }

    sketch.setup = () => {
        let url = `http://${host}:${port}`;
        socket = io.connect(url);
        socket.on('updateMessage', handleUpdateMessage);
        socket.on('newSystem', newSystem);
        mainCanvas = sketch.createCanvas(width, height);
        mainCanvas.parent('canvas');
        fullScreenButton = document.getElementById('fullScreenButton');
        fullScreenButton.addEventListener('click', fullscreen);
        sketch.colorMode(sketch.HSB);
        sketch.noiseDetail(lod, falloff);
        sketch.background(0);

    };

    function updateNoiseDetail(l, f){
        sketch.noiseDetail(l, f);
    }

    sketch.keyPressed = () => {
        newSystem(testMessages[Math.floor(Math.random()*3)])
    };

    class Particle {
        constructor(x, y, angle, magnitude, hue) {
            this.pos = sketch.createVector(x, y);
            this.magnitude = magnitude;
            this.xOffset = (Math.random() * 10000);
            this.vel = p5.Vector.fromAngle(sketch.noise(this.xOffset) * noiseAngleWindow * sketch.PI, this.magnitude * length);
            this.hue = hue;
            this.step = 0;
            this.size = size;
        }

        update() {
            this.step++;
            this.xOffset += xOffsetInc;
            if (this.step < maxSteps) {
                this.size += particleSizeInc;
                this.vel = p5.Vector.fromAngle(sketch.noise(this.xOffset) * noiseAngleWindow * sketch.PI, this.magnitude * length);
                this.pos.add(this.vel);
            }
        }

        show() {
            sketch.strokeWeight(1);
            sketch.stroke(20);
            sketch.fill(this.hue, saturation, brightness);
            sketch.ellipse(this.pos.x, this.pos.y, this.size, this.size);
        }
    }

    function handleUpdateMessage(data) {
        console.log("Received Update Message", data);
        if (data['particle-radius']) size = data['particle-radius'][0];
        if (data['particle-length']) length = data['particle-length'][0];
        if (data['particle-brightness']) brightness = data['particle-brightness'][0];
        if (data['particle-saturation']) saturation = data['particle-saturation'][0];
        if (data['particle-lod']) updateNoiseDetail(Math.ceil(data['particle-lod'][0]), falloff);
        if (data['particle-falloff']) updateNoiseDetail(lod, data['particle-falloff'][0]);
        if (data['particle-clear']) clear = true;
    }

    function newSystem(data){
        // console.log(data[0]);
        // console.log(data[1]);

        let systemX = Math.floor(Math.random() * width);
        let systemY = Math.floor(Math.random() * height);
        let systemColor = Math.floor(Math.random() * 360);
        let particles = [];

        for (let i = 0; i < data.length; i++){
            if (data[i] > threshold) {
                let particle = new Particle(systemX, systemY, i, data[i], systemColor);
                particles.push(particle);
            }
        }
        if (systems.length < totalSystems){
            systems.push(particles);
        } else {
            systems.shift();
            systems.push(particles);
        }

        // console.log(systems.length);
    }

    function drawSystem(particles) {
        // console.log(JSON.stringify(particles));
        sketch.noStroke();
        for (let i = 0; i < particles.length; i++) {
            if (particles[i] != null) {
                particles[i].show();
                particles[i].update();
            }
        }
    }

    sketch.draw = () => {
        if (sketch.keyIsDown(32) || clear){
            systems = [];
            sketch.background(0);
            clear = false;
        }
        for (let i = 0; i < systems.length; i++) {
            drawSystem(systems[i])
        }
    }
};

let p5_2 = new p5(s);
