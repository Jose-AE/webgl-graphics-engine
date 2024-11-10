import { quat, vec3 } from "gl-matrix";
import { Vector3 } from "./Vector3";

class Mesh {
  public position: Vector3;
  private rotation: Vector3;
  private scale: Vector3;

  public readonly vertices: Float32Array;
  public readonly triangles: Uint32Array;

  constructor(
    verticesArray: number[],
    trianglesArray: number[],
    position?: Vector3,
    rotation?: Vector3,
    scale?: Vector3
  ) {
    // Initialize the vertices and triangles arrays
    this.vertices = new Float32Array(verticesArray);
    this.triangles = new Uint32Array(trianglesArray);

    this.position = position || new Vector3(0, 0, 0); // Default to (0, 0, 0) if not provided
    this.rotation = rotation || new Vector3(0, 0, 0); // Default to (0, 0, 0) if not provided
    this.scale = scale || new Vector3(1, 1, 1); // Default to (1, 1, 1) if not provided
  }
}
