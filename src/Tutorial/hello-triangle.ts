export function helloTriangle() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (!gl) {
    throw new Error("WebGL2 not supported");
  }

  //clear color and depth buffer
  gl.clearColor(1, 1, 1, 1.0); //this line sets what color to use when clearing the color buffer?
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const triangleVertices = [
    // Top middle
    0.0, 0.5,
    // Bottom left
    -0.5, -0.5,
    // Bottom right
    0.5, -0.5,
  ];
}
