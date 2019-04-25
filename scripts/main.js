const threshold = 0.5; //controller axis threshold

//set up Three.js
let scene;
let camera;
let renderer;

let controls;
let loaders;

let clock = new THREE.Clock();

let drone;

init();
animate();

function cameraControlCallback(gamepad) {
  if(drone) {
    let control = new THREE.Vector3(
      sign(gamepad.axes[0]),
      sign(gamepad.buttons[7].value) - sign(gamepad.buttons[6].value),
      sign(gamepad.axes[1])
    );


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
      drone.control.set(x, y, z);
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

  const droneLight = new THREE.PointLight(0xCCCCCC, 0.5, 25);
  drone = new Drone(camera, droneLight);
  scene.add(droneLight);

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
}

function render() {
  let delta = clock.getDelta();

  //controls.update(delta);
  drone.render();

  renderer.render(scene, camera);
}
