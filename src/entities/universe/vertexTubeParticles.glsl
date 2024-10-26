uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 uMouse;
uniform sampler2D texture1;

attribute vec3 aRandom;
attribute float aSize;

uniform float mainRadius;
uniform float countLines;
uniform float heightLines;

uniform float tubeRadius;
uniform float timeFactor;

float PI = 3.141592653589793238;

//vec3 getPos(float progress){
//  float angle = progress * PI * 2.;
//  float x = sin(angle) + 2. * sin(2. * angle);
//  float y = cos(angle) - 2. * cos(2. * angle);
//  float z = -sin(3. * angle);
//  return vec3(x,y,z);
//}

vec3 getPos(float progress){
  float angle = progress * PI * 2.;
  float x = sin(angle) + mainRadius * sin(countLines * angle);
  float y = cos(angle) - mainRadius * cos(countLines * angle);
  float z = -sin(heightLines * angle);
  return vec3(x,y,z);
}


vec3 getTangent(float progress) {
  float angle = progress * PI * 2.;
  float x = cos(angle) + mainRadius * 2. * cos(countLines * angle);
  float y = -sin(angle) + mainRadius * 2. * sin(countLines * angle);
  float z = 3. * -cos(heightLines * angle);
  return normalize(vec3(x,y,z));
}

vec3 getNormal(float progress) {
  float angle = progress * PI * 2.;
  float x = -sin(angle) - mainRadius * 3. * sin(countLines * angle);
  float y = -cos(angle) + mainRadius * 3. * cos(countLines * angle);
  float z = 9. * sin(heightLines * angle);
  return normalize(vec3(x,y,z));
}


void main() {
  vec3 pos = position;
  float timeResult = time * timeFactor;

  float progress = fract(timeResult*0.01 + aRandom.x);

  pos = getPos(progress);
  vec3 normal = getNormal(progress);
  vec3 tangent = getTangent(progress);
  vec3 binormal = normalize(cross(normal, tangent));

  float radius = 0.3 * aRandom.z * tubeRadius;
  float cx = radius * cos(aRandom.y * PI * 2. *timeResult*0.1 + aRandom.z * 7.);
  float cy = radius * sin(aRandom.y * PI * 2. *timeResult*0.1 + aRandom.z * 7.);

//  float cx = cos(aRandom.y * PI * 2. *timeResult*0.1 + aRandom.z * 7.);
//  float cy = sin(aRandom.y * PI * 2. *timeResult*0.1 + aRandom.z * 7.);

  pos += (normal * cx + binormal * cy);
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4( pos, 1. );
  gl_PointSize = 13. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}