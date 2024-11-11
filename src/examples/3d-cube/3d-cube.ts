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
import { Matrix4x4 } from "../../classes/Matrix4x4";
import { Vector3 } from "../../classes/Vector3";

class Shape {
  private matWorld = new Matrix4x4();
  private scaleVec = new Vector3();

  constructor(
    private pos: Vector3,
    private scale: number,
    private rotation: Vector3,
    public readonly vao: WebGLVertexArrayObject,
    public readonly numIndices: number
  ) {}

  draw(gl: WebGL2RenderingContext, matWorldUniform: WebGLUniformLocation) {
    this.scaleVec = new Vector3(this.scale, this.scale, this.scale);

    this.matWorld = Matrix4x4.fromRotationTranslationScaleMatrix(
      /* rotation= */ this.rotation,
      /* position= */ this.pos,
      /* scale= */ this.scaleVec
    );

    gl.uniformMatrix4fv(matWorldUniform, false, this.matWorld.values);
    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.numIndices, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }
}

export async function cube3d() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
  const gl = getContext(canvas);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.viewport(0, 0, canvas.width, canvas.height);

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

  const shapes = [
    new Shape(new Vector3(0, 0, 0), 1, new Vector3(0, 0, 0), tableVAO, TABLE_TRIANGLES.length), // Ground
    //new Shape(new Vector3(0, 0, 0), 0.4, new Vector3(0, 45, 0), cubeVAO, CUBE_TRIANGLES.length), // Center

    new Shape(new Vector3(0, 0.5, 0), 0.4, new Vector3(0, 0, 0), cubeVAO, CUBE_TRIANGLES.length), // Center
    new Shape(new Vector3(1, 0.05, 1), 0.05, new Vector3(0, 40, 0), cubeVAO, CUBE_TRIANGLES.length), // Center
    new Shape(new Vector3(1, 0.1, -1), 0.1, new Vector3(0, 60, 0), cubeVAO, CUBE_TRIANGLES.length), // Center
    new Shape(new Vector3(-1, 0.15, 1), 0.15, new Vector3(0, 60, 0), cubeVAO, CUBE_TRIANGLES.length), // Center
    new Shape(new Vector3(-1, 0.2, -1), 0.2, new Vector3(0, 80, 0), cubeVAO, CUBE_TRIANGLES.length), // Center
  ];

  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;

  let matView = new Matrix4x4();
  let matProj = new Matrix4x4();
  let matViewProj = new Matrix4x4();
  let cameraAngle = 0;

  //render
  let lastFrameTime = performance.now();
  function updateFrame() {
    const thisFrameTime = performance.now();
    const dt = (thisFrameTime - lastFrameTime) / 1000;
    lastFrameTime = thisFrameTime;

    //
    // Update
    cameraAngle += dt * (Math.PI / 180) * 10;

    let cameraX = 3 * Math.sin(cameraAngle);
    let cameraZ = 3 * Math.cos(cameraAngle);

    if (false) {
      cameraX = 3;
      cameraZ = 3;
    }

    matView = Matrix4x4.lookAt(new Vector3(cameraX, 3, cameraZ), new Vector3());
    matProj = Matrix4x4.perspectiveProjectionMatrix(canvas.height / canvas.width, 80, 100, 0.1);

    // in GLM:    matViewProj = matProj * matView
    // const temp = mat4.create();
    // mat4.multiply(temp, matProj.values, matView.values);

    matViewProj = Matrix4x4.multiply(matProj, matView);

    //

    // Render

    gl.clearColor(0.02, 0.02, 0.02, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(cubeProgram);
    gl.uniformMatrix4fv(matViewProjUniform, false, matViewProj.values);

    shapes.forEach((shape) => shape.draw(gl, matWorldUniform));
    requestAnimationFrame(updateFrame);
  }
  requestAnimationFrame(updateFrame);
}
