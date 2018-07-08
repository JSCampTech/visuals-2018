export default `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying float intensity;
void main() {
  intensity = .5;//position.z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1. );
  gl_PointSize = clamp(10. / gl_Position.z,.1,20.);
}
`;
