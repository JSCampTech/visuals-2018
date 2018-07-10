export default `
precision highp float;
uniform sampler2D map;
uniform float opacity;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 blend(vec3 target, vec3 blend) {
  return 1. - (1.-target) * (1.-blend);
}

void main() {
  vec4 c = texture2D(map, vUv);
  float l = luma(c.rgb);
  vec3 color1 = vec3(1.,0.,1.);
  vec3 color2 = vec3(0.,0.,1.);

  vec2 center = vec2(.5);
  vec2 scale = vec2(1.);
  float angle = M_PI / 8.;
  vec2 a = center - vec2(scale.x*cos(angle), scale.y*sin(angle));
  vec2 b = center + vec2(scale.x*cos(angle), scale.y*sin(angle));

  vec2 ba = b - a;
  float t = dot(vUv - a, ba) / dot(ba, ba);
  t = smoothstep(0.0, 1.0, clamp(t, 0.0, 1.0));
  vec3 g = mix(color1, color2, t);

  gl_FragColor = vec4(blend(c.rgb,g), .9 + .1* l);
  gl_FragColor.a *= opacity;

}
`;
