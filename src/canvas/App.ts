import { Scene } from 'three';
import { Sizes } from './managers/Sizes';
import { Ticker } from './managers/Ticker';
import { Renderer } from './managers/Renderer';
import { Camera } from './world/Camera';
import { RandomWalker } from './world/RandomWalker';
import { LoadingIndicator } from './utils/LoadingIndicator';

import type { SizesEvent } from './managers/Sizes';
import type { TickerEvent } from './managers/Ticker';

export class App {
  private sizes: Sizes;
  private ticker: Ticker;

  private scene: Scene;
  private camera: Camera;
  private renderer: Renderer;
  private randomWalker: RandomWalker;

  private loadingIndicator: LoadingIndicator;

  constructor(private cntr: HTMLElement) {
    this.sizes = new Sizes();
    this.ticker = new Ticker();

    this.scene = new Scene();
    this.camera = new Camera();
    this.randomWalker = new RandomWalker(this.scene);
    this.renderer = new Renderer(this.cntr, this.camera.instance, this.scene);
    this.loadingIndicator = new LoadingIndicator();

    this.addListeners();
    this.renderer.setRenderTarget(this.randomWalker);
    this.sizes.resize();
    this.ticker.start();

    this.loadingIndicator.progress(1);
  }

  private resize = (e: SizesEvent) => {
    this.camera.resize(e.size);
    this.renderer.resize(e.size);
    this.randomWalker.resize(e.size);
    this.loadingIndicator.resize(e.size);
  };

  private update = (e: TickerEvent) => {
    this.randomWalker.update(e.time);
    this.renderer.update();
  };

  private addListeners() {
    this.sizes.addEventListener('resize', this.resize);
    this.ticker.addEventListener('tick', this.update);
  }
  private removeListeners() {
    this.sizes.removeEventListener('resize', this.resize);
    this.ticker.removeEventListener('tick', this.update);
  }

  destroy() {
    this.removeListeners();
    this.ticker.destroy();
    this.sizes.destroy();
    this.randomWalker.dispose();
    this.renderer.dispose();
  }
}
