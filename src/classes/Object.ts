import { Vector3 } from "./Vector3";

export class Object3D {
  public position: Vector3;
  public rotation: Vector3;
  public scale: Vector3;

  constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3) {
    this.position = position || new Vector3(0, 0, 0); // Default to (0, 0, 0) if not provided
    this.rotation = rotation || new Vector3(0, 0, 0); // Default to (0, 0, 0) if not provided
    this.scale = scale || new Vector3(1, 1, 1); // Default to (1, 1, 1) if not provided
  }
}
