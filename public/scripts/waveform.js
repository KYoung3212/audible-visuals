console.log('loaded');

// $(document).ready(function() {

var app = app || {};
app.init = init;
app.animate = animate;
app.play = true;

var scene, camera, renderer, controls,
    mouseX = 0, mouseY = 0,
    windowHalfX = window.innerWidth / 2,
    windowHalfY = window.innerHeight / 2;
// init();

function init() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;

    var fov = 60;

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 3000);
    // camera.position.set(0, -450, 700);

    renderer.setClearColor(0x000000, 1);
    window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // var controls = new THREE.OrbitControls(camera, renderer.domElement);

    var PI2 = Math.PI * 2;
    particles = new Array();

    for (var j = 0; j <= 2048; j++) {
        var material = new THREE.SpriteCanvasMaterial({
            color: 0xffffff, program: function (context) {
                context.beginPath();
                //somehow those params make it not draw weird lines on the page
                context.arc(-0.5, 1.25, 1.25, 0, PI2, true);
                context.fill();
            }
        });

        var particle = particles[j++] = new THREE.Particle(material);
        var particlePositionZ = -175;
        var particleSpacing = 3;
        var particleOffset = 0;
        if (j < 256) {
            particle.position.x = (j - 128 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ;
        }
        else if (j >= 256 && j < 512) {
            particle.position.x = (j - 384 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 50;
        }
        else if (j >= 512 && j < 768) {
            particle.position.x = (j - 640 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 100;
        }
        else if (j >= 768 && j < 1024) {
            particle.position.x = (j - 896 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 150;
        }
        else if (j >= 1024 && j < 1280) {
            particle.position.x = (j - 1152 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 200;
        }
        else if (j >= 1280 && j < 1536) {
            particle.position.x = (j - 1408 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 250;
        }
        else if (j >= 1536 && j < 1792) {
            particle.position.x = (j - 1664 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 300;
        }
        else {
            particle.position.x = (j - 1920 - particleOffset) * (particleSpacing);
            particle.position.z = particlePositionZ + 350;
        }
        particle.position.y = 0;
        scene.add(particle)
    }


    // controls.autoRotate = false;
    function onKeyDown(e) {
        switch (e.which) {
            case 32:
                if (app.play) {
                    app.audio.pause();
                    // source.start();
                    app.play = false;
                } else {
                    app.audio.play();
                    // source.stop();
                    app.play = true;
                }
                break;
            case 83:
                if (controls.autoRotate) {
                    controls.autoRotate = false;
                }
                else {
                    controls.autoRotate = true;
                }
                break;
            case 66:
                controls.reset();

        }
        return false;
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }

    // var uintFrequencyData = new Uint8Array(analyser.frequencyBinCount);
    // var floatFrequencyData = new Float32Array(analyser.frequencyBinCount);

    window.addEventListener("keydown", onKeyDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);

}

var GuiControls = function(){
    this.intensity = 1;
    this.color1 = 0xCD0000;
    this.color2 = 0xFF8000;
    this.color3 = 0xFFFF1a;
    this.color4 = 0x009900;
    this.color5 = 0x00CCCC;
    this.color6 = 0x3333FF;
    this.color7 = 0xEE00EE;
    this.color8 = 0xCD3278;
    // this.cameraX = 0;
    this.cameraY = 0;
    this.cameraZ = 0;
    // this.particleHeight = 0;
};

var waveform = new GuiControls();

var gui = new dat.GUI();
gui.closed = true;
gui.addColor(waveform, 'color1').name('Color 1');
gui.addColor(waveform, 'color2').name('Color 2');
gui.addColor(waveform, 'color3').name('Color 3');
gui.addColor(waveform, 'color4').name('Color 4');
gui.addColor(waveform, 'color5').name('Color 5');
gui.addColor(waveform, 'color6').name('Color 6');
gui.addColor(waveform, 'color7').name('Color 7');
gui.addColor(waveform, 'color8').name('Color 8');
gui.add(waveform, 'intensity', 0.5, 4).step(0.5);
// gui.add(waveform, 'particleHeight', -500, 500);
// gui.add(waveform, 'cameraX', -500, 500);
gui.add(waveform, 'cameraY', -560, 1000);
gui.add(waveform, 'cameraZ', 0, 1000);

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    var timeFrequencyData = new Uint8Array(analyser.fftSize);
    // analyser.getByteFrequencyData(uintFrequencyData);
    analyser.getByteTimeDomainData(timeFrequencyData);
    // analyser.getFloatFrequencyData(floatFrequencyData);
    for (var j = 0; j <= 2048; j++){
        // var intensity = 1;
        var particleHeight;


            if (waveform.intensity === 4){
                particleHeight = 209;
            }
            else if (waveform.intensity === 3.5){
                particleHeight = 145;
            }
            else if (waveform.intensity === 3){
                particleHeight = 80;
            }
            else if (waveform.intensity === 2.5){
                particleHeight = 16;
            }
            else if (waveform.intensity === 2){
                particleHeight = -48;
            }
            else if (waveform.intensity === 1.5){
                particleHeight = -111;
            }
            else if (waveform.intensity === 1){
                particleHeight = -175;
            }
            else if (waveform.intensity === 0.5){
                particleHeight = -239;
            }

        particle = particles[j++];
        if (j < 256){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity - particleHeight);
            particle.material.color.setHex(waveform.color1);
        }
        else if (j >= 256 && j < 512){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 75));
            particle.material.color.setHex(waveform.color2);
        }
        else if (j >= 512 && j < 768){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 150));
            particle.material.color.setHex(waveform.color3);
        }
        else if (j >= 768 && j < 1024){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 225));
            particle.material.color.setHex(waveform.color4);
        }
        else if (j >= 1024 && j < 1280){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 300));
            particle.material.color.setHex(waveform.color5);
        }
        else if (j >= 1280 && j < 1536){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 375));
            particle.material.color.setHex(waveform.color6)
        }
        else if (j >= 1536 && j < 1792){
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 450));
            particle.material.color.setHex(waveform.color7)
        }
        else {
            particle.position.y = (timeFrequencyData[j] * waveform.intensity  - (particleHeight + 525));
            particle.material.color.setHex(waveform.color8)
        }
        // particle.material.color.setRGB(1,1 - timeFrequencyData[j]/255,1);

    }

    // camera.rotation.x += -Math.sin(1)/500;
    // camera.rotation.z += -Math.sin(1)/500;
    // camera.position.x = waveform.cameraX;
    camera.position.y = waveform.cameraY - 450;
    camera.position.z = waveform.cameraZ + 700;
    renderer.render(scene, camera);
    camera.lookAt(scene.position);
    // controls.target.set(0,0,0);
    // controls.autoRotate = true;
    // controls.update();
    // controls.autoRotateSpeed = 1.5;
    // controls.target.set(0,0,0);
    // controls.update();
    stats.end()
}

// });
