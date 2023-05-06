import { EventDispatcher } from 'three';
import debounce from 'lodash.debounce';

export type Size = {
  width: number;
  height: number;
  dpr: number;
};

export type SizesEvent = {
  type: 'resize';
  size: Size;
};

export class Sizes extends EventDispatcher<SizesEvent> {
  private width: number;
  private height: number;
  private dpr: number;

  constructor() {
    super();

    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.dpr = Math.min(window.devicePixelRatio, 2);

    this.addListeners();
  }

  private debouncedResize = debounce(() => this.resize(), 100);

  resize = () => {
    this.width = document.documentElement.clientWidth;
    this.height = document.documentElement.clientHeight;
    this.dpr = Math.min(window.devicePixelRatio, 2);

    const size = {
      width: this.width,
      height: this.height,
      dpr: this.dpr,
    };

    this.dispatchEvent({ type: 'resize', size });
  };

  private addListeners() {
    window.addEventListener('resize', this.debouncedResize);
  }

  private removeListeners() {
    window.removeEventListener('resize', this.debouncedResize);
  }

  destroy() {
    this.removeListeners();
  }
}
