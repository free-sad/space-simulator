//set up Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#222222');
$('body').append(renderer.domElement);

camera.position.z = 5;

//make responsive
$(window).resize(() => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

//draw
const light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(0, 15, 25);
scene.add(light);

const ambient = new THREE.AmbientLight(0x222222);
scene.add(ambient);

const geometry = new THREE.SphereGeometry();
const material = new THREE.MeshLambertMaterial({color: 0xFF00FF});
const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

//render
renderer.render(scene, camera);
