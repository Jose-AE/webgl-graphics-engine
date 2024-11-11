#version 300 es
precision mediump float;

//fragment shaders output a color
out vec4 outputColor; // in fragment shaders we have to manually specify the output variable

void main() {

    outputColor = vec4(0.294,0.0,0.51,1.0);

}