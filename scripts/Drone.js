const mul = 0.01;

class Drone {
  constructor(camera, light, leftarm, rightarm) {
    //camera and mesh
    this.camera = camera;
    //this.mesh = mesh;
    this.rotation = new THREE.Matrix4();

    //controller input (local x,y,z)
    this.control = new THREE.Vector3();

    //initial velocity and acceleration
    this.vel = new THREE.Vector3(0, 0, 0);
    this.accel = new THREE.Vector3(0, 0, 0);

    this.angularVel = new THREE.Vector3(0, 0, 0);

    this.light = light;

    this.gov = false;
    this.maxSpeed = 50;

    this.leftarm = leftarm;
    this.rightarm = rightarm;
  }

  render(delta) {
    //rotate control vector to world grid
    this.accel.copy(this.control);
    //this.accel.applyQuaternion(this.camera.quaternion);

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

    deltaPosition.applyQuaternion(this.camera.quaternion);

    //increment camera's position
    this.camera.position.add(deltaPosition);

    //increment camera's rotation
    camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), deltaRotation.x);
    camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), deltaRotation.y);
    camera.rotateOnAxis(new THREE.Vector3(0, 0, 1), deltaRotation.z);

    this.light.position.copy(this.camera.position);
    this.leftarm.position.copy(this.camera.position);
    this.leftarm.quaternion.copy(this.camera.quaternion);
    this.rightarm.position.copy(this.camera.position);
    this.rightarm.quaternion.copy(this.camera.quaternion);


    // this.arm.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.0*Math.PI)
    //this.arm.rotateOnAxis(new THREE.Vector3(0, 1, 0), 1.2*Math.PI)
    // this.arm.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.1*Math.PI)

    //this.arm.position.add(new THREE.Vector3(1, -1, -1));

    //this.arm.applyMatrix(new THREE.Matrix4().makeTranslation(1, -1, -10));
    //this.arm.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)
  }
}
