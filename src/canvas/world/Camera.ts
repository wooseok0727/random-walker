import { PerspectiveCamera } from 'three';

import type { Size } from '../managers/Sizes';

export class Camera {
  instance!: PerspectiveCamera;

  constructor() {
    this.setInstance();
  }

  private setInstance() {
    this.instance = new PerspectiveCamera();
    this.instance.position.z = 10;
    this.instance.far = 100;
  }

  resize(size: Size) {
    this.instance.aspect = size.width / size.height;
    this.instance.fov = 2 * Math.atan((size.height * 0.5) / this.instance.position.z) * (180 / Math.PI);
    this.instance.updateProjectionMatrix();
  }
}
