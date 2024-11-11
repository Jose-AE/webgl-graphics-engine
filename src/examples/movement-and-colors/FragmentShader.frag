#version 300 es
precision mediump float;


in vec3 fragmentColor;

//fragment shaders output a color
out vec4 outputColor; // in fragment shaders we have to manually specify the output variable

void main() {

    outputColor = vec4(fragmentColor,1.0);

}