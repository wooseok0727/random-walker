import { EventDispatcher } from 'three';
import gsap from 'gsap';

import type { Size } from '../managers/Sizes';

export class LoadingIndicator extends EventDispatcher {
  private cntr!: HTMLElement;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;

  private size: number;
  private x: number;
  private y: number;
  private pct: number;

  private progressTl: GSAPTimeline | null = null;

  constructor() {
    super();

    this.size = 48;
    this.x = this.y = this.size / 2;
    this.pct = 0;

    this.setCanvas();
  }

  private setCanvas() {
    this.cntr = document.querySelector<HTMLDivElement>('.loading') as HTMLDivElement;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'pct';
    this.cntr.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  progress(pct: number) {
    this.progressTl?.kill();

    this.progressTl = gsap.timeline();
    this.progressTl
      .to(this, {
        pct: pct * 100,
        duration: 0.8,
        ease: 'power1.out',
        onUpdate: () => this.update(),
      })
      .add(() => document.body.classList.add('loaded'))
      .add(() => this.destroy(), '+=2.1');
  }

  private update = () => {
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.ctx.font = 'bold 15px Arial';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`${~~this.pct}`, this.x, this.y);
  };

  resize(size: Size) {
    this.canvas.width = this.canvas.height = Math.round(this.size * size.dpr);
    this.canvas.style.width = this.canvas.style.height = `${this.size}px`;
    this.ctx.scale(size.dpr, size.dpr);
  }

  destroy = () => {
    this.progressTl?.kill();
    this.cntr.removeChild(this.canvas);
    this.cntr.parentNode?.removeChild(this.cntr);
  };
}
