export class GraphicsEngine {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;

  constructor(canvasId: string, vertexShaderSourceCode?: string, fragmentShaderSourceCode?: string) {
    //Get canvas
    const canvasElement = document.querySelector(`#${canvasId}`) as HTMLCanvasElement;
    if (!canvasElement) throw new Error(`Canvas with id "${canvasId}" not found`);
    this.canvas = canvasElement;
    this.canvas.width = this.canvas.clientWidth * devicePixelRatio; // Set the canvas internal rendering width (in pixels) to match its CSS width
    this.canvas.height = this.canvas.clientHeight * devicePixelRatio; // Set the canvas internal rendering height (in pixels) to match its CSS height

    //Create context
    const glContext = this.canvas.getContext("webgl2");
    if (!glContext) throw new Error("WebGL2 not supported");
    this.gl = glContext;
    this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing to handle the visibility of objects based on their distance from the camera
    this.gl.enable(this.gl.CULL_FACE); // Enable face culling to optimize rendering by discarding back-facing polygons
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Create program using helper function
    if (vertexShaderSourceCode && fragmentShaderSourceCode)
      this.program = this.createProgram(vertexShaderSourceCode, fragmentShaderSourceCode);
  }

  // Helper function to create a WebGL program from shader source code
  public createProgram(vertexShaderSourceCode: string, fragmentShaderSourceCode: string): WebGLProgram {
    const vertexShader = this.compileShader(vertexShaderSourceCode, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(fragmentShaderSourceCode, this.gl.FRAGMENT_SHADER);
    const program = this.gl.createProgram();

    if (!program) {
      throw new Error("Failed to create WebGL program");
    }

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      const errorMessage = this.gl.getProgramInfoLog(program);
      throw new Error(`Failed to link GPU program: ${errorMessage}`);
    }

    return program;
  }

  // Helper function to compile a shader
  private compileShader(sourceCode: string, type: number): WebGLShader {
    const shader = this.gl.createShader(type);

    if (!shader) {
      throw new Error(`Failed to create shader of type ${type}`);
    }

    this.gl.shaderSource(shader, sourceCode);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const errorMessage = this.gl.getShaderInfoLog(shader);
      throw new Error(`Failed to compile shader: ${errorMessage}`);
    }

    return shader;
  }

  public clearViewport(r: number = 255, g: number = 255, b: number = 255, a: number = 1) {
    this.gl.clearColor(r / 255, g / 255, b / 255, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  //#region BUFFER_STUFF

  public createStaticVertexBuffer(data: number[]) {
    const convertedData = new Float32Array(data);

    const buffer = this.gl.createBuffer(); // Allocate memory on the GPU by creating a new buffer object.
    if (!buffer) {
      throw new Error("Failed to allocate StaticVertexBuffer");
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer); // Bind the created buffer to the ARRAY_BUFFER target, making it the current buffer for vertex data.
    this.gl.bufferData(this.gl.ARRAY_BUFFER, convertedData, this.gl.STATIC_DRAW); // Upload the vertex data to the buffer and specify it's for static (non-changing) use.
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); // Unbind the buffer to avoid accidental modification.

    return buffer;
  }

  public createStaticIndexBuffer(data: number[]) {
    const convertedData = new Uint32Array(data);

    const buffer = this.gl.createBuffer(); // Allocate memory on the GPU by creating a new buffer object.
    if (!buffer) {
      console.error("Failed to allocate buffer");
      return null;
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, convertedData, this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    return buffer;
  }

  //#endregion

  public draw() {}
}
