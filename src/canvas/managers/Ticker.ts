import { Clock, EventDispatcher } from 'three';

export type Time = {
  delta: number;
  elapsed: number;
};

export interface TickerEvent {
  type: 'tick';
  time: Time;
}

export class Ticker extends EventDispatcher<TickerEvent> {
  private clock: Clock;
  private requestId: number | null;

  private delta: number;
  private elapsed: number;

  isReady: boolean;

  constructor() {
    super();

    this.clock = new Clock(false);
    this.requestId = null;
    this.delta = 0;
    this.elapsed = 0;
    this.isReady = true;

    this.addListeners();
  }

  start() {
    if (this.requestId || !this.isReady) return;
    this.clock.autoStart = true;
    this.requestId = window.requestAnimationFrame(this.tick);
  }

  stop() {
    if (!this.requestId) return;
    window.cancelAnimationFrame(this.requestId);
    this.requestId = null;
    this.clock.stop();
  }

  private tick = () => {
    this.delta = this.clock.getDelta();
    this.elapsed += this.delta;

    const time = { delta: this.delta, elapsed: this.elapsed };

    this.dispatchEvent({ type: 'tick', time });

    this.requestId = window.requestAnimationFrame(this.tick);
  };

  private visibilityChange = () => {
    document.hidden ? this.stop() : this.start();
  };

  private addListeners() {
    document.addEventListener('visibilitychange', this.visibilityChange);
  }

  private removeListeners() {
    document.removeEventListener('visibilitychange', this.visibilityChange);
  }

  destroy() {
    this.stop();
    this.removeListeners();
  }
}
