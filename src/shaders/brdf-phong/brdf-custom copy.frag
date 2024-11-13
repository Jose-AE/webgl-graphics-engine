#version 300 es

precision mediump float;

in vec4 v_normal;

out vec4 fragColor;

mat4 translationMatrix(vec3 translation) {
    return mat4(1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 1.0f, 0.0f, translation.x, translation.y, translation.z, 1.0f);
}

mat4 yRotationMatrix(float deg) {
    float rad = radians(deg); // Convert degrees to radians
    float c = cos(rad);       // Cosine of the angle
    float s = sin(rad);       // Sine of the angle

    return mat4(vec4(c, 0.0f, s, 0.0f),  // First column
    vec4(0.0f, 1.0f, 0.0f, 0.0f),// Second column (Y-axis unchanged)
    vec4(-s, 0.0f, c, 0.0f),   // Third column
    vec4(0.0f, 0.0f, 0.0f, 1.0f) // Fourth column (for homogeneous coordinates)
    );
}

void main() {
    vec3 ambientCoefficient = vec3(0.13923f, 0.10437f, 0.18860f);
    vec3 diffuseCoefficient = vec3(0.15792f, 0.74833f, 0.04077f);
    vec3 specularCoefficient = vec3(0.27269f, 0.33200f, 0.10353f);

    vec3 ambientIntensity = vec3(0.89436f, 0.92097f, 0.93538f);
    vec3 diffuseIntensity = vec3(0.96499f, 0.97979f, 0.84789f);
    vec3 specularIntensity = vec3(0.98754f, 0.85057f, 0.99825f);

    float alpha = 11.0f;
    float sphereRadius = 0.99671f;
    vec3 sphereCenter = vec3(-1.58f, 1.08f, -0.08f);

    vec3 cameraPos = vec3(-5.05709f, 3.97601f, 2.92484f);
    vec3 lightPos = vec3(-3.76900f, 3.03352f, -3.28986f);

    float poiInclination = radians(51.0f);
    float poiAzimuth = radians(240.0f); 

    // Calculate Point of Interest (POI)
    vec3 poi = vec3(sphereCenter.x + sphereRadius * sin(poiInclination) * sin(poiAzimuth), sphereCenter.y + sphereRadius * cos(poiInclination), sphereCenter.z + sphereRadius * sin(poiInclination) * cos(poiAzimuth));

    // Calculate normalized vectors
    vec3 N = normalize(poi - sphereCenter);  // Normal at POI
    vec3 L = normalize(lightPos - poi);      // Light direction
    vec3 V = normalize(cameraPos - poi);     // View direction
    vec3 R = normalize(reflect(-L, N));      // Reflection vector

    // Calculate lighting factors 
    float diffuseFactor = dot(N, L);
    float specularFactor = pow(dot(R, V), alpha);

    // Calculate final color using Phong illumination model
    vec3 ambient = ambientCoefficient * ambientIntensity;
    vec3 diffuse = diffuseCoefficient * diffuseIntensity * diffuseFactor;
    vec3 specular = specularCoefficient * specularIntensity * specularFactor;

    vec3 color = ambient + diffuse + specular;

    vec3 temp = vec3(0.61777f, 0.69704f, 0.5f);

    fragColor = vec4(color, 1.0f);
}