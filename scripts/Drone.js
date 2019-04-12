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

    this.lookat = new THREE.Vector3(0, 0, -1);
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

    //matrix.makeRotationFromEuler(rotationEuler);
    //matrix.lookAt(this.camera.position, rotation, new THREE.Vector3(0, 0, 1));
    //position.applyMatrix4(matrix);
    //matrix.setPosition(position);

    //apply transformations
    //this.camera.applyMatrix(matrix);

    camera.position.add(position);
    //camera.rotation.add(rotation);
    camera.rotation.y += rotation.y;
    camera.rotation.x += rotation.x
    camera.rotation.z += rotation.z;


    console.log(this.camera.rotation)


    // this.lookat.add(rotation);
    //
    // this.camera.lookAt(this.lookat);

    //position.applyMatrix4(this.camera.matrix);

    //camera.position.add(position);
    //mesh.applyMatrix(matrix);

    //camera.lookAt(rotation);

  }
}
