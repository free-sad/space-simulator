const threshold = 0.5; //controller axis threshold

//Drone connection
const droneURL = 'ws://192.168.1.108:81';
let ws;
let sendStateInterval;
let tryWebSocketConnectionTimeout;
let closeWebSocketWatchDog;
let gameState = {
  controller: {
    x: 0,
    y: 0,
    z: 0
  },
  state: {
    governor: false
  }
};


//set up Three.js
let scene;
let camera;
let renderer;

let controls;
let loaders;

let clock = new THREE.Clock();

let drone;

initWebSocket();

init();
animate();

function initWebSocket(){
  tryWebSocketConnectionTimeout = null;

  ws = new WebSocket(droneURL);

  ws.addEventListener('open', event => {
    $('#connection-status').text('connected');
    $('#connection-status').css('color', 'green');

    //send web socket every 100ms
    sendStateInterval = setInterval(sendState, 100);
  });

  ws.addEventListener('error', event => {
    $('#connection-status').text('disconnected');
    $('#connection-status').css('color', 'red');
  });

  ws.addEventListener('message', event => {
    //kick the watchdog every time we get a message back from the drone
    if(event.data === "ACK") {
      clearTimeout(closeWebSocketWatchDog);
      closeWebSocketWatchDog = setTimeout(closeWebSocket, 5000); //closing the websocket will start the reconnection process
    }
  });
}

function sendState() {
  if(ws.readyState === WebSocket.OPEN) {
    //send if the socket is open
    ws.send(JSON.stringify(gameState));
  } else if(ws.readyState === WebSocket.CLOSED) {
    //if the socket is closed, re-init the connection in a second
    $('#connection-status').text('disconnected');
    $('#connection-status').css('color', 'red');

    if(!tryWebSocketConnectionTimeout) {
      console.error('web socket disconnected, trying to reconnect');
      tryWebSocketConnectionTimeout = setTimeout(initWebSocket, 1000);
    }
  }
}

function closeWebSocket() {
  ws.close();

  $('#connection-status').text('disconnected');
  $('#connection-status').css('color', 'red');
}

function cameraControlCallback(gamepad) {
  if(drone) {
    let control = new THREE.Vector3(
      sign(gamepad.axes[0]),
      sign(gamepad.buttons[7].value) - sign(gamepad.buttons[6].value),
      sign(gamepad.axes[1])
    );

    gameState.controller.x = sign(gamepad.axes[0]);
    gameState.controller.y = sign(gamepad.buttons[7].value) - sign(gamepad.buttons[6].value);
    gameState.controller.z = sign(gamepad.axes[1]);


    if(drone.gov) { //if governor is enabled
      if(control.length() > 0) { //if controller is inputting a speed
        if(drone.vel.length() < drone.maxSpeed) {
          drone.control.copy(control);
        } else {
          drone.control.set(0, 0, 0);
        }
      } else { //else (joysticks set to 0)

        //if this axis has velocity,
        if(Math.abs(drone.vel.x) > 0.5) {
          //apply thruster in the reverse direction
          drone.control.x = - Math.sign(drone.vel.x);
        } else {
          //else turn off thruster
          drone.control.x = 0;
        }

        if(Math.abs(drone.vel.y) > 0.5) {
          drone.control.y = - Math.sign(drone.vel.y);
        } else {
          drone.control.y = 0;
        }

        if(Math.abs(drone.vel.z) > 0.5) {
          drone.control.z = - Math.sign(drone.vel.z);
        } else {
          drone.control.z = 0;
        }
      }
    } else {
      //otherwise have the controller directly control the thrusters
      drone.control.copy(control);
    }

    //set rotation with right joystick and bumpers
    drone.angularVel.x = -sign(gamepad.axes[3]);
    drone.angularVel.y = -sign(gamepad.axes[2]);
    drone.angularVel.z = -sign(gamepad.buttons[5].value) + sign(gamepad.buttons[4].value)

    if(gamepad.buttons[9].value === 1.0){ //reset
      drone.accel = new THREE.Vector3(0, 0, 0);
      drone.vel = new THREE.Vector3(0, 0, 0);
      drone.camera.position.set(0, 0, 0);
      drone.camera.rotation.set(0, 0, 0);
    }

    if(gamepad.buttons[8].value === 1.0){ //back button
      // drone.accel = new THREE.Vector3(0, 0, 0);
      // drone.vel = new THREE.Vector3(0, 0, 0);
      drone.gov = !drone.gov;
    }
  }
}

function sign(buttonValue) {
  if(Math.abs(buttonValue) < threshold) {
    return 0;
  } else if(buttonValue > 0) {
    return 1;
  } else if(buttonValue < 0) {
    return -1;
  }
}

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
  renderer = new THREE.WebGLRenderer({antialias: true});

  controls = new THREE.DroneGamepadControls(cameraControlCallback);

  loader = new THREE.GLTFLoader();

  //set up three.js
  renderer.setSize(window.innerWidth, window.innerHeight);
  $('body').append(renderer.domElement);

  loader.load('./assets/roboarm2.glb', glb => {
    console.log(glb);

    scene.add(glb.scene);
    leftarm = glb.scene;
    rightarm = leftarm.clone()
    rightarm.scale.x = -1

    scene.add(rightarm);

    //arm.applyMatrix(new THREE.Matrix4().makeTranslation(1, -1, -10));


    const droneLight = new THREE.PointLight(0xCCCCCC, 0.5, 25);
    drone = new Drone(camera, droneLight, leftarm, rightarm);
    scene.add(droneLight);
  });

  //add light
  const light = new THREE.PointLight(0xFFFFFF, 1, 0); //white, intensity of 1, no distance limit
  light.position.set(Math.random()*500 - 250, Math.random()*500 - 250, Math.random()*500 - 250);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x111111);
  scene.add(ambient);


  //add test sphere
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshPhongMaterial({color: 0xFF00FF});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  //load iss
  loader.load('./assets/scene.gltf', gltf => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, 500, -500);
    gltf.scene.rotation.set(Math.PI, Math.PI/2, 0);
    gltf.scene.overrideMaterial = new THREE.MeshPhongMaterial();

    console.log(gltf)

    scene.add(gltf.scene);
  });


  //make responsive
  $(window).resize(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

function animate() {
  requestAnimationFrame(animate);

  render();
  updateHUD();
}

function render() {
  let delta = clock.getDelta();

  //controls.update(delta);
  if(drone) {
    drone.render();
  }

  renderer.render(scene, camera);
}

function updateHUD() { //update velocity/etc html elements
  if(drone) {
    const x = (drone.vel.x / 10).toFixed().toString().padStart(3);
    const y = (drone.vel.y / 10).toFixed().toString().padStart(3);
    const z = (drone.vel.z / -10).toFixed().toString().padStart(3); //flip z direction to be more intuitive to the user

    const velString = `x: ${x} y: ${y} z: ${z}`;
    $('#velocity').text(velString)
  }
};
