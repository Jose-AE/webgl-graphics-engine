import { loadFile } from "../../utils/loadFile";

function createStaticVertexBuffer(
  gl: WebGL2RenderingContext,
  data: ArrayBuffer
) {
  const buffer = gl.createBuffer(); // Allocate memory on the GPU by creating a new buffer object.
  if (!buffer) {
    console.error("Failed to allocate buffer");
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // Bind the created buffer to the ARRAY_BUFFER target, making it the current buffer for vertex data.
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); // Upload the vertex data to the buffer and specify it's for static (non-changing) use.
  gl.bindBuffer(gl.ARRAY_BUFFER, null); // Unbind the buffer to avoid accidental modification.

  return buffer;
}

function createTwoBufferVao(
  gl: WebGL2RenderingContext,
  positionBuffer: WebGLBuffer,
  colorBuffer: WebGLBuffer,
  positionAttribLocation: number,
  colorAttribLocation: number
) {
  // Step 1: Create a new VAO (Vertex Array Object)
  const vao = gl.createVertexArray();
  if (!vao) {
    // If VAO creation failed, log an error and return null
    console.error("Failed to allocate VAO for two buffers");
    return null;
  }

  // Step 2: Bind the VAO so we can configure it
  // All subsequent configurations related to vertex attributes and buffer bindings
  // will be saved in this VAO
  gl.bindVertexArray(vao);

  // Step 3: Enable the position attribute array
  // This tells WebGL that we will use the vertex attribute at `positionAttribLocation` for the position data
  gl.enableVertexAttribArray(positionAttribLocation);

  // Step 4: Enable the color attribute array
  // This tells WebGL that we will use the vertex attribute at `colorAttribLocation` for the color data
  gl.enableVertexAttribArray(colorAttribLocation);

  // Step 5: Bind the position buffer to the ARRAY_BUFFER target
  // This tells WebGL that we are going to work with the position buffer now
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Step 6: Define the format for the position attribute data
  // `vertexAttribPointer` tells WebGL how to interpret the data in the position buffer
  // - `positionAttribLocation`: The index of the attribute in the shader
  // - `2`: The number of components per vertex (x, y in this case)
  // - `gl.FLOAT`: The data type for each component (float)
  // - `false`: Don't normalize the values (the values are not expected to be in the range [0, 1])
  // - `0`: Stride (0 means the data is tightly packed)
  // - `0`: Offset from the beginning of the buffer (the start of the buffer)
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);

  // Step 7: Bind the color buffer to the ARRAY_BUFFER target
  // This tells WebGL that we are going to work with the color buffer now
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  // Step 8: Define the format for the color attribute data
  // `vertexAttribPointer` tells WebGL how to interpret the data in the color buffer
  // - `colorAttribLocation`: The index of the attribute in the shader
  // - `3`: The number of components per vertex (r, g, b for the color)
  // - `gl.UNSIGNED_BYTE`: The data type for each component (unsigned byte, 0-255 for color channels)
  // - `true`: Normalize the values (convert the range [0, 255] to [0, 1] in the shader)
  // - `0`: Stride (0 means the data is tightly packed)
  // - `0`: Offset from the beginning of the buffer (the start of the buffer)
  gl.vertexAttribPointer(colorAttribLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

  // Step 9: Unbind the currently bound buffer (to prevent accidental modification later)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Step 10: Unbind the VAO (optional, but good practice)
  // After we finish configuring the VAO, we unbind it to avoid modifying it unintentionally
  gl.bindVertexArray(null);

  // Step 11: Return the VAO
  // The VAO is now configured and ready to be used in rendering
  return vao;
}

const triangleVertices = new Float32Array([
  // Top middle
  0, 1,
  // Bottom left
  -1, -1,
  // Bottom right
  1, -1,
]);

const rgbTriangleColors = new Uint8Array([255, 0, 0, 0, 255, 0, 0, 0, 255]);
const fireyTriangleColors = new Uint8Array([
  // Chili red - E52F0F
  229, 47, 15,
  // Jonquil - F6CE1D
  246, 206, 29,
  // Gamboge - E99A1A
  233, 154, 26,
]);

export async function movementAndColor() {
  const canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (!gl) {
    throw new Error("WebGL2 not supported");
  }

  //#region BUFFER_CREATION

  const triangleVertBuffer = createStaticVertexBuffer(gl, triangleVertices);
  const rgbTriangleColorBuffer = createStaticVertexBuffer(
    gl,
    rgbTriangleColors
  );
  const fireyTriangleColorBuffer = createStaticVertexBuffer(
    gl,
    fireyTriangleColors
  );

  //#endregion

  //#region VERTEX_SHADER
  const vertexShaderCode = await loadFile(
    "./Tutorials/movement-and-colors/VertexShader.vert"
  );

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
  const fragmentShaderCode = await loadFile(
    "./Tutorials/movement-and-colors/FragmentShader.frag"
  );

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
  const vertexPositionAttributeIndex = gl.getAttribLocation(
    triangleShaderProgram!,
    "vertexPos"
  );

  const vertexColorAttributeIndex = gl.getAttribLocation(
    triangleShaderProgram!,
    "vertexColor"
  );

  //if negative means it did not found it
  if (vertexPositionAttributeIndex < 0 || vertexColorAttributeIndex < 0) {
    console.error("Filed to get atribute indexes ");
  }

  const shapeLocationUniform = gl.getUniformLocation(
    triangleShaderProgram!,
    "shapeLocation"
  );
  const shapeSizeUniform = gl.getUniformLocation(
    triangleShaderProgram!,
    "shapeSize"
  );
  const canvasSizeUniform = gl.getUniformLocation(
    triangleShaderProgram!,
    "canvasSize"
  );
  if (
    shapeLocationUniform === null ||
    shapeSizeUniform === null ||
    canvasSizeUniform === null
  ) {
    console.error("Failed to get unfiorm locations");
    console.log(shapeLocationUniform);
    console.log(shapeSizeUniform);
    console.log(canvasSizeUniform);

    return;
  }

  //#endregion

  //#region RENDERING_PIPELINE

  //! Output merger - how to merge the shaded pixel fragment with the existing output image

  canvas.width = canvas.clientWidth; // Set the canvas internal rendering width (in pixels) to match its CSS width
  canvas.height = canvas.clientHeight; // Set the canvas internal rendering height (in pixels) to match its CSS height

  //clear color and depth buffer
  gl.clearColor(0.1, 0.1, 0.1, 1); //this line sets what color to use when clearing the color buffer
  gl.clear(gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //! Rasterizer - which pixels are part of a triangle
  gl.viewport(0, 0, canvas.width, canvas.height); //what part of the screen is going to render the pipeline

  //! Set GPU program (vertex + fragment shader pair)
  gl.useProgram(triangleShaderProgram); //set the program
  gl.enableVertexAttribArray(vertexPositionAttributeIndex); //enable the atributes we are going to use
  gl.enableVertexAttribArray(vertexColorAttributeIndex); //enable the atributes we are going to use

  //! Input assembler - how to read vertices from our GPU triangle buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertBuffer); //bind the buffer we created to the array buffer (used for vertex data)
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

  gl.uniform2f(canvasSizeUniform, canvas.width, canvas.height);

  gl.bindBuffer(gl.ARRAY_BUFFER, rgbTriangleColorBuffer); //select a buffer
  gl.vertexAttribPointer(
    //tell it how to read the selected buffer
    vertexColorAttributeIndex,
    3,
    gl.UNSIGNED_BYTE,
    true,
    0,
    0
  );

  gl.uniform1f(shapeSizeUniform, 200);
  gl.uniform2f(shapeLocationUniform, 300, 600);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  gl.uniform1f(shapeSizeUniform, 100);
  gl.uniform2f(shapeLocationUniform, 650, 300);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  //#endregion
}
