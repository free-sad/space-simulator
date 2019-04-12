const mul = 0.01;

class Drone {
  constructor(camera, light) {
    //camera and mesh
    this.camera = camera;
    //this.mesh = mesh;
    this.rotation = new THREE.Matrix4();

    //velocity and acceleration
    this.vel = new THREE.Vector3(0, 0, 0);
    this.accel = new THREE.Vector3(0, 0, 0);

    this.angularVel = new THREE.Vector3(0, 0, 0);

    this.light = light;
  }

  render(delta) {
    let position = new THREE.Vector3();
    let rotation = new THREE.Vector3();

    //integrate
    this.vel.add(this.accel);

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

    //increment camera's position
    this.camera.position.add(position);

    //increment camera's rotation
    camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotation.y);
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.x);

    this.light.position.copy(this.camera.position)
  }
}
