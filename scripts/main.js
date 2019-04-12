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
    drone.accel.z = sign(gamepad.axes[1]);
    drone.accel.x = sign(gamepad.axes[0]);
    drone.accel.y = sign(gamepad.buttons[5].value) - sign(gamepad.buttons[4].value)

    drone.angularVel.x = -sign(gamepad.axes[3]);
    drone.angularVel.y = -sign(gamepad.axes[2]);


    if(gamepad.buttons[9].value === 1.0){ //start button freeze in place
      drone.accel = new THREE.Vector3(0, 0, 0);
      drone.vel = new THREE.Vector3(0, 0, 0);
    }

    if(gamepad.buttons[8].value === 1.0){ //start button freeze in place
      console.log(camera.matrix)
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
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({antialias: true});

  controls = new THREE.DroneGamepadControls(cameraControlCallback);

  loader = new THREE.GLTFLoader();

  //set up three.js
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.setClearColor('#222222');
  $('body').append(renderer.domElement);

  drone = new Drone(camera);

  //add light
  const light = new THREE.PointLight(0xFFFFFF, 1, 0); //white, intensity of 1, no distance limit
  light.position.set(0, 15, 25);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x333333);
  scene.add(ambient);


  //add test sphere
  const geometry = new THREE.SphereGeometry();
  const material = new THREE.MeshLambertMaterial({color: 0xFF00FF});
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);


  //load iss
  loader.load('./assets/scene.gltf', gltf => {
    gltf.scene.scale.set(10, 10, 10);
    gltf.scene.position.set(0, 500, -500);
    gltf.scene.rotation.set(Math.PI, Math.PI/2, 0);
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
