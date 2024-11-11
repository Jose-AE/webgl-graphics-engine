#version 300 es
precision mediump float;

in vec3 vertexPosition; //"in" means its an atribute meaning we will get it from a buffer
in vec3 vertexColor;

out vec3 fragmentColor; //out means it will pass this to the fragment shader (fragment sahder has to have a "in" with the same var name)


uniform mat4 matWorld;
uniform mat4 matViewProj;



void main() {
    fragmentColor = vertexColor;


  
    gl_Position = matViewProj * matWorld * vec4(vertexPosition, 1.0f); 

}