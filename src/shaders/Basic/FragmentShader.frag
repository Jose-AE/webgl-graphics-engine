#version 300 es
precision mediump float;

in vec3 vPosition;
out vec4 outputColor;

void main() {
    // Normalize position coordinates to create color gradient
    vec3 color = 0.5 + 0.5 * normalize(vPosition);
    outputColor = vec4(color, 1.0);
}