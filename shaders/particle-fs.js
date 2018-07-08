export default `
precision highp float;
varying float intensity;

void main() {
  float d = 2. * length( .5 - gl_PointCoord );
  float a = 1.-d;
  a = smoothstep(.45,.55,a);
  gl_FragColor = vec4(1.,1.,1.,intensity*a);
}
`;
