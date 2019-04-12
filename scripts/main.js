//set up Three.js
let scene;
let camera;
let renderer;

let controls;
let loaders;

let clock = new THREE.Clock();

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({antialias: true});

  controls = new THREE.GamepadControls(camera);

  loader = new THREE.GLTFLoader();

  //set up three.js
  renderer.setSize(window.innerWidth, window.innerHeight);
  //renderer.setClearColor('#222222');
  $('body').append(renderer.domElement);

  camera.position.z = 5;

  //add light
  const light = new THREE.PointLight(0xFFFFFF, 1, 500);
  light.position.set(0, 15, 25);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0x333333);
  scene.add(ambient);


  //add test sphere
  // const geometry = new THREE.SphereGeometry();
  // const material = new THREE.MeshLambertMaterial({color: 0xFF00FF});
  // const mesh = new THREE.Mesh(geometry, material);
  // scene.add(mesh);


  //load iss
  loader.load('./assets/scene.gltf', gltf => {
    console.log(gltf.scene);
    gltf.scene.scale.set(0.1, 0.1, 0.1);
    gltf.scene.position.set(0, 5, -5);
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

  renderer.render(scene, camera);
}
