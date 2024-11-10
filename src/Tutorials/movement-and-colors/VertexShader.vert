#version 300 es
precision mediump float;

in vec2 vertexPos; //"in" means its an atribute meaning we will get it from a buffer
in vec3 vertexColor;

out vec3 fragmentColor; //out means it will pass this to the fragment shader (fragment sahder has to have a "in" with the same var name)

uniform vec2 canvasSize;
uniform vec2 shapeLocation; //uniform means they wont change during the draw call (you can change them inbetween draw cals from outside)
uniform float shapeSize;


void main() {
    fragmentColor = vertexColor;


    vec2 finalPos = vertexPos * shapeSize + shapeLocation;
    vec2 clipPosition = (finalPos / canvasSize) * 2.0f - 1.0f; //convert position to clip position (x can only be from -1 to 1  and same for y)

    gl_Position = vec4(clipPosition, 0.0f, 1.0f); //gl_Position is a special variable that works as the output variable 

}