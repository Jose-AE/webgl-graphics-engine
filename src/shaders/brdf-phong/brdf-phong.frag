#version 300 es

precision mediump float;

in vec4 v_normal;

out vec4 fragColor;

void main() {

    //Inputs
    vec3 lightColor = vec3(1.0f, 1.0f, 1.0f); // color - white
    vec3 lightSource = vec3(1.0f, 0.0f, 0.0f); // coord - (1,0,0)
    vec3 modelColor = vec3(1.0f, 1.0f, 1.0f);
    vec3 normal = normalize(v_normal.xyz);
    vec3 cameraSource = vec3(0.0f, 0.0f, 1.0f);
    float shininess = 64.0f;

    ///ambien
    vec3 ambient = vec3(0.0f, 0.0f, 0.0f);

    //Diffuse
    float diffuseStrength = max(0.0f, dot(lightSource, normal));
    vec3 diffuse = diffuseStrength * lightColor;

    ///Specular
    vec3 viewSource = normalize(cameraSource);
    vec3 reflectSource = normalize(reflect(-lightSource, normal));
    float specularStrength = max(0.0f, dot(viewSource, reflectSource));
    specularStrength = pow(specularStrength, shininess);
    vec3 specular = specularStrength * lightColor;

    /////Add them
    vec3 lighting = ambient + diffuse + specular;

    vec3 color = modelColor * lighting;
    fragColor = vec4(color, 1.f);
}