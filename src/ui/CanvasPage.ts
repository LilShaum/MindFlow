import { globalStore } from '../state/Store.ts';
import { InputController } from '../canvas/InputController.ts';
import { Viewport } from '../canvas/Viewport.ts';
import { Bubble } from '../components/Bubble.ts';

export class CanvasPage {
  private container: HTMLElement;
  private bubbleInstances: Map<string, Bubble> = new Map();

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.innerHTML = `
      <div id="canvas-root" class="canvas-root">
        <div class="canvas-bg"></div>
        <div id="node-layer" class="node-layer"></div>
      </div>
    `;
  }
  mount() {
    const root = document.getElementById('canvas-root') as HTMLElement;
    new InputController(root);

    globalStore.update(() => ({
      nodes: {
        '1': { id: '1', x: 200, y: 200, title: 'Product Vision', color: '#3b82f6', isEditing: false },
        '2': { id: '2', x: 500, y: 150, title: 'Tech Stack', color: '#10b981', isEditing: false }
      }
    }));

    globalStore.subscribe((state) => this.render(state));
    this.render(globalStore.getState());
    
    root.addEventListener('dblclick', (e) => {
      if (e.target === root || (e.target as HTMLElement).classList.contains('canvas-bg')) {
        const pos = Viewport.screenToWorld(e.clientX, e.clientY);
        const newId = crypto.randomUUID();
        const nodes = { ...globalStore.getState().nodes };
        nodes[newId] = { id: newId, x: pos.x, y: pos.y, title: 'New Idea', color: '#3b82f6', isEditing: false };
        globalStore.update(() => ({ nodes }));
      }
    });
  }
  private render(state: ReturnType<typeof globalStore.getState>) {
    const bg = document.querySelector('.canvas-bg') as HTMLElement;
    const nodeLayer = document.getElementById('node-layer') as HTMLElement;
    bg.style.backgroundSize = `${40 * state.camera.z}px ${40 * state.camera.z}px`;
    bg.style.backgroundPosition = `${state.camera.x}px ${state.camera.y}px`;

    for (const id in state.nodes) {
      if (!this.bubbleInstances.has(id)) {
        const bubble = new Bubble(state.nodes[id]);
        this.bubbleInstances.set(id, bubble);
        nodeLayer.appendChild(bubble.getElement());
      } else {
        this.bubbleInstances.get(id)!.updateStyle(state.nodes[id]);
      }
    }
  }
}