export type UUID = string;
export interface IdeaNode { id: UUID; x: number; y: number; title: string; color: string; isEditing: boolean; }
export interface AppState { camera: { x: number; y: number; z: number }; nodes: Record<UUID, IdeaNode>; selection: Set<UUID>; }
type Listener = (state: AppState) => void;

export class Store {
  private state: AppState;
  private listeners: Set<Listener> = new Set();
  constructor() { this.state = { camera: { x: 0, y: 0, z: 1 }, nodes: {}, selection: new Set() }; }
  getState(): AppState { return this.state; }
  update(updater: (draft: AppState) => Partial<AppState>) {
    this.state = { ...this.state, ...updater(this.state) };
    this.listeners.forEach(l => l(this.state));
  }
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
export const globalStore = new Store();