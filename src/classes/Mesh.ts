import { Vector3 } from "./Vector3";
import { Material } from "./Material";
import { Object3D } from "./Object";

export class Mesh extends Object3D {
  public material: Material;

  public readonly vertices: number[];
  public readonly triangles: number[];

  constructor(
    verticesArray: number[],
    trianglesArray: number[],
    position?: Vector3,
    rotation?: Vector3,
    scale?: Vector3,
    material?: Material
  ) {
    super(position, rotation, scale);

    // Initialize the vertices and triangles arrays
    this.vertices = verticesArray;
    this.triangles = trianglesArray;
    this.material = material || new Material();
  }

  public static CreateCubePrimitive(
    sideLength: number = 1,
    position: Vector3 = new Vector3(),
    rotation: Vector3 = new Vector3(),
    scale: Vector3 = new Vector3(1, 1, 1)
  ): Mesh {
    const halfSide = sideLength / 2;

    //prettier-ignore
    const vertices = [
      // Front face
      -halfSide, -halfSide,  halfSide,
       halfSide, -halfSide,  halfSide,
       halfSide,  halfSide,  halfSide,
      -halfSide,  halfSide,  halfSide,
      // Back face
      -halfSide, -halfSide, -halfSide,
      -halfSide,  halfSide, -halfSide,
       halfSide,  halfSide, -halfSide,
       halfSide, -halfSide, -halfSide,
      // Top face
      -halfSide,  halfSide, -halfSide,
      -halfSide,  halfSide,  halfSide,
       halfSide,  halfSide,  halfSide,
       halfSide,  halfSide, -halfSide,
      // Bottom face
      -halfSide, -halfSide, -halfSide,
       halfSide, -halfSide, -halfSide,
       halfSide, -halfSide,  halfSide,
      -halfSide, -halfSide,  halfSide,
      // Right face
       halfSide, -halfSide, -halfSide,
       halfSide,  halfSide, -halfSide,
       halfSide,  halfSide,  halfSide,
       halfSide, -halfSide,  halfSide,
      // Left face
      -halfSide, -halfSide, -halfSide,
      -halfSide, -halfSide,  halfSide,
      -halfSide,  halfSide,  halfSide,
      -halfSide,  halfSide, -halfSide,
    ];

    //prettier-ignore
    const triangles = [
      0,  1,  2,    0,  2,  3,    // Front
      4,  5,  6,    4,  6,  7,    // Back
      8,  9,  10,   8,  10, 11,   // Top
      12, 13, 14,   12, 14, 15,   // Bottom
      16, 17, 18,   16, 18, 19,   // Right
      20, 21, 22,   20, 22, 23,   // Left
    ];

    const mesh = new Mesh(vertices, triangles);
    mesh.position = position;
    mesh.rotation = rotation;
    mesh.scale = scale;

    return mesh;
  }

  public static CreatePlanePrimitive(
    sideLength: number = 1,
    position: Vector3 = new Vector3(),
    rotation: Vector3 = new Vector3(),
    scale: Vector3 = new Vector3(1, 1, 1)
  ): Mesh {
    const halfSide = sideLength / 2;

    //prettier-ignore
    const vertices = [
      -halfSide, 0.0, -halfSide,  // Vertex 0
      -halfSide, 0.0, halfSide,   // Vertex 1
      halfSide, 0.0, halfSide,    // Vertex 2
      halfSide, 0.0, -halfSide,   // Vertex 3
    ];

    const triangles = [0, 1, 2, 0, 2, 3];

    const mesh = new Mesh(vertices, triangles);
    mesh.position = position;
    mesh.rotation = rotation;
    mesh.scale = scale;

    return mesh;
  }
}
