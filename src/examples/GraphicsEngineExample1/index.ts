import vertexCode from "./VertexShader.vert?raw";
import fragmentCode from "./FragmentShader.frag?raw";
import { GraphicsEngine } from "../../classes/GraphicsEngine";
import { Mesh } from "../../classes/Mesh";
import { Vector3 } from "../../classes/Vector3";
import { Matrix4x4 } from "../../classes/Matrix4x4";

export function GraphicsEngineExample1() {
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
    const dt = engine.getDeltaTime();

    cameraAngle += dt * (Math.PI / 180) * 100;

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
