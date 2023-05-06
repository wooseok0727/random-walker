import { FloatType, HalfFloatType, NearestFilter, WebGLRenderTarget, WebGLRenderer, sRGBEncoding } from 'three';

import type { Scene, PerspectiveCamera } from 'three';
import type { Size } from './Sizes';
import type { RandomWalker } from '../world/RandomWalker';

export class Renderer {
  private instance!: WebGLRenderer;

  private backBuffer!: WebGLRenderTarget;
  private frontBuffer!: WebGLRenderTarget;

  constructor(private cntr: HTMLElement, private camera: PerspectiveCamera, private scene: Scene) {
    this.setInstance();
  }

  private setInstance() {
    this.instance = new WebGLRenderer({ antialias: true });
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.autoClear = false;

    this.cntr.appendChild(this.instance.domElement);
  }

  setRenderTarget(randomWalker: RandomWalker) {
    const supported = this.instance.extensions.has('OES_texture_float_linear');
    this.frontBuffer = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    this.frontBuffer.texture.type = supported ? FloatType : HalfFloatType;
    this.frontBuffer.texture.magFilter = NearestFilter;
    this.frontBuffer.texture.minFilter = NearestFilter;

    this.backBuffer = this.frontBuffer.clone();

    randomWalker.direction.material.uniforms.tDiffuse.value = this.frontBuffer.texture;
    randomWalker.accumulation.material.uniforms.tDiffuse.value = this.backBuffer.texture;
    randomWalker.output.material.uniforms.tDiffuse.value = this.frontBuffer.texture;
  }

  resize(size: Size) {
    this.instance.setSize(size.width, size.height);
    this.instance.setPixelRatio(size.dpr);

    this.frontBuffer.setSize(Math.round(size.width * size.dpr), Math.round(size.height * size.dpr));
    this.backBuffer.setSize(Math.round(size.width * size.dpr), Math.round(size.height * size.dpr));
  }

  update() {
    this.camera.layers.set(0);
    this.instance.setRenderTarget(this.backBuffer);
    this.instance.clear();
    this.instance.render(this.scene, this.camera);

    this.camera.layers.set(1);
    this.instance.setRenderTarget(this.frontBuffer);
    this.instance.clear();
    this.instance.render(this.scene, this.camera);

    this.camera.layers.set(2);
    this.instance.setRenderTarget(null);
    this.instance.clear();
    this.instance.render(this.scene, this.camera);
  }

  dispose() {
    this.backBuffer.dispose();
    this.frontBuffer.dispose();
    this.instance.dispose();
    this.cntr.removeChild(this.instance.domElement);
  }
}
