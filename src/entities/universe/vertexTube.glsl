uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D texture1;

attribute vec3 aRandom;
attribute float aSize;

float PI = 3.141592653589793238;

//vec3 getPos(float progress){
//  float angle = progress * PI * 2.;
//  float x = sin(angle) + 2. * sin(2. * angle);
//  float y = cos(angle) - 2. * cos(2. * angle);
//  float z = -sin(3. * angle);
//  return vec3(x,y,z);
//}
//
//
//vec3 getTangent(float progress) {
//  float angle = progress * PI * 2.;
//  float x = cos(angle) + 4. * cos(2. * angle);
//  float y = -sin(angle) + 4. * sin(2. * angle);
//  float z = 3. * -cos(3. * angle);
//  return normalize(vec3(x,y,z));
//}
//
//vec3 getNormal(float progress) {
//  float angle = progress * PI * 2.;
//  float x = -sin(angle) - 8. * sin(2. * angle);
//  float y = -cos(angle) + 8. * cos(2. * angle);
//  float z = 9. * sin(3. * angle);
//  return normalize(vec3(x,y,z));
//}

void main() {
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1. );
  gl_Position = projectionMatrix * mvPosition;
}