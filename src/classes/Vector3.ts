// Vector3.ts
export class Vector3 {
  public x: number;
  public y: number;
  public z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  // Static method to add two vectors
  public static add(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  // Static method to subtract one vector from another
  public static subtract(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  // Static method to multiply a vector by a scalar
  public static multiplyScalar(v: Vector3, scalar: number): Vector3 {
    return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
  }

  // Static method to compute the dot product of two vectors
  public static dot(v1: Vector3, v2: Vector3): number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  }

  // Static method to compute the cross product of two vectors
  public static cross(v1: Vector3, v2: Vector3): Vector3 {
    return new Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
  }

  // Static method to compute the magnitude (length) of a vector
  public static magnitude(v: Vector3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  // Static method to normalize a vector (make it unit length)
  public static normalize(v: Vector3): Vector3 {
    const mag = Vector3.magnitude(v);
    if (mag === 0) return new Vector3(0, 0, 0); // Prevent division by zero
    return Vector3.multiplyScalar(v, 1 / mag);
  }

  // Static method to calculate the distance between two vectors
  public static distance(v1: Vector3, v2: Vector3): number {
    return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
  }

  // Static method to check if two vectors are equal
  public static equals(v1: Vector3, v2: Vector3): boolean {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }

  // Instance method to set values of the vector
  public set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  // Instance method to print vector as a string (for debugging)
  public toString(): string {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`;
  }
}
