import { Viewport } from './Viewport.ts';

export class InputController {
  private container: HTMLElement;
  private isDragging = false;
  private lastMouse = { x: 0, y: 0 };

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) Viewport.zoom(e.deltaY * 0.01, e.clientX, e.clientY);
      else Viewport.pan(-e.deltaX, -e.deltaY);
    }, { passive: false });
    
    this.container.addEventListener('pointerdown', (e) => {
      if (e.target === this.container || (e.target as HTMLElement).classList.contains('canvas-bg')) {
        this.isDragging = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
        this.container.style.cursor = 'grabbing';
      }
    });
    window.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      Viewport.pan(e.clientX - this.lastMouse.x, e.clientY - this.lastMouse.y);
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
      this.container.style.cursor = 'default';
    });
  }
}