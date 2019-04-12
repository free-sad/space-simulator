const mul = 0.01;

class Drone {
  constructor(camera, mesh) {
    //camera and mesh
    this.camera = camera;
    //this.mesh = mesh;

    //velocity and acceleration
    this.vel = new THREE.Vector3(0, 0, 0);
    this.accel = new THREE.Vector3(0, 0, 0);

    this.angularVel = new THREE.Vector3(0, 0, 0);
    this.angularAccel = new THREE.Vector3(0, 0, 0);
  }

  render(delta) {
    let position = new THREE.Vector3();
    let rotation = new THREE.Vector3();

    //integrate
    this.vel.add(this.accel);
    this.angularVel.add(this.angularAccel);

    //clone so we can scalar multiply on the copies
    let deltaPosition = this.vel.clone();
    let deltaRotation = this.angularVel.clone();

    //TODO: incorporate delta - something along the lines of:
    //vel.multiplyScalar(delta[ms] * units / sec)
    //then you can just add vel
    deltaPosition.multiplyScalar(mul);
    deltaRotation.multiplyScalar(mul);

    //add deltas
    position.add(deltaPosition);
    rotation.add(deltaRotation);

    //convert rotation into euler
    let rotationEuler = new THREE.Euler();
    rotationEuler.setFromVector3(rotation);

    //create transformation matrix
    let matrix = new THREE.Matrix4();

    matrix.makeRotationFromEuler(rotationEuler);
    matrix.setPosition(position);

    //apply transformations
    camera.applyMatrix(matrix);
    //mesh.applyMatrix(matrix);
  }
}
