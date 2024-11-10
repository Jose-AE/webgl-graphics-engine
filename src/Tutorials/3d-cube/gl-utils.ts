export function createStaticVertexBuffer(
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

export function createStaticIndexBuffer(
  gl: WebGL2RenderingContext,
  data: ArrayBuffer
) {
  const buffer = gl.createBuffer(); // Allocate memory on the GPU by creating a new buffer object.
  if (!buffer) {
    console.error("Failed to allocate buffer");
    return null;
  }

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  return buffer;
}

export async function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderPath: string,
  fragmentShaderPath: string
): Promise<WebGLProgram> {
  //Extract source code from shader file
  const [vertexShaderSourceCode, fragmentShaderSourceCode] = await Promise.all([
    fetch(vertexShaderPath).then((r) => r.text()),
    fetch(fragmentShaderPath).then((r) => r.text()),
  ]);

  //create shaders and program
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();

  if (!vertexShader || !fragmentShader || !program) {
    throw new Error(
      `Failed to allocate GL objects (` +
        `vs=${!!vertexShader}, ` +
        `fs=${!!fragmentShader}, ` +
        `program=${!!program})`
    );
  }

  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(vertexShader);
    throw new Error(`Failed to compile vertex shader: ${errorMessage}`);
  }

  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const errorMessage = gl.getShaderInfoLog(fragmentShader);
    throw new Error(`Failed to compile fragment shader: ${errorMessage}`);
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const errorMessage = gl.getProgramInfoLog(program);
    throw new Error(`Failed to link GPU program: ${errorMessage}`);
  }

  return program;
}

export function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext("webgl2");

  if (!gl) throw new Error("WebGL2 not supported");

  return gl;
}

export function getAttributeLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  attributes: string[]
): GLint[] {
  const res: GLint[] = [];

  for (let attr of attributes) {
    const attrLoc = gl.getAttribLocation(program, attr);
    if (attrLoc < 0) throw new Error(`Failed to get attribute: ${attr}`);
    res.push(attrLoc);
  }

  return res;
}

export function getUniformLocations(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  uniforms: string[]
) {
  const res: WebGLUniformLocation[] = [];

  for (let uniform of uniforms) {
    const uniformLoc = gl.getUniformLocation(program, uniform);
    if (!uniformLoc) throw new Error(`Failed to get uniform: ${uniform}`);
    res.push(uniformLoc);
  }

  return res;
}

export function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
