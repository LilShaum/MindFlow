import { IdeaNode, globalStore } from '../state/Store.ts';

export class Bubble {
  private element: HTMLDivElement;
  private id: string;

  constructor(nodeData: IdeaNode) {
    this.id = nodeData.id;
    this.element = document.createElement('div');
    this.element.className = 'bubble-node';
    this.element.innerHTML = `<div class="bubble-title" contenteditable="false">${nodeData.title}</div>`;
    this.updateStyle(nodeData);
    this.attachEvents();
  }
  getElement() { return this.element; }
  updateStyle(nodeData: IdeaNode) {
    const { camera } = globalStore.getState();
    const screenX = (nodeData.x * camera.z) + camera.x;
    const screenY = (nodeData.y * camera.z) + camera.y;
    this.element.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) scale(${camera.z})`;
    this.element.style.borderTopColor = nodeData.color;
  }
  private attachEvents() {
    let isDragging = false;
    let startPos = { x: 0, y: 0 };
    let initialNodePos = { x: 0, y: 0 };

    this.element.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).classList.contains('bubble-title') && this.element.classList.contains('editing')) return;
      e.stopPropagation();
      isDragging = true;
      startPos = { x: e.clientX, y: e.clientY };
      initialNodePos = { x: globalStore.getState().nodes[this.id].x, y: globalStore.getState().nodes[this.id].y };
      this.element.classList.add('dragging');
    });
    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const { camera, nodes } = globalStore.getState();
      const dx = (e.clientX - startPos.x) / camera.z;
      const dy = (e.clientY - startPos.y) / camera.z;
      nodes[this.id] = { ...nodes[this.id], x: initialNodePos.x + dx, y: initialNodePos.y + dy };
      globalStore.update(() => ({ nodes: { ...nodes } }));
    });
    window.addEventListener('pointerup', () => { isDragging = false; this.element.classList.remove('dragging'); });
    this.element.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      const titleEl = this.element.querySelector('.bubble-title') as HTMLElement;
      titleEl.contentEditable = 'true';
      titleEl.focus();
      this.element.classList.add('editing');
    });
    this.element.addEventListener('focusout', () => {
      const titleEl = this.element.querySelector('.bubble-title') as HTMLElement;
      titleEl.contentEditable = 'false';
      this.element.classList.remove('editing');
      const nodes = globalStore.getState().nodes;
      nodes[this.id] = { ...nodes[this.id], title: titleEl.innerText };
      globalStore.update(() => ({ nodes: { ...nodes } }));
    });
  }
}