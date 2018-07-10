export default `
precision highp float;
uniform sampler2D map;
varying vec2 vUV;
void main() {
  vec4 c = texture2D( map, vUV ).rgba;
  if (c.a<.1) {
    discard;
  }
  gl_FragColor = vec4(1.,1.,1.,c.a);
}
`;
