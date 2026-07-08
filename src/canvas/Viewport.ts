import { globalStore } from '../state/Store.ts';

export class Viewport {
  static screenToWorld(screenX: number, screenY: number) {
    const { camera } = globalStore.getState();
    return { x: (screenX - camera.x) / camera.z, y: (screenY - camera.y) / camera.z };
  }
  static zoom(deltaZ: number, mouseX: number, mouseY: number) {
    const { camera } = globalStore.getState();
    let newZ = Math.max(0.1, Math.min(3.0, camera.z - deltaZ));
    const scaleChange = newZ - camera.z;
    const newX = camera.x - (mouseX - camera.x) * (scaleChange / camera.z);
    const newY = camera.y - (mouseY - camera.y) * (scaleChange / camera.z);
    globalStore.update(() => ({ camera: { x: newX, y: newY, z: newZ } }));
  }
  static pan(dx: number, dy: number) {
    const { camera } = globalStore.getState();
    globalStore.update(() => ({ camera: { x: camera.x + dx, y: camera.y + dy, z: camera.z } }));
  }
}