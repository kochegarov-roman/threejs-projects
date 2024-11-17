uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vPosition = position;
  vNormal = normal;
  vUv = uv;
  // Transform -> position, scale, rotation
  // modelMatrix ->  position, scale, rotation of our model
  // viewMatrix -> position, orientation of our camera
  // projectionMatrix -> projects out object onto the screen (acpect ration & the prespective)
  gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4( position, 1.0 );
}