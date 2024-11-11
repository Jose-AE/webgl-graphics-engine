import { Vector3 } from "./Vector3";

export class Matrix4x4 {
  public readonly values: Float32Array;

  constructor(values?: number[]) {
    if (values) {
      this.values = new Float32Array(values);
    } else {
      //prettier-ignore
      this.values = new Float32Array(
            [1, 0, 0, 0,
            0, 1, 0, 0, 
            0, 0, 1, 0,
            0, 0, 0, 1]);
    }
  }

  // Print the matrix (for debugging)
  toString(): string {
    return this.values.reduce((str, elem, i) => {
      return str + elem.toFixed(4) + ((i + 1) % 4 === 0 ? "\n" : " ");
    }, "");
  }

  valueOf(): Float32Array {
    return this.values;
  }

  // Static method to create a translation matrix
  public static translationMatrix(v: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4();
    matrix.values[12] = v.x;
    matrix.values[13] = v.y;
    matrix.values[14] = v.z;
    return matrix;
  }

  // Static method to create a scaling matrix
  public static scalingMatrix(v: Vector3): Matrix4x4 {
    const matrix = new Matrix4x4();
    matrix.values[0] = v.x;
    matrix.values[5] = v.y;
    matrix.values[10] = v.z;
    return matrix;
  }
  // Static method to create a rotation matrix around the X axis
  public static xRotationMatrix(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const radians = (angle * Math.PI) / 180; // Convert degrees to radians
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    matrix.values[5] = cos;
    matrix.values[6] = sin;
    matrix.values[9] = -sin;
    matrix.values[10] = cos;
    return matrix;
  }

  // Static method to create a rotation matrix around the Y axis
  public static yRotationMatrix(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const radians = (angle * Math.PI) / 180; // Convert degrees to radians
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    matrix.values[0] = cos;
    matrix.values[2] = -sin;
    matrix.values[8] = sin;
    matrix.values[10] = cos;
    return matrix;
  }

  // Static method to create a rotation matrix around the Z axis
  public static zRotationMatrix(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const radians = (angle * Math.PI) / 180; // Convert degrees to radians
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    matrix.values[0] = cos;
    matrix.values[1] = sin;
    matrix.values[4] = -sin;
    matrix.values[5] = cos;
    return matrix;
  }

  // Static method to multiply two 4x4 matrices
  public static multiply(b: Matrix4x4, a: Matrix4x4): Matrix4x4 {
    const result = new Matrix4x4();
    const ae = a.values; // Matrix A elements
    const be = b.values; // Matrix B elements
    const te = result.values; // Result matrix elements

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        // Initialize the result cell to 0
        let sum = 0;
        // Perform the dot product of the row from 'a' and the column from 'b'
        for (let k = 0; k < 4; k++) {
          sum += ae[row * 4 + k] * be[k * 4 + col];
        }
        // Store the computed value in the result matrix
        te[row * 4 + col] = sum;
      }
    }

    return result;
  }

  // Static method to multiply a matrix by a Vector3 (homogeneous coordinates)
  public static multiplyMat4x4Vector3(matrix: Matrix4x4, vector: Vector3): Vector3 {
    const x =
      matrix.values[0] * vector.x + matrix.values[4] * vector.y + matrix.values[8] * vector.z + matrix.values[12];
    const y =
      matrix.values[1] * vector.x + matrix.values[5] * vector.y + matrix.values[9] * vector.z + matrix.values[13];
    const z =
      matrix.values[2] * vector.x + matrix.values[6] * vector.y + matrix.values[10] * vector.z + matrix.values[14];
    return new Vector3(x, y, z);
  }

  // Static method to create a matrix from rotation (eulerAngles xyz), translation, and scaling   //  T * RZ *RY * RX  *S
  public static fromRotationTranslationScaleMatrix(rotation: Vector3, translation: Vector3, scale: Vector3): Matrix4x4 {
    const translationMatrix = Matrix4x4.translationMatrix(translation);
    const xRotationMatrix = Matrix4x4.xRotationMatrix(rotation.x);
    const yRotationMatrix = Matrix4x4.yRotationMatrix(rotation.y);
    const zRotationMatrix = Matrix4x4.zRotationMatrix(rotation.z);
    const scaleMatrix = Matrix4x4.scalingMatrix(scale);

    // Start with identity matrix
    let transformationMatrix = new Matrix4x4();

    // Apply transformations in reverse order (right to left): T * RZ * RY * RX * S * IDENTITY
    transformationMatrix = Matrix4x4.multiply(scaleMatrix, transformationMatrix); // Apply scale first
    transformationMatrix = Matrix4x4.multiply(xRotationMatrix, transformationMatrix); // Then rotate X
    transformationMatrix = Matrix4x4.multiply(yRotationMatrix, transformationMatrix); // Then rotate Y
    transformationMatrix = Matrix4x4.multiply(zRotationMatrix, transformationMatrix); // Then rotate Z
    transformationMatrix = Matrix4x4.multiply(translationMatrix, transformationMatrix); // Finally translate

    return transformationMatrix;
  }

  //aspect = h/w
  //get fov = 1/tan(theta/2)
  //normalize z values = ( zfar/ (zfar-znear) ) - (   (zfar/ zfar-znear ) * znear )
  //https://www.youtube.com/watch?v=EqNcqBdrNyI&ab_channel=pikuma
  public static perspectiveProjectionMatrix(aspectRatio: number, fov: number, zFar: number, zNear: number) {
    const fovRadians = (Math.PI / 180) * fov;
    const projectionMatrix = new Matrix4x4();

    // Aspect ratio calculation
    projectionMatrix.values[0] = (1 / Math.tan(fovRadians / 2)) * aspectRatio;
    projectionMatrix.values[5] = 1 / Math.tan(fovRadians / 2);

    // Z-coordinate handling
    projectionMatrix.values[10] = -(zFar + zNear) / (zFar - zNear);
    projectionMatrix.values[11] = -1;

    // Perspective divide
    projectionMatrix.values[14] = -(2 * zFar * zNear) / (zFar - zNear);
    projectionMatrix.values[15] = 0;

    return projectionMatrix;
  }

  public static cameraMatrix(
    rotation: Vector3,
    translation: Vector3,
    aspectRatio: number,
    fov: number,
    zFar: number,
    zNear: number
  ) {
    let cameraViewMatrix = new Matrix4x4();

    const translationMatrix = Matrix4x4.fromRotationTranslationScaleMatrix(rotation, translation, new Vector3(1, 1, 1));
    const projectionMatrix = Matrix4x4.perspectiveProjectionMatrix(aspectRatio, fov, zFar, zNear);

    //   P * T * IDENTY
    cameraViewMatrix = Matrix4x4.multiply(translationMatrix, cameraViewMatrix);
    cameraViewMatrix = Matrix4x4.multiply(projectionMatrix, cameraViewMatrix);

    return cameraViewMatrix;
  }
  public static lookAt(eye: Vector3, target: Vector3, up: Vector3 = new Vector3(0, 1, 0)): Matrix4x4 {
    // Calculate the camera's forward direction (z-axis)
    const zAxis = Vector3.normalize(Vector3.subtract(eye, target));

    // Calculate the camera's right direction (x-axis)
    const xAxis = Vector3.normalize(Vector3.cross(up, zAxis));

    // Calculate the camera's up direction (y-axis)
    const yAxis = Vector3.cross(zAxis, xAxis);

    // Create the rotation/translation matrix
    const viewMatrix = new Matrix4x4();

    // Set rotation part
    viewMatrix.values[0] = xAxis.x;
    viewMatrix.values[1] = yAxis.x;
    viewMatrix.values[2] = zAxis.x;
    viewMatrix.values[3] = 0;

    viewMatrix.values[4] = xAxis.y;
    viewMatrix.values[5] = yAxis.y;
    viewMatrix.values[6] = zAxis.y;
    viewMatrix.values[7] = 0;

    viewMatrix.values[8] = xAxis.z;
    viewMatrix.values[9] = yAxis.z;
    viewMatrix.values[10] = zAxis.z;
    viewMatrix.values[11] = 0;

    // Set translation part
    viewMatrix.values[12] = -Vector3.dot(xAxis, eye);
    viewMatrix.values[13] = -Vector3.dot(yAxis, eye);
    viewMatrix.values[14] = -Vector3.dot(zAxis, eye);
    viewMatrix.values[15] = 1;

    return viewMatrix;
  }
}
