class WebGLApp {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  constructor() {
    this.canvas = document.querySelector("#glCanvas") as HTMLCanvasElement;
    this.gl = this.canvas.getContext("webgl2") as WebGL2RenderingContext;

    if (!this.gl) {
      throw new Error("WebGL2 not supported");
    }

    this.init();
  }

  private init(): void {
    // Set clear color to black
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Clear the color buffer
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}

new WebGLApp();
