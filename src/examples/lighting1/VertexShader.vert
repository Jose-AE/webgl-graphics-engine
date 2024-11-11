#version 300 es

in vec3 vertexPosition;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
out vec3 vPosition; // Pass position to fragment shader for coloring

void main() {
    vPosition = vertexPosition; // Pass the position to fragment shader
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(vertexPosition, 1.0);
}