import { mat4 } from "gl-matrix";
import { cube3d } from "./Tutorials/3d-cube/3d-cube";
import { helloTriangle } from "./Tutorials/hello-triangle/hello-triangle";
import { movementAndColor } from "./Tutorials/movement-and-colors/movement-and-colors";
import { GraphicsEngine } from "./classes/GraphicsEngine";
import { Matrix4x4 } from "./classes/Matrix4x4";

import fileContent from "./shaders/test.vert?raw";

//import fileContent from "./shaders/test.vert";

//console.log(fileContent);
cube3d();

//helloTriangle();

// const engine = new GraphicsEngine("glCanvas");

// const rawmata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
// const rawmatb = [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32];

// const matA = new Matrix4x4(rawmata);
// const matB = new Matrix4x4(rawmatb);

// const res1 = Matrix4x4.multiply(matB, matA);

// console.log(res1);

// const Ma = mat4.create();

// mat4.multiply(Ma, matA.values, matB.values);

// console.log(Ma);
