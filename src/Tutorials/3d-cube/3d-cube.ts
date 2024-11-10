import { glMatrix, mat4, quat, vec3 } from "gl-matrix";
import {
  create3dPosColorInterleavedVao,
  CUBE_TRIANGLES,
  CUBE_VERTICES,
  TABLE_TRIANGLES,
  TABLE_VERTICES,
} from "./cube.geo";
import {
  createProgram,
  createStaticIndexBuffer,
  createStaticVertexBuffer,
  getAttributeLocations,
  getContext,
  getUniformLocations,
} from "./gl-utils";

class Shape {
  private matWorld = mat4.create();
  private scaleVec = vec3.create();
  private rotation = quat.create();

  constructor(
    private pos: vec3,
    private scale: number,
    private rotationAxis: vec3,
    private rotationAngle: number,
    public readonly vao: WebGLVertexArrayObject,
    public readonly numIndices: number
  ) {}

  draw(gl: WebGL2RenderingContext, matWorldUniform: WebGLUniformLocation) {
    quat.setAxisAngle(this.rotation, this.rotationAxis, this.rotationAngle);
    vec3.set(this.scaleVec, this.scale, this.scale, this.scale);

    mat4.fromRotationTranslationScale(
      this.matWorld,
      /* rotation= */ this.rotation,
      /* position= */ this.pos,
      /* scale= */ this.scaleVec
    );

    gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld);
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

export async function cube3d() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
  const gl = getContext(canvas);

  const cubeVertices = createStaticVertexBuffer(gl, CUBE_VERTICES);
  const cubeIndices = createStaticIndexBuffer(gl, CUBE_TRIANGLES);
  const tableVertices = createStaticVertexBuffer(gl, TABLE_VERTICES);
  const tableIndices = createStaticIndexBuffer(gl, TABLE_TRIANGLES);

  if (!cubeVertices || !cubeIndices || !tableVertices || !tableIndices) {
    console.error(
      `Failed to create geo: cube: (v=${!!cubeVertices} i=${cubeIndices}), table=(v=${!!tableVertices} i=${!!tableIndices})`
    );
    return;
  }

  const cubeProgram = await createProgram(
    gl,
    "./Tutorials/3d-cube/VertexShader.vert",
    "./Tutorials/3d-cube/FragmentShader.frag"
  );

  const [posAttrib, colorAttrib] = getAttributeLocations(gl, cubeProgram, ["vertexPosition", "vertexColor"]);

  const [matWorldUniform, matViewProjUniform] = getUniformLocations(gl, cubeProgram, ["matWorld", "matViewProj"]);

  const cubeVAO = create3dPosColorInterleavedVao(gl, cubeVertices, cubeIndices, posAttrib, colorAttrib);

  const tableVAO = create3dPosColorInterleavedVao(gl, tableVertices, tableIndices, posAttrib, colorAttrib);

  const UP_VEC = vec3.fromValues(0, 1, 0);

  const shapes = [
    new Shape(vec3.fromValues(0, 0, 0), 1, UP_VEC, 0, tableVAO, TABLE_TRIANGLES.length), // Ground
    new Shape(vec3.fromValues(0, 0.4, 0), 0.4, UP_VEC, 0, cubeVAO, CUBE_TRIANGLES.length), // Center
    new Shape(vec3.fromValues(1, 0.05, 1), 0.05, UP_VEC, glMatrix.toRadian(20), cubeVAO, CUBE_TRIANGLES.length),
    new Shape(vec3.fromValues(1, 0.1, -1), 0.1, UP_VEC, glMatrix.toRadian(40), cubeVAO, CUBE_TRIANGLES.length),
    new Shape(vec3.fromValues(-1, 0.15, 1), 0.15, UP_VEC, glMatrix.toRadian(60), cubeVAO, CUBE_TRIANGLES.length),
    new Shape(vec3.fromValues(-1, 0.2, -1), 0.2, UP_VEC, glMatrix.toRadian(80), cubeVAO, CUBE_TRIANGLES.length),
  ];

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  const matView = mat4.create();
  const matProj = mat4.create();
  const matViewProj = mat4.create();
  let cameraAngle = 0;

  //render
  let lastFrameTime = performance.now();
  function updateFrame() {
    const thisFrameTime = performance.now();
    const dt = (thisFrameTime - lastFrameTime) / 1000;
    lastFrameTime = thisFrameTime;

    //
    // Update
    cameraAngle += dt * glMatrix.toRadian(10);

    const cameraX = 3 * Math.sin(cameraAngle);
    const cameraZ = 3 * Math.cos(cameraAngle);

    mat4.lookAt(
      matView,
      /* pos= */ vec3.fromValues(cameraX, 1, cameraZ),
      /* lookAt= */ vec3.fromValues(0, 0, 0),
      /* up= */ vec3.fromValues(0, 1, 0)
    );
    mat4.perspective(
      matProj,
      /* fovy= */ glMatrix.toRadian(80),
      /* aspectRatio= */ canvas.width / canvas.height,
      /* near, far= */ 0.1,
      100.0
    );

    // in GLM:    matViewProj = matProj * matView
    mat4.multiply(matViewProj, matProj, matView);

    //
    // Render
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    gl.clearColor(0.02, 0.02, 0.02, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.useProgram(cubeProgram);
    gl.uniformMatrix4fv(matViewProjUniform, false, matViewProj);

    shapes.forEach((shape) => shape.draw(gl, matWorldUniform));
    requestAnimationFrame(updateFrame);
  }
  requestAnimationFrame(updateFrame);
}
