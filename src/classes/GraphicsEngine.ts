import { Matrix4x4 } from "./Matrix4x4";
import { Mesh } from "./Mesh";

export class GraphicsEngine {
  private gl: WebGL2RenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private lastFrameTime: number = performance.now();

  //#region CONSTRUCTOR
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
      this.setProgram(this.createProgram(vertexShaderSourceCode, fragmentShaderSourceCode));
  }

  //#endregion

  //#region PROGRAM_METHODS

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

  public setProgram(program: WebGLProgram) {
    this.program = program;
    this.gl.useProgram(program);
  }
  //#endregion

  //#region BUFFER_METHODS

  public createBuffer(type: "index" | "array", usage: "static" | "dynamic" | "stream", data: number[]) {
    if (!data || data.length === 0) {
      throw new Error("Data array cannot be empty.");
    }

    const convertedData = type === "array" ? new Float32Array(data) : new Uint32Array(data);
    const typeId = type === "array" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    const usageId =
      usage === "dynamic" ? this.gl.DYNAMIC_DRAW : usage === "static" ? this.gl.STATIC_DRAW : this.gl.STREAM_DRAW;

    const buffer = this.gl.createBuffer(); // Allocate memory on the GPU by creating a new buffer object.
    if (!buffer) {
      throw new Error("Failed to allocate StaticVertexBuffer");
    }

    this.gl.bindBuffer(typeId, buffer); // Bind the created buffer to the ARRAY_BUFFER target, making it the current buffer for vertex data.
    this.gl.bufferData(typeId, convertedData, usageId); // Upload the vertex data to the buffer and specify it's for static (non-changing) use.
    this.gl.bindBuffer(typeId, null); // Unbind the buffer to avoid accidental modification.

    return buffer;
  }

  //#endregion

  //#region  RENDER_METHODS
  public clearViewport(r: number = 255, g: number = 255, b: number = 255, a: number = 1) {
    this.gl.clearColor(r / 255, g / 255, b / 255, a);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public draw(config: DrawConfig): void {
    if (config.count <= 0) {
      throw new Error("Draw count must be greater than 0");
    }

    try {
      // Bind the VAO
      this.gl.bindVertexArray(config.vao);

      // Set default values
      const drawMode = config.drawMode ?? this.gl.TRIANGLES;

      // Choose appropriate draw call based on configuration

      if (config.indexed) {
        this.gl.drawElements(
          drawMode,
          config.count,
          this.gl.UNSIGNED_INT, // Assuming 32-bit indices
          0
        );
      } else {
        this.gl.drawArrays(drawMode, 0, config.count);
      }
    } catch (error) {
      console.error("Draw error:", error);
      throw error;
    } finally {
      // Reset state
      this.gl.bindVertexArray(null);
    }
  }

  public drawMesh({ mesh, indexBuffer, vertexbuffer }: LoadedMeshData) {
    const vao = this.createVAO({
      indexBuffer: indexBuffer,
      attributes: [
        {
          buffer: vertexbuffer,
          name: "vertexPosition",
          type: this.gl.FLOAT,
          size: 3,
          offset: 0,
          stride: 0,
        },
      ],
    });

    const matWorld = Matrix4x4.fromRotationTranslationScaleMatrix(
      /* rotation= */ mesh.rotation,
      /* position= */ mesh.position,
      /* scale= */ mesh.scale
    );
    this.setUniform("uModelViewMatrix", "mat4", matWorld.values);

    this.draw({ indexed: true, vao: vao, count: mesh.triangles.length });
  }

  //#endregion

  //#region UTIL_METHODS

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

  public createVAO(config: VAOConfig): WebGLVertexArrayObject {
    if (!this.program) {
      throw new Error("A program is requiered to create a vao");
    }

    const vao = this.gl.createVertexArray();
    if (!vao) {
      throw new Error("Failed to create VAO");
    }

    try {
      this.gl.bindVertexArray(vao);

      // Configure all attributes
      for (const attr of config.attributes) {
        const atrrLocation = this.gl.getAttribLocation(this.program, attr.name);
        this.gl.enableVertexAttribArray(atrrLocation); //enable atribute atribute
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attr.buffer); // bind buffer
        this.gl.vertexAttribPointer(
          //setup vertex attr pointer
          atrrLocation,
          attr.size,
          attr.type,
          attr.normalized || false,
          attr.stride,
          attr.offset
        );
      }

      // Bind index buffer if provided
      if (config.indexBuffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, config.indexBuffer);
      }
    } catch (error) {
      // Clean up on error
      this.gl.deleteVertexArray(vao);
      throw error;
    } finally {
      // Reset state
      this.gl.bindVertexArray(null);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      if (config.indexBuffer) {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
      }
    }

    return vao;
  }

  public setUniform(
    name: string,
    type: "mat4" | "mat3" | "vec4" | "vec3" | "vec2" | "float" | "int" | "bool",
    value: any
  ) {
    if (!this.program) {
      throw new Error("A program is requiered to create a ser uniform");
    }

    const location = this.gl.getUniformLocation(this.program, name);

    if (location === null) {
      console.error(`Uniform ${name} not found`);
      return;
    }

    switch (type) {
      case "mat4":
        this.gl.uniformMatrix4fv(location, false, value);
        break;

      case "mat3":
        this.gl.uniformMatrix3fv(location, false, value);
        break;

      case "vec4":
        this.gl.uniform4fv(location, value);
        break;

      case "vec3":
        this.gl.uniform3fv(location, value);
        break;

      case "vec2":
        this.gl.uniform2fv(location, value);
        break;

      case "float":
        this.gl.uniform1f(location, value);
        break;

      case "int":
        this.gl.uniform1i(location, value);
        break;

      case "bool":
        this.gl.uniform1i(location, value ? 1 : 0); // WebGL uses int for booleans (1 for true, 0 for false)
        break;

      default:
        console.warn(`Unsupported uniform type: ${type}`);
    }
  }

  public loadMesh(mesh: Mesh): LoadedMeshData {
    const vertexbuffer = this.createBuffer("array", "static", mesh.vertices);
    const indexBuffer = this.createBuffer("index", "static", mesh.triangles);

    return { mesh: mesh, indexBuffer, vertexbuffer };
  }

  public loadMeshes(meshes: Mesh[]): LoadedMeshData[] {
    const loadedMeshesData: LoadedMeshData[] = [];
    meshes.forEach((mesh) => loadedMeshesData.push(this.loadMesh(mesh)));
    return loadedMeshesData;
  }

  public getDeltaTime(): number {
    const thisFrameTime = performance.now();

    const dt = (thisFrameTime - this.lastFrameTime) / 1000;
    this.lastFrameTime = thisFrameTime;

    return dt;
  }

  public getCanvasAspectRatio() {
    return this.canvas.width / this.canvas.height;
  }

  //#endregion
}

// Interface definition for VAOConfig, which represents the configuration for a Vertex Array Object (VAO)
interface VAOConfig {
  // 'attributes' is an array of objects defining the vertex attributes for the VAO
  attributes: {
    name: string; // The name of the attribute (e.g., "position", "color", etc.)
    size: number; // The number of components per attribute (e.g., 3 for a 3D position)
    type: number; // The data type of the attribute (e.g., WebGLRenderingContext.FLOAT)
    normalized?: boolean; // Whether to normalize the values (optional)
    stride: number; // The offset in bytes between consecutive vertex attributes in the buffer
    offset: number; // The byte offset to the first element of the attribute in the buffer
    buffer: WebGLBuffer; // The WebGLBuffer that holds the attribute data
  }[];

  indexBuffer?: WebGLBuffer; // Optional; if provided, it will be used to index into the vertices
}

interface DrawConfig {
  vao: WebGLVertexArrayObject;
  drawMode?: number; // gl.TRIANGLES, gl.LINES, etc.
  count: number; // Number of vertices/indices to draw
  indexed?: boolean; // Whether to use index buffer
}

interface LoadedMeshData {
  mesh: Mesh;
  vertexbuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
}
