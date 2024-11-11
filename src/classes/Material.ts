import { Vector3 } from "./Vector3";

export class Material {
  ambient: Vector3;
  diffuse: Vector3;
  specular: Vector3;
  shininess: number;

  constructor(parameters: { ambient?: Vector3; diffuse?: Vector3; specular?: Vector3; shininess?: number } = {}) {
    this.ambient = parameters.ambient || new Vector3(0.1, 0.1, 0.1); // default low ambient light
    this.diffuse = parameters.diffuse || new Vector3(0.8, 0.8, 0.8); // default white diffuse light
    this.specular = parameters.specular || new Vector3(1, 1, 1); // default white specular light
    this.shininess = parameters.shininess !== undefined ? parameters.shininess : 32; // default shininess
  }
}
