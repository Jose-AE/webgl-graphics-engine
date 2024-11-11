#version 300 es
precision mediump float;

in vec2 vertexPos; //"in" means its an atribute meaning we will get it from a buffer

void main() {
    gl_Position = vec4(vertexPos.x, vertexPos.y, 0.0f, 1.0f); //gl_Position is a special variable that works as the output variable 

}