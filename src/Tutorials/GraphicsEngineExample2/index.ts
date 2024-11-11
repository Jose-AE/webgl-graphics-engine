import vertexCode from "./VertexShader.vert?raw";
import fragmentCode from "./FragmentShader.frag?raw";
import { GraphicsEngine } from "../../classes/GraphicsEngine";
import { Mesh } from "../../classes/Mesh";
import { Vector3 } from "../../classes/Vector3";
import { Matrix4x4 } from "../../classes/Matrix4x4";
import { createSliders } from "../../utils/createSliders";

export function GraphicsEngineExample2() {
  let rotationSpeed = 0;
  let cubeRotation = 0;
  let planeSize = 0;

  createSliders([
    {
      label: "Rotation Speed",
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.1,
      onChange: (v) => {
        rotationSpeed = v;
      },
    },
    {
      label: "Cube rot",
      min: 0,
      max: 360,
      step: 1,
      value: 0,
      onChange: (v) => {
        cubeRotation = v;
      },
    },
    {
      label: "Plane size",
      min: 0.1,
      max: 10,
      step: 0.1,
      value: 1,
      onChange: (v) => {
        planeSize = v;
      },
    },
  ]);

  const engine = new GraphicsEngine("glCanvas", vertexCode, fragmentCode);

  const meshes = engine.loadMeshes([
    Mesh.CreatePlanePrimitive(10, new Vector3(0, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 1, 1)),
    Mesh.CreateCubePrimitive(1, new Vector3(0, 0.5, 0), new Vector3(0, 45, 0), new Vector3(1, 1, 1)),
    Mesh.CreateCubePrimitive(1, new Vector3(0, 0.5, 2), new Vector3(0, 30, 0), new Vector3(0.5, 0.5, 0.5)),
  ]);

  const matProj = Matrix4x4.perspectiveProjectionMatrix(engine.getCanvasAspectRatio(), 90, 100, 0.1);

  //render
  let cameraAngle = 0;
  function updateFrame() {
    meshes[1].mesh.rotation = new Vector3(0, cubeRotation, 0);
    meshes[0].mesh.scale = new Vector3(planeSize, 0, planeSize);

    const dt = engine.getDeltaTime();

    cameraAngle += dt * (Math.PI / 180) * 200 * rotationSpeed;

    let cameraX = 6 * Math.sin(cameraAngle);
    let cameraZ = 6 * Math.cos(cameraAngle);

    const matView = Matrix4x4.lookAt(new Vector3(cameraX, 3, cameraZ), new Vector3());
    const matViewProj = Matrix4x4.multiply(matProj, matView);

    engine.setUniform("uProjectionMatrix", "mat4", matViewProj.values);

    engine.clearViewport(128, 128, 128, 1);
    meshes.forEach((m) => engine.drawMesh(m));

    requestAnimationFrame(updateFrame);
  }
  requestAnimationFrame(updateFrame);
}
