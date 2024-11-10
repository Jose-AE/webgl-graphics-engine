import { loadFile } from "../loadFile";

export async function helloTriangle() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (!gl) {
    throw new Error("WebGL2 not supported");
  }

  //#region BUFFER_CREATION

  const triangleVertices = [
    // Top middle
    0.0, 0.5,
    // Bottom left
    -0.5, -0.5,
    // Bottom right
    0.5, -0.5,
  ];

  const triangleVerticesCpuBuffer = new Float32Array(triangleVertices); //convert a js array of verts to a float32 array so the gpu can procces it

  const trangleVertBuffer = gl.createBuffer(); //create a buffer on the gpu
  gl.bindBuffer(gl.ARRAY_BUFFER, trangleVertBuffer); //bind the buffer we created to the array buffer (used for vertex data)
  gl.bufferData(gl.ARRAY_BUFFER, triangleVerticesCpuBuffer, gl.STATIC_DRAW); // This function copies the vertex data (triangleVerticesCpuBuffer) from the CPU (JavaScript) to the buffer on the GPU (ARRAY_BUFFER) and then trangleVertBuffer will have a reference to those verts.

  //#endregion

  //#region VERTEX_SHADER
  const vertexShaderCode = await loadFile("./Tutorials/hello-triangle/hello-triangle.vert");

  const vertexShader = gl.createShader(gl.VERTEX_SHADER); //create a vertex shader
  if (!vertexShader) throw new Error("Erorr creating vertex shader");
  gl.shaderSource(vertexShader, vertexShaderCode); //link the source code to the created shader
  gl.compileShader(vertexShader); //compile shader

  //check for compilation errors
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    console.error(compileError);
  }

  //#endregion

  //#region FRAGMENT_SHADER
  const fragmentShaderCode = await loadFile("./Tutorials/hello-triangle/hello-triangle.frag");

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //create a vertex shader
  if (!fragmentShader) throw new Error("Erorr creating fragment shader");
  gl.shaderSource(fragmentShader, fragmentShaderCode); //link the source code to the created shader
  gl.compileShader(fragmentShader); //compile shader

  //check for compilation errors
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    console.error(compileError);
  }

  //#endregion

  //#region CREATE_PROGRAM

  //fragment shader and vertex shader ar always used togetherand combined using a "webgl program"
  const triangleShaderProgram = gl.createProgram();
  gl.attachShader(triangleShaderProgram!, vertexShader);
  gl.attachShader(triangleShaderProgram!, fragmentShader);
  gl.linkProgram(triangleShaderProgram!); //link the 2 shaders together and make sure they are compatible

  if (!gl.getProgramParameter(triangleShaderProgram!, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(triangleShaderProgram!);
    console.error(linkError);
    return;
  }

  //get the index of the atribute "vertexPos" we defined on the vertex shader, if we had muitple atributes the first one would start on 0 then 1 etc
  const vertexPositionAttributeIndex = gl.getAttribLocation(triangleShaderProgram!, "vertexPos");

  //if negative means it did not found it
  if (vertexPositionAttributeIndex < 0) {
    console.error("Filed to get atribute index for vertexPos ");
  }

  //#endregion

  //#region RENDERING_PIPELINE

  //! Output merger - how to merge the shaded pixel fragment with the existing output image

  canvas.width = canvas.clientWidth; // Set the canvas internal rendering width (in pixels) to match its CSS width
  canvas.height = canvas.clientHeight; // Set the canvas internal rendering height (in pixels) to match its CSS height

  //clear color and depth buffer
  gl.clearColor(0, 0, 0, 1); //this line sets what color to use when clearing the color buffer
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //! Rasterizer - which pixels are part of a triangle
  gl.viewport(0, 0, canvas.width, canvas.height); //what part of the screen is going to render the pipeline

  //! Set GPU program (vertex + fragment shader pair)
  gl.useProgram(triangleShaderProgram); //set the program
  gl.enableVertexAttribArray(vertexPositionAttributeIndex); //enable the atributes we are going to use

  //! Input assembler - how to read vertices from our GPU triangle buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, trangleVertBuffer); //bind the buffer we created to the array buffer (used for vertex data)
  gl.vertexAttribPointer(
    /* index: which attribute to use */
    vertexPositionAttributeIndex,
    /* size: how many components in that attribute */
    2,
    /* type: what is the data type stored in the GPU buffer for this attribute? */
    gl.FLOAT,
    /* normalized: determines how to convert ints to floats, if that's what you're doing */
    false,
    /* stride: how many bytes to move forward in the buffer to find the same attribute for the next vertex */
    2 * Float32Array.BYTES_PER_ELEMENT,
    /* offset: how many bytes should the input assembler skip into the buffer when reading attributes */
    0
  );

  //! Draw call (also configures primitive assembly)
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  //#endregion
}
