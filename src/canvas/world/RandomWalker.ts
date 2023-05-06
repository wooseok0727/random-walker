import { Group, Mesh, PlaneGeometry, ShaderMaterial } from 'three';
import vertexShader from '../shaders/base.vs';
import directionShader from '../shaders/direction.fs';
import accumulationShader from '../shaders/accumulation.fs';
import outputShader from '../shaders/output.fs';

import type { Scene } from 'three';
import type { Size } from '../managers/Sizes';
import type { Time } from '../managers/Ticker';

export type RandomWalkerMesh = Mesh<PlaneGeometry, ShaderMaterial>;

export class RandomWalker extends Group {
  private baseGeometry!: PlaneGeometry;

  direction!: RandomWalkerMesh;
  accumulation!: RandomWalkerMesh;
  output!: RandomWalkerMesh;

  constructor(private scene: Scene) {
    super();
    this.baseGeometry = new PlaneGeometry(1, 1);
    this.scene.add(this);
    this.createObjects();
  }

  createObjects() {
    const directionMeaterial = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: [0, 0] },
        uTime: { value: -3 },
      },
      vertexShader,
      fragmentShader: directionShader,
    });

    const accumulationMaterial = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: [0, 0] },
        uTime: { value: -3 },
      },
      vertexShader,
      fragmentShader: accumulationShader,
    });

    const outputMaterial = new ShaderMaterial({
      uniforms: {
        tDiffuse: { value: null },
      },
      vertexShader,
      fragmentShader: outputShader,
    });

    this.direction = new Mesh(this.baseGeometry, directionMeaterial);
    this.accumulation = new Mesh(this.baseGeometry, accumulationMaterial);
    this.output = new Mesh(this.baseGeometry, outputMaterial);

    this.direction.layers.set(0);
    this.accumulation.layers.set(1);
    this.output.layers.set(2);

    this.add(this.direction, this.accumulation, this.output);
  }

  resize(size: Size) {
    this.direction.scale.set(size.width, size.height, 1);
    this.accumulation.scale.set(size.width, size.height, 1);
    this.output.scale.set(size.width, size.height, 1);

    this.direction.material.uniforms.uResolution.value = [size.width, size.height];
    this.accumulation.material.uniforms.uResolution.value = [size.width, size.height];
  }

  update(time: Time) {
    this.direction.material.uniforms.uTime.value += time.delta;
    this.accumulation.material.uniforms.uTime.value += time.delta;
  }

  dispose() {
    this.baseGeometry.dispose();

    this.direction.material.dispose();
    this.accumulation.material.dispose();
    this.output.material.dispose();
  }
}
